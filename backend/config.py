import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    PORT = int(os.getenv('PORT', 5000))
    
    # API Keys
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
    
    # Application Settings
    MAX_REPO_SIZE_MB = int(os.getenv('MAX_REPO_SIZE_MB', 500))
    ANALYSIS_TIMEOUT_SECONDS = int(os.getenv('ANALYSIS_TIMEOUT_SECONDS', 300))
    MAX_FILES_TO_ANALYZE = int(os.getenv('MAX_FILES_TO_ANALYZE', 1000))
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE = int(os.getenv('RATE_LIMIT_PER_MINUTE', 10))
    RATE_LIMIT_PER_HOUR = int(os.getenv('RATE_LIMIT_PER_HOUR', 100))
    
    # File Patterns to Ignore
    IGNORED_PATTERNS = [
        'node_modules/', 'venv/', 'env/', '.git/', 'dist/', 'build/',
        '__pycache__/', '.pytest_cache/', 'coverage/', '.next/',
        '*.log', '*.pyc', '*.pyo', '*.pyd', '*.so', '*.dll',
        '*.min.js', '*.min.css', '*.map', '*.lock'
    ]
    
    # Important Files to Prioritize
    PRIORITY_FILES = [
        'README.md', 'README.rst', 'README.txt',
        'package.json', 'requirements.txt', 'Pipfile', 'pyproject.toml',
        'Cargo.toml', 'go.mod', 'pom.xml', 'build.gradle',
        'Dockerfile', 'docker-compose.yml',
        '.env.example', 'config.js', 'config.py'
    ]
    
    @staticmethod
    def validate():
        """Validate required configuration"""
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is required")
        return True

# Made with Bob
