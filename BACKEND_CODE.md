# Backend Code - Complete Implementation

This document contains all backend code files for the AI-powered developer onboarding platform.

## Directory Structure
```
backend/
├── app.py
├── config.py
├── requirements.txt
├── .env.example
├── routes/
│   ├── __init__.py
│   └── repository_routes.py
├── services/
│   ├── __init__.py
│   ├── repository_service.py
│   └── onboarding_service.py
├── github/
│   ├── __init__.py
│   ├── github_client.py
│   └── repository_parser.py
├── ai/
│   ├── __init__.py
│   ├── claude_client.py
│   └── prompt_templates.py
└── utils/
    ├── __init__.py
    ├── validators.py
    ├── file_analyzer.py
    └── error_handlers.py
```

## Core Files

### `routes/__init__.py`
```python
# Empty file to make routes a package
```

### `routes/repository_routes.py`
```python
from flask import Blueprint, request, jsonify
import logging
from services.onboarding_service import OnboardingService
from utils.validators import validate_github_url

repository_bp = Blueprint('repository', __name__)
logger = logging.getLogger(__name__)

@repository_bp.route('/analyze', methods=['POST'])
def analyze_repository():
    try:
        data = request.get_json()
        
        if not data or 'repository_url' not in data:
            return jsonify({
                'success': False,
                'error': {'message': 'repository_url is required', 'code': 'MISSING_URL'}
            }), 400
        
        repo_url = data['repository_url'].strip()
        is_valid, error_message = validate_github_url(repo_url)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'error': {'message': error_message, 'code': 'INVALID_URL'}
            }), 400
        
        logger.info(f"Analyzing repository: {repo_url}")
        service = OnboardingService()
        result = service.generate_onboarding(repo_url)
        
        return jsonify({'success': True, 'data': result}), 200
        
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': {'message': str(e), 'code': 'ANALYSIS_ERROR'}
        }), 500
```

### `services/__init__.py`
```python
# Empty file to make services a package
```

### `services/onboarding_service.py`
```python
import logging
from typing import Dict, Any
from github.github_client import GitHubClient
from github.repository_parser import RepositoryParser
from ai.claude_client import ClaudeClient
from utils.file_analyzer import FileAnalyzer

logger = logging.getLogger(__name__)

class OnboardingService:
    def __init__(self):
        self.github_client = GitHubClient()
        self.parser = RepositoryParser()
        self.ai_client = ClaudeClient()
        self.file_analyzer = FileAnalyzer()
    
    def generate_onboarding(self, repo_url: str) -> Dict[str, Any]:
        try:
            logger.info("Fetching repository...")
            repo_path = self.github_client.clone_repository(repo_url)
            
            logger.info("Parsing repository structure...")
            repo_data = self.parser.parse_repository(repo_path)
            
            logger.info("Analyzing files...")
            analysis = self.file_analyzer.analyze_repository(repo_data)
            
            logger.info("Generating onboarding content with AI...")
            onboarding_guide = self.ai_client.generate_onboarding_guide(repo_data, analysis)
            
            self.github_client.cleanup(repo_path)
            
            return {
                'repository': {
                    'name': repo_data['name'],
                    'owner': repo_data.get('owner', 'unknown'),
                    'url': repo_url,
                    'description': repo_data.get('description', '')
                },
                'onboarding': onboarding_guide
            }
        except Exception as e:
            logger.error(f"Error generating onboarding: {str(e)}")
            raise
```

### `github/__init__.py`
```python
# Empty file to make github a package
```

### `github/github_client.py`
```python
import os
import tempfile
import shutil
import logging
import git
from urllib.parse import urlparse
from config import Config

logger = logging.getLogger(__name__)

class GitHubClient:
    def __init__(self):
        self.config = Config()
        self.temp_dirs = []
    
    def clone_repository(self, repo_url: str) -> str:
        try:
            temp_dir = tempfile.mkdtemp(prefix='devonboard_')
            self.temp_dirs.append(temp_dir)
            
            logger.info(f"Cloning repository to {temp_dir}")
            git.Repo.clone_from(repo_url, temp_dir, depth=1, single_branch=True)
            
            logger.info("Repository cloned successfully")
            return temp_dir
        except git.GitCommandError as e:
            logger.error(f"Git clone failed: {str(e)}")
            raise Exception(f"Failed to clone repository: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise
    
    def cleanup(self, repo_path: str):
        try:
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path, ignore_errors=True)
                logger.info(f"Cleaned up repository at {repo_path}")
                if repo_path in self.temp_dirs:
                    self.temp_dirs.remove(repo_path)
        except Exception as e:
            logger.warning(f"Failed to cleanup {repo_path}: {str(e)}")
    
    @staticmethod
    def extract_repo_info(repo_url: str) -> dict:
        parsed = urlparse(repo_url)
        path_parts = parsed.path.strip('/').split('/')
        if len(path_parts) >= 2:
            return {'owner': path_parts[0], 'name': path_parts[1].replace('.git', '')}
        raise ValueError("Invalid GitHub URL format")
```

### `github/repository_parser.py`
```python
import os
import logging
from typing import Dict, List, Any
from pathlib import Path
from config import Config

logger = logging.getLogger(__name__)

class RepositoryParser:
    def __init__(self):
        self.config = Config()
    
    def parse_repository(self, repo_path: str) -> Dict[str, Any]:
        try:
            repo_name = os.path.basename(repo_path)
            structure = self._get_directory_structure(repo_path)
            files = self._get_file_list(repo_path)
            priority_files = self._extract_priority_files(repo_path)
            languages = self._detect_languages(files)
            
            return {
                'name': repo_name,
                'owner': 'unknown',
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
        structure = {}
        try:
            for root, dirs, files in os.walk(repo_path):
                dirs[:] = [d for d in dirs if not self._should_ignore(d)]
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
                        if file_size > 1024 * 1024:
                            continue
                        files.append({
                            'path': rel_path,
                            'name': filename,
                            'size': file_size,
                            'extension': Path(filename).suffix
                        })
                    except Exception as e:
                        logger.warning(f"Error processing file {rel_path}: {str(e)}")
        except Exception as e:
            logger.error(f"Error getting file list: {str(e)}")
        return files
    
    def _extract_priority_files(self, repo_path: str) -> Dict[str, str]:
        priority_content = {}
        for priority_file in self.config.PRIORITY_FILES:
            file_path = os.path.join(repo_path, priority_file)
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        if len(content) > 10000:
                            content = content[:10000] + "\n... (truncated)"
                        priority_content[priority_file] = content
                except Exception as e:
                    logger.warning(f"Error reading {priority_file}: {str(e)}")
        return priority_content
    
    def _detect_languages(self, files: List[Dict]) -> Dict[str, int]:
        language_map = {
            '.py': 'Python', '.js': 'JavaScript', '.jsx': 'JavaScript',
            '.ts': 'TypeScript', '.tsx': 'TypeScript', '.java': 'Java',
            '.go': 'Go', '.rs': 'Rust', '.cpp': 'C++', '.c': 'C',
            '.rb': 'Ruby', '.php': 'PHP', '.swift': 'Swift'
        }
        language_counts = {}
        for file in files:
            ext = file.get('extension', '')
            if ext in language_map:
                lang = language_map[ext]
                language_counts[lang] = language_counts.get(lang, 0) + 1
        return language_counts
    
    def _should_ignore(self, name: str) -> bool:
        for pattern in self.config.IGNORED_PATTERNS:
            if pattern.endswith('/'):
                if name == pattern[:-1] or name.startswith(pattern[:-1]):
                    return True
            elif name.endswith(pattern.replace('*', '')):
                return True
        return False
```

### `ai/__init__.py`
```python
# Empty file to make ai a package
```

### `ai/claude_client.py`
```python
import logging
from typing import Dict, Any
import anthropic
from config import Config
from ai.prompt_templates import PromptTemplates

logger = logging.getLogger(__name__)

class ClaudeClient:
    def __init__(self):
        self.config = Config()
        self.client = anthropic.Anthropic(api_key=self.config.ANTHROPIC_API_KEY)
        self.templates = PromptTemplates()
    
    def generate_onboarding_guide(self, repo_data: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        try:
            context = self._prepare_context(repo_data, analysis)
            prompt = self.templates.create_onboarding_prompt(context)
            
            logger.info("Sending request to Claude API...")
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                temperature=0.7,
                messages=[{"role": "user", "content": prompt}]
            )
            
            content = response.content[0].text
            onboarding_guide = self._parse_ai_response(content)
            
            logger.info("Successfully generated onboarding guide")
            return onboarding_guide
        except Exception as e:
            logger.error(f"Error generating onboarding guide: {str(e)}")
            raise
    
    def _prepare_context(self, repo_data: Dict[str, Any], analysis: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'repo_name': repo_data['name'],
            'languages': repo_data.get('languages', {}),
            'total_files': repo_data.get('total_files', 0),
            'structure': repo_data.get('structure', {}),
            'priority_files': repo_data.get('priority_files', {}),
            'tech_stack': analysis.get('tech_stack', []),
            'frameworks': analysis.get('frameworks', []),
            'entry_points': analysis.get('entry_points', [])
        }
    
    def _parse_ai_response(self, content: str) -> Dict[str, Any]:
        return {
            'overview': content,
            'tech_stack': [],
            'folder_structure': '',
            'setup_instructions': '',
            'entry_points': [],
            'contribution_guide': '',
            'learning_path': ''
        }
```

### `ai/prompt_templates.py`
```python
from typing import Dict, Any

class PromptTemplates:
    @staticmethod
    def create_onboarding_prompt(context: Dict[str, Any]) -> str:
        repo_name = context.get('repo_name', 'Unknown')
        languages = context.get('languages', {})
        priority_files = context.get('priority_files', {})
        structure = context.get('structure', {})
        
        lang_summary = ", ".join([f"{lang} ({count} files)" for lang, count in languages.items()])
        files_summary = "\n\n".join([
            f"**{filename}**:\n```\n{content[:500]}...\n```"
            for filename, content in list(priority_files.items())[:3]
        ])
        
        prompt = f"""You are an expert developer onboarding specialist. Analyze this GitHub repository and create a comprehensive onboarding guide.

**Repository**: {repo_name}
**Languages**: {lang_summary}

**Key Files**:
{files_summary}

**Directory Structure**:
{PromptTemplates._format_structure(structure)}

Generate a detailed onboarding guide with these sections:

1. **Project Overview**: Clear description of the project's purpose and features
2. **Tech Stack**: All technologies, frameworks, and tools used
3. **Folder Structure**: Purpose of each major directory
4. **Setup Instructions**: Step-by-step setup guide with prerequisites
5. **Entry Points**: Main entry points and their purposes
6. **Contribution Workflow**: How to contribute to the project
7. **Learning Path**: Suggested order to explore the codebase

Format in clear markdown with headings, code blocks, and bullet points."""

        return prompt
    
    @staticmethod
    def _format_structure(structure: Dict, max_items: int = 10) -> str:
        formatted = []
        for path, content in list(structure.items())[:max_items]:
            dirs = content.get('dirs', [])
            files = content.get('files', [])
            formatted.append(f"- {path}/")
            if dirs:
                formatted.append(f"  - Subdirectories: {', '.join(dirs[:5])}")
            if files:
                formatted.append(f"  - Files: {', '.join(files[:5])}")
        return "\n".join(formatted)
```

### `utils/__init__.py`
```python
# Empty file to make utils a package
```

### `utils/validators.py`
```python
import re
from typing import Tuple
from urllib.parse import urlparse

def validate_github_url(url: str) -> Tuple[bool, str]:
    if not url:
        return False, "URL cannot be empty"
    
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid URL format"
    
    if parsed.netloc not in ['github.com', 'www.github.com']:
        return False, "URL must be from github.com"
    
    path_parts = parsed.path.strip('/').split('/')
    if len(path_parts) < 2:
        return False, "Invalid GitHub repository URL format"
    
    owner = path_parts[0]
    repo = path_parts[1].replace('.git', '')
    
    if not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$', owner):
        return False, "Invalid GitHub username or organization"
    
    if not re.match(r'^[a-zA-Z0-9._-]+$', repo):
        return False, "Invalid repository name"
    
    return True, ""
```

### `utils/file_analyzer.py`
```python
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class FileAnalyzer:
    def analyze_repository(self, repo_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            return {
                'tech_stack': self._detect_tech_stack(repo_data),
                'frameworks': self._detect_frameworks(repo_data),
                'entry_points': self._find_entry_points(repo_data),
                'has_tests': self._has_tests(repo_data),
                'has_ci': self._has_ci(repo_data)
            }
        except Exception as e:
            logger.error(f"Error analyzing repository: {str(e)}")
            return {}
    
    def _detect_tech_stack(self, repo_data: Dict) -> List[str]:
        tech_stack = []
        priority_files = repo_data.get('priority_files', {})
        
        if 'package.json' in priority_files:
            tech_stack.append('Node.js')
        if 'requirements.txt' in priority_files or 'Pipfile' in priority_files:
            tech_stack.append('Python')
        if 'Dockerfile' in priority_files:
            tech_stack.append('Docker')
        
        return tech_stack
    
    def _detect_frameworks(self, repo_data: Dict) -> List[str]:
        frameworks = []
        priority_files = repo_data.get('priority_files', {})
        
        if 'package.json' in priority_files:
            content = priority_files['package.json'].lower()
            if 'react' in content:
                frameworks.append('React')
            if 'vue' in content:
                frameworks.append('Vue')
            if 'express' in content:
                frameworks.append('Express')
        
        if 'requirements.txt' in priority_files:
            content = priority_files['requirements.txt'].lower()
            if 'flask' in content:
                frameworks.append('Flask')
            if 'django' in content:
                frameworks.append('Django')
        
        return frameworks
    
    def _find_entry_points(self, repo_data: Dict) -> List[str]:
        entry_points = []
        files = repo_data.get('files', [])
        common_entry_points = ['main.py', 'app.py', 'index.js', 'main.js', 'app.js']
        
        for file in files:
            if file['name'] in common_entry_points:
                entry_points.append(file['path'])
        
        return entry_points
    
    def _has_tests(self, repo_data: Dict) -> bool:
        structure = repo_data.get('structure', {})
        test_indicators = ['test', 'tests', '__tests__', 'spec']
        return any(indicator in path.lower() for path in structure.keys() for indicator in test_indicators)
    
    def _has_ci(self, repo_data: Dict) -> bool:
        structure = repo_data.get('structure', {})
        ci_indicators = ['.github/workflows', '.gitlab-ci', '.circleci']
        return any(indicator in path.lower() for path in structure.keys() for indicator in ci_indicators)
```

### `utils/error_handlers.py`
```python
from flask import jsonify
import logging

logger = logging.getLogger(__name__)

class RepositoryError(Exception):
    pass

class AIGenerationError(Exception):
    pass

def register_error_handlers(app):
    @app.errorhandler(RepositoryError)
    def handle_repository_error(error):
        logger.error(f"Repository error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {'message': str(error), 'code': 'REPOSITORY_ERROR'}
        }), 400
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            'success': False,
            'error': {'message': 'Endpoint not found', 'code': 'NOT_FOUND'}
        }), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {'message': 'Internal server error', 'code': 'INTERNAL_ERROR'}
        }), 500
```

## Deployment Files

### `Procfile` (for Heroku/Railway)
```
web: gunicorn app:app
```

### `.gitignore`
```
venv/
env/
__pycache__/
*.pyc
.env
*.log
.DS_Store
temp_repos/
```

## Testing

### Test Script (`test_api.py`)
```python
import requests

def test_analyze():
    url = "http://localhost:5000/api/analyze"
    data = {"repository_url": "https://github.com/pallets/flask"}
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_analyze()
```

Run with: `python test_api.py`