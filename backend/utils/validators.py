import re
from typing import Tuple
from urllib.parse import urlparse

def validate_github_url(url: str) -> Tuple[bool, str]:
    """
    Validate GitHub repository URL
    
    Args:
        url: URL to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not url:
        return False, "URL cannot be empty"
    
    # Parse URL
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid URL format"
    
    # Check if it's a GitHub URL
    if parsed.netloc not in ['github.com', 'www.github.com']:
        return False, "URL must be from github.com"
    
    # Check path format
    path_parts = parsed.path.strip('/').split('/')
    if len(path_parts) < 2:
        return False, "Invalid GitHub repository URL format"
    
    # Validate owner and repo name
    owner = path_parts[0]
    repo = path_parts[1].replace('.git', '')
    
    # GitHub username/org validation
    if not re.match(r'^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$', owner):
        return False, "Invalid GitHub username or organization"
    
    # GitHub repo name validation
    if not re.match(r'^[a-zA-Z0-9._-]+$', repo):
        return False, "Invalid repository name"
    
    return True, ""

def sanitize_input(text: str, max_length: int = 500) -> str:
    """
    Sanitize user input
    
    Args:
        text: Input text
        max_length: Maximum allowed length
        
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    # Remove control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char == '\n')
    
    # Limit length
    text = text[:max_length]
    
    # Strip whitespace
    text = text.strip()
    
    return text

# Made with Bob
