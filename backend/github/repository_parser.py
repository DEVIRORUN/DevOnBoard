import os
import logging
from typing import Dict, List, Any
from pathlib import Path

from config import Config

logger = logging.getLogger(__name__)

class RepositoryParser:
    """Parses repository structure and extracts metadata"""
    
    def __init__(self):
        self.config = Config()
    
    def parse_repository(self, repo_path: str) -> Dict[str, Any]:
        """
        Parse repository and extract structure
        
        Args:
            repo_path: Path to cloned repository
            
        Returns:
            Dictionary containing repository metadata and structure
        """
        try:
            repo_name = os.path.basename(repo_path)
            
            # Get directory structure
            structure = self._get_directory_structure(repo_path)
            
            # Get file list
            files = self._get_file_list(repo_path)
            
            # Extract priority files
            priority_files = self._extract_priority_files(repo_path)
            
            # Detect languages
            languages = self._detect_languages(files)
            
            return {
                'name': repo_name,
                'owner': 'unknown',  # Will be set by service
                'path': repo_path,
                'structure': structure,
                'files': files,
                'priority_files': priority_files,
                'languages': languages,
                'total_files': len(files)
            }
            
        except Exception as e:
            logger.error(f"Error parsing repository: {str(e)}")
            raise
    
    def _get_directory_structure(self, repo_path: str, max_depth: int = 3) -> Dict:
        """Get directory tree structure"""
        structure = {}
        
        try:
            for root, dirs, files in os.walk(repo_path):
                # Skip ignored directories
                dirs[:] = [d for d in dirs if not self._should_ignore(d)]
                
                # Calculate depth
                depth = root[len(repo_path):].count(os.sep)
                if depth >= max_depth:
                    continue
                
                rel_path = os.path.relpath(root, repo_path)
                if rel_path == '.':
                    rel_path = 'root'
                
                structure[rel_path] = {
                    'dirs': dirs,
                    'files': [f for f in files if not self._should_ignore(f)]
                }
        
        except Exception as e:
            logger.warning(f"Error building directory structure: {str(e)}")
        
        return structure
    
    def _get_file_list(self, repo_path: str) -> List[Dict[str, Any]]:
        """Get list of all files with metadata"""
        files = []
        
        try:
            for root, _, filenames in os.walk(repo_path):
                for filename in filenames:
                    if self._should_ignore(filename):
                        continue
                    
                    file_path = os.path.join(root, filename)
                    rel_path = os.path.relpath(file_path, repo_path)
                    
                    try:
                        file_size = os.path.getsize(file_path)
                        
                        # Skip very large files
                        if file_size > 1024 * 1024:  # 1MB
                            continue
                        
                        files.append({
                            'path': rel_path,
                            'name': filename,
                            'size': file_size,
                            'extension': Path(filename).suffix
                        })
                    except Exception as e:
                        logger.warning(f"Error processing file {rel_path}: {str(e)}")
                        continue
        
        except Exception as e:
            logger.error(f"Error getting file list: {str(e)}")
        
        return files
    
    def _extract_priority_files(self, repo_path: str) -> Dict[str, str]:
        """Extract content from priority files"""
        priority_content = {}
        
        for priority_file in self.config.PRIORITY_FILES:
            file_path = os.path.join(repo_path, priority_file)
            
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        # Limit content size
                        if len(content) > 10000:
                            content = content[:10000] + "\n... (truncated)"
                        priority_content[priority_file] = content
                except Exception as e:
                    logger.warning(f"Error reading {priority_file}: {str(e)}")
        
        return priority_content
    
    def _detect_languages(self, files: List[Dict]) -> Dict[str, int]:
        """Detect programming languages used"""
        language_map = {
            '.py': 'Python',
            '.js': 'JavaScript',
            '.jsx': 'JavaScript',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript',
            '.java': 'Java',
            '.go': 'Go',
            '.rs': 'Rust',
            '.cpp': 'C++',
            '.c': 'C',
            '.rb': 'Ruby',
            '.php': 'PHP',
            '.swift': 'Swift',
            '.kt': 'Kotlin',
            '.cs': 'C#',
            '.html': 'HTML',
            '.css': 'CSS',
            '.scss': 'SCSS',
            '.vue': 'Vue',
            '.sql': 'SQL'
        }
        
        language_counts = {}
        
        for file in files:
            ext = file.get('extension', '')
            if ext in language_map:
                lang = language_map[ext]
                language_counts[lang] = language_counts.get(lang, 0) + 1
        
        return language_counts
    
    def _should_ignore(self, name: str) -> bool:
        """Check if file/directory should be ignored"""
        for pattern in self.config.IGNORED_PATTERNS:
            if pattern.endswith('/'):
                if name == pattern[:-1] or name.startswith(pattern[:-1]):
                    return True
            elif name.endswith(pattern.replace('*', '')):
                return True
        return False

# Made with Bob
