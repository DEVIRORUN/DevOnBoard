import logging
from typing import Dict, Any

from github.github_client import GitHubClient
from github.repository_parser import RepositoryParser
from ai.gemini_client import GeminiClient
from utils.file_analyzer import FileAnalyzer

logger = logging.getLogger(__name__)

class OnboardingService:
    """Orchestrates the repository analysis and onboarding generation"""
    
    def __init__(self):
        self.github_client = GitHubClient()
        self.parser = RepositoryParser()
        self.ai_client = GeminiClient()
        self.file_analyzer = FileAnalyzer()
    
    def generate_onboarding(self, repo_url: str) -> Dict[str, Any]:
        """
        Generate comprehensive onboarding guide for a repository
        
        Args:
            repo_url: GitHub repository URL
            
        Returns:
            Dictionary containing repository info and onboarding guide
        """
        try:
            # Step 1: Fetch repository data via GitHub API (much faster!)
            logger.info("Fetching repository data via GitHub API...")
            repo_data = self.github_client.fetch_repository_data(repo_url)
            
            # Step 2: Analyze files
            logger.info("Analyzing files...")
            analysis = self.file_analyzer.analyze_repository(repo_data)
            
            # Step 3: Generate AI content
            logger.info("Generating onboarding content with AI...")
            onboarding_guide = self.ai_client.generate_onboarding_guide(
                repo_data, analysis
            )
            
            # Step 4: Format response
            return {
                'repository': {
                    'name': repo_data['name'],
                    'owner': repo_data.get('owner', 'unknown'),
                    'url': repo_url,
                    'description': repo_data.get('description', ''),
                    'stars': repo_data.get('stars', 0),
                    'forks': repo_data.get('forks', 0)
                },
                'onboarding': onboarding_guide
            }
            
        except Exception as e:
            logger.error(f"Error generating onboarding: {str(e)}")
            raise

# Made with Bob
