import logging
from typing import Dict, Any
import anthropic

from config import Config
from ai.prompt_templates import PromptTemplates

logger = logging.getLogger(__name__)

class ClaudeClient:
    """Handles interactions with Anthropic Claude API"""
    
    def __init__(self):
        self.config = Config()
        self.client = anthropic.Anthropic(api_key=self.config.ANTHROPIC_API_KEY)
        self.templates = PromptTemplates()
    
    def generate_onboarding_guide(
        self, 
        repo_data: Dict[str, Any], 
        analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate comprehensive onboarding guide using Claude
        
        Args:
            repo_data: Repository metadata and structure
            analysis: File analysis results
            
        Returns:
            Dictionary containing onboarding guide sections
        """
        try:
            # Prepare context for AI
            context = self._prepare_context(repo_data, analysis)
            
            # Generate onboarding content
            prompt = self.templates.create_onboarding_prompt(context)
            
            logger.info("Sending request to Claude API...")
            
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                temperature=0.7,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Parse response
            content = response.content[0].text
            
            # Structure the response
            onboarding_guide = self._parse_ai_response(content, analysis)
            
            logger.info("Successfully generated onboarding guide")
            
            return onboarding_guide
            
        except Exception as e:
            logger.error(f"Error generating onboarding guide: {str(e)}")
            raise
    
    def _prepare_context(
        self, 
        repo_data: Dict[str, Any], 
        analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Prepare context for AI prompt"""
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
    
    def _parse_ai_response(self, content: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Parse AI response into structured format"""
        # Return the full content as overview
        # In a production system, you'd parse this more intelligently
        return {
            'overview': content,
            'tech_stack': analysis.get('tech_stack', []) + analysis.get('frameworks', []),
            'folder_structure': '',
            'setup_instructions': '',
            'entry_points': analysis.get('entry_points', []),
            'contribution_guide': '',
            'learning_path': ''
        }

# Made with Bob
