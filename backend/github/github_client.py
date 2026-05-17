import os
import logging
import requests
import base64
from urllib.parse import urlparse
from typing import Dict, List, Any

from config import Config

logger = logging.getLogger(__name__)

class GitHubClient:
    """Handles GitHub repository operations using GitHub API"""
    
    def __init__(self):
        self.config = Config()
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json"
        }
        if self.config.GITHUB_TOKEN:
            self.headers["Authorization"] = f"token {self.config.GITHUB_TOKEN}"
    
    def fetch_repository_data(self, repo_url: str) -> Dict[str, Any]:
        """
        Fetch repository data using GitHub API (much faster than cloning)
        
        Args:
            repo_url: GitHub repository URL
            
        Returns:
            Dictionary containing repository data
        """
        try:
            repo_info = self.extract_repo_info(repo_url)
            owner = repo_info['owner']
            repo = repo_info['name']
            
            logger.info(f"Fetching repository data for {owner}/{repo}")
            
            # Get repository metadata
            repo_data = self._get_repo_metadata(owner, repo)
            
            # Get repository tree (file structure)
            tree_data = self._get_repo_tree(owner, repo, repo_data.get('default_branch', 'main'))
            
            # Get important files content
            important_files = self._fetch_important_files(owner, repo, tree_data)
            
            # Get languages
            languages = self._get_languages(owner, repo)
            
            result = {
                'name': repo,
                'owner': owner,
                'description': repo_data.get('description', ''),
                'default_branch': repo_data.get('default_branch', 'main'),
                'languages': languages,
                'total_files': len(tree_data),
                'structure': self._build_structure(tree_data),
                'priority_files': important_files,
                'stars': repo_data.get('stargazers_count', 0),
                'forks': repo_data.get('forks_count', 0)
            }
            
            logger.info(f"Successfully fetched repository data ({len(tree_data)} files)")
            return result
            
        except Exception as e:
            logger.error(f"Error fetching repository: {str(e)}")
            raise Exception(f"Failed to fetch repository: {str(e)}")
    
    def _get_repo_metadata(self, owner: str, repo: str) -> Dict:
        """Get repository metadata"""
        url = f"{self.base_url}/repos/{owner}/{repo}"
        response = requests.get(url, headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()
    
    def _get_repo_tree(self, owner: str, repo: str, branch: str) -> List[Dict]:
        """Get repository file tree with retry logic"""
        url = f"{self.base_url}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
        
        # Retry logic for network issues
        max_retries = 3
        tree = []
        for attempt in range(max_retries):
            try:
                response = requests.get(
                    url,
                    headers=self.headers,
                    timeout=60,
                    stream=False  # Don't stream to avoid incomplete reads
                )
                response.raise_for_status()
                tree = response.json().get('tree', [])
                break
            except (requests.exceptions.ChunkedEncodingError,
                    requests.exceptions.ConnectionError) as e:
                if attempt < max_retries - 1:
                    logger.warning(f"Network error on attempt {attempt + 1}, retrying...")
                    continue
                else:
                    logger.error(f"Failed after {max_retries} attempts: {str(e)}")
                    raise
        
        # Filter out ignored patterns
        filtered_tree = []
        for item in tree:
            path = item.get('path', '')
            if not self._should_ignore(path):
                filtered_tree.append(item)
        
        return filtered_tree
    
    def _get_languages(self, owner: str, repo: str) -> Dict:
        """Get repository languages"""
        url = f"{self.base_url}/repos/{owner}/{repo}/languages"
        response = requests.get(url, headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()
    
    def _fetch_important_files(self, owner: str, repo: str, tree_data: List[Dict]) -> Dict[str, str]:
        """Fetch content of important files"""
        important_files = {}
        priority_patterns = self.config.PRIORITY_FILES
        
        # Find important files in tree
        files_to_fetch = []
        for item in tree_data:
            if item.get('type') == 'blob':
                path = item.get('path', '')
                filename = os.path.basename(path)
                
                # Check if it's a priority file
                if filename in priority_patterns or any(pattern in path for pattern in ['README', 'package.json', 'requirements.txt', 'Dockerfile']):
                    files_to_fetch.append(path)
                    if len(files_to_fetch) >= 10:  # Limit to 10 important files
                        break
        
        # Fetch file contents
        for file_path in files_to_fetch:
            try:
                content = self._get_file_content(owner, repo, file_path)
                if content:
                    important_files[file_path] = content
            except Exception as e:
                logger.warning(f"Could not fetch {file_path}: {str(e)}")
        
        return important_files
    
    def _get_file_content(self, owner: str, repo: str, path: str) -> str:
        """Get content of a specific file"""
        url = f"{self.base_url}/repos/{owner}/{repo}/contents/{path}"
        response = requests.get(url, headers=self.headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data.get('encoding') == 'base64':
            content = base64.b64decode(data['content']).decode('utf-8', errors='ignore')
            return content
        
        return data.get('content', '')
    
    def _build_structure(self, tree_data: List[Dict]) -> Dict:
        """Build a hierarchical structure from flat tree"""
        structure = {}
        
        for item in tree_data[:100]:  # Limit to first 100 items for structure
            path = item.get('path', '')
            parts = path.split('/')
            
            current = structure
            for part in parts[:-1]:
                if part not in current:
                    current[part] = {}
                current = current[part]
            
            if item.get('type') == 'blob':
                current[parts[-1]] = 'file'
            else:
                if parts[-1] not in current:
                    current[parts[-1]] = {}
        
        return structure
    
    def _should_ignore(self, path: str) -> bool:
        """Check if path should be ignored"""
        ignored = self.config.IGNORED_PATTERNS
        
        for pattern in ignored:
            if pattern.endswith('/'):
                if path.startswith(pattern) or f'/{pattern}' in path:
                    return True
            else:
                if path.endswith(pattern) or f'/{pattern}' in path:
                    return True
        
        return False
    
    @staticmethod
    def extract_repo_info(repo_url: str) -> dict:
        """
        Extract owner and repo name from GitHub URL
        
        Args:
            repo_url: GitHub repository URL
            
        Returns:
            Dictionary with owner and repo name
        """
        parsed = urlparse(repo_url)
        path_parts = parsed.path.strip('/').split('/')
        
        if len(path_parts) >= 2:
            return {
                'owner': path_parts[0],
                'name': path_parts[1].replace('.git', '')
            }
        
        raise ValueError("Invalid GitHub URL format")
    
    def cleanup(self, repo_path: str = None):
        """Cleanup method for compatibility (not needed with API approach)"""
        pass
    
    def cleanup_all(self):
        """Cleanup method for compatibility (not needed with API approach)"""
        pass

# Made with Bob
