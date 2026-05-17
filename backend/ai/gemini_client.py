import logging
from typing import Dict, Any
import google.generativeai as genai

from config import Config
from ai.prompt_engineer import PromptEngineer

logger = logging.getLogger(__name__)

class GeminiClient:
    """Handles interactions with Google Gemini API"""
    
    def __init__(self):
        self.config = Config()
        genai.configure(api_key=self.config.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        self.prompt_engineer = PromptEngineer()
    
    def generate_onboarding_guide(
        self, 
        repo_data: Dict[str, Any], 
        analysis: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate comprehensive onboarding guide using Gemini
        
        Args:
            repo_data: Repository metadata and structure
            analysis: File analysis results
            
        Returns:
            Dictionary containing onboarding guide sections
        """
        try:
            # Use Prompt Engineer to build optimized prompt
            logger.info("Building optimized prompt with Prompt Engineer...")
            prompt = self.prompt_engineer.build_onboarding_prompt(repo_data, analysis)
            
            logger.info("Sending request to Gemini API...")
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=4000,
                )
            )
            
            # Parse response
            content = response.text
            
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
