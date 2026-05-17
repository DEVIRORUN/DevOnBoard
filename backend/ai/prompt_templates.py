from typing import Dict, Any

class PromptTemplates:
    """Templates for AI prompts"""
    
    @staticmethod
    def create_onboarding_prompt(context: Dict[str, Any]) -> str:
        """
        Create comprehensive onboarding prompt for Claude
        
        Args:
            context: Repository context and analysis
            
        Returns:
            Formatted prompt string
        """
        repo_name = context.get('repo_name', 'Unknown')
        languages = context.get('languages', {})
        priority_files = context.get('priority_files', {})
        structure = context.get('structure', {})
        tech_stack = context.get('tech_stack', [])
        frameworks = context.get('frameworks', [])
        
        # Build language summary
        lang_summary = ", ".join([f"{lang} ({count} files)" 
                                 for lang, count in languages.items()])
        
        # Build priority files summary
        files_summary = "\n\n".join([
            f"**{filename}**:\n```\n{content[:500]}...\n```"
            for filename, content in list(priority_files.items())[:3]
        ])
        
        # Build tech stack summary
        tech_summary = ", ".join(tech_stack + frameworks) if (tech_stack or frameworks) else "Not detected"
        
        prompt = f"""You are an expert developer onboarding specialist. Analyze this GitHub repository and create a comprehensive onboarding guide for new developers.

**Repository**: {repo_name}

**Languages Detected**: {lang_summary or "Not detected"}

**Technologies**: {tech_summary}

**Key Files**:
{files_summary or "No key files found"}

**Directory Structure** (first 2 levels):
{PromptTemplates._format_structure(structure)}

Please generate a detailed onboarding guide with the following sections:

1. **Project Overview**: A clear, concise description of what this project does, its purpose, and its main features.

2. **Tech Stack**: List all technologies, frameworks, and tools used in this project. Be specific about versions if available.

3. **Folder Structure Explanation**: Explain the purpose of each major directory and how the code is organized.

4. **Setup Instructions**: Step-by-step instructions to get the project running locally, including:
   - Prerequisites (required software, versions)
   - Installation steps
   - Configuration needed
   - How to run the project
   - How to run tests (if applicable)

5. **Entry Points**: Identify the main entry points of the application (e.g., main.py, index.js, App.tsx) and explain what they do.

6. **Contribution Workflow**: Explain how a new developer should:
   - Set up their development environment
   - Make changes
   - Test their changes
   - Submit contributions

7. **Learning Path**: Suggest a learning path for new contributors, including:
   - Which files to read first
   - Key concepts to understand
   - Recommended order to explore the codebase

Format your response in clear markdown with proper headings, code blocks, and bullet points. Be specific and actionable."""

        return prompt
    
    @staticmethod
    def _format_structure(structure: Dict, max_items: int = 10, indent: int = 0) -> str:
        """Format directory structure for prompt"""
        if not structure:
            return "No structure information available"
        
        formatted = []
        items_processed = 0
        
        for name, content in structure.items():
            if items_processed >= max_items:
                break
            
            prefix = "  " * indent
            
            # If content is a dict, it's a directory
            if isinstance(content, dict):
                formatted.append(f"{prefix}- {name}/")
                # Recursively format subdirectories (limit depth to 2)
                if indent < 2 and content:
                    sub_formatted = PromptTemplates._format_structure(content, max_items=5, indent=indent+1)
                    if sub_formatted and sub_formatted != "No structure information available":
                        formatted.append(sub_formatted)
            else:
                # It's a file
                formatted.append(f"{prefix}- {name}")
            
            items_processed += 1
        
        return "\n".join(formatted) if formatted else "No structure information available"

# Made with Bob
