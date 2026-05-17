import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class PromptEngineer:
    """
    Advanced Prompt Engineering Layer
    Constructs optimized prompts for better AI responses with proper formatting
    """
    
    def __init__(self):
        self.max_context_length = 8000  # tokens
        
    def build_onboarding_prompt(self, repo_data: Dict[str, Any], analysis: Dict[str, Any]) -> str:
        """
        Build a comprehensive, well-structured prompt for onboarding guide generation
        
        Args:
            repo_data: Repository metadata and files
            analysis: Analysis results from FileAnalyzer
            
        Returns:
            Optimized prompt string
        """
        try:
            # Extract key information
            repo_name = repo_data.get('name', 'Unknown')
            languages = repo_data.get('languages', {})
            tech_stack = analysis.get('tech_stack', [])
            frameworks = analysis.get('frameworks', [])
            entry_points = analysis.get('entry_points', [])
            priority_files = repo_data.get('priority_files', {})
            structure = repo_data.get('structure', {})
            total_files = repo_data.get('total_files', 0)
            
            # Build structured prompt with clear sections
            prompt = self._build_system_context()
            prompt += self._build_repository_context(repo_name, total_files, languages)
            prompt += self._build_tech_stack_context(tech_stack, frameworks)
            prompt += self._build_structure_context(structure)
            prompt += self._build_priority_files_context(priority_files)
            prompt += self._build_entry_points_context(entry_points)
            prompt += self._build_output_format_instructions()
            
            logger.info(f"Built prompt with {len(prompt)} characters")
            return prompt
            
        except Exception as e:
            logger.error(f"Error building prompt: {str(e)}")
            raise
    
    def _build_system_context(self) -> str:
        """Build system context and role definition"""
        return """You are an expert software architect and technical writer specializing in developer onboarding.

Your task is to analyze a GitHub repository and create a comprehensive, well-structured onboarding guide that helps new developers quickly understand and contribute to the project.

CRITICAL FORMATTING RULES:
1. Use proper markdown formatting
2. Place code blocks on their own lines, never inline with text
3. Use triple backticks (```) for code blocks with language specification
4. Use single backticks (`) only for inline code references
5. Ensure all sections are clearly separated with proper headings
6. Use bullet points and numbered lists appropriately

"""
    
    def _build_repository_context(self, repo_name: str, total_files: int, languages: Dict) -> str:
        """Build repository context section"""
        lang_summary = ", ".join([f"{lang} ({count} files)" for lang, count in languages.items()]) if languages else "Not detected"
        
        return f"""## REPOSITORY INFORMATION

**Repository Name:** {repo_name}
**Total Files:** {total_files:,}
**Primary Languages:** {lang_summary}

"""
    
    def _build_tech_stack_context(self, tech_stack: list, frameworks: list) -> str:
        """Build technology stack context"""
        if not tech_stack and not frameworks:
            return ""
        
        tech_list = ", ".join(tech_stack) if tech_stack else "None detected"
        framework_list = ", ".join(frameworks) if frameworks else "None detected"
        
        return f"""## DETECTED TECHNOLOGIES

**Tech Stack:** {tech_list}
**Frameworks:** {framework_list}

"""
    
    def _build_structure_context(self, structure: Dict, max_depth: int = 2) -> str:
        """Build directory structure context"""
        if not structure:
            return ""
        
        structure_text = "## DIRECTORY STRUCTURE\n\n```\n"
        structure_text += self._format_structure_tree(structure, max_depth=max_depth)
        structure_text += "\n```\n\n"
        
        return structure_text
    
    def _format_structure_tree(self, structure: Dict, indent: int = 0, max_depth: int = 2, max_items: int = 15) -> str:
        """Format directory structure as a tree"""
        if indent >= max_depth:
            return ""
        
        lines = []
        items_shown = 0
        
        for path, content in sorted(structure.items())[:max_items]:
            if items_shown >= max_items:
                lines.append("  " * indent + "... (more files)")
                break
            
            prefix = "  " * indent
            
            if isinstance(content, dict):
                # Directory
                dirs = content.get('dirs', [])
                files = content.get('files', [])
                
                if path != 'root':
                    lines.append(f"{prefix}{path}/")
                
                # Show subdirectories
                for d in dirs[:5]:
                    lines.append(f"{prefix}  {d}/")
                
                # Show files
                for f in files[:5]:
                    lines.append(f"{prefix}  {f}")
                
                if len(dirs) > 5 or len(files) > 5:
                    lines.append(f"{prefix}  ... (more items)")
            
            items_shown += 1
        
        return "\n".join(lines)
    
    def _build_priority_files_context(self, priority_files: Dict) -> str:
        """Build context from priority files"""
        if not priority_files:
            return ""
        
        context = "## KEY CONFIGURATION FILES\n\n"
        
        for filename, content in list(priority_files.items())[:5]:
            # Truncate long content
            truncated_content = content[:1000] if len(content) > 1000 else content
            if len(content) > 1000:
                truncated_content += "\n... (truncated)"
            
            # Detect language for syntax highlighting
            lang = self._detect_file_language(filename)
            
            context += f"### {filename}\n\n"
            context += f"```{lang}\n{truncated_content}\n```\n\n"
        
        return context
    
    def _build_entry_points_context(self, entry_points: list) -> str:
        """Build entry points context"""
        if not entry_points:
            return ""
        
        entry_list = "\n".join([f"- `{ep}`" for ep in entry_points[:10]])
        
        return f"""## IDENTIFIED ENTRY POINTS

{entry_list}

"""
    
    def _build_output_format_instructions(self) -> str:
        """Build detailed output format instructions"""
        return """## YOUR TASK

Generate a comprehensive onboarding guide with the following sections. Follow the formatting rules strictly:

### 1. PROJECT OVERVIEW
- Provide a clear, concise description (2-3 paragraphs)
- Explain the project's purpose and main features
- Mention the target audience or use case

### 2. TECH STACK
- List all technologies, frameworks, and tools
- Include version numbers if available
- Explain why each technology was chosen (if apparent)

### 3. FOLDER STRUCTURE EXPLANATION
- Explain the purpose of each major directory
- Describe the organization pattern (e.g., feature-based, layer-based)
- Highlight important subdirectories

### 4. SETUP INSTRUCTIONS
Provide step-by-step instructions:

**Prerequisites:**
- List required software and versions
- Include links to installation guides

**Installation:**
```bash
# Example format - use actual commands
git clone <repo-url>
cd <repo-name>
npm install
```

**Configuration:**
- Explain environment variables
- Show example .env file if needed

**Running the Project:**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

**Running Tests:**
```bash
# If tests exist
npm test
```

### 5. ENTRY POINTS
- Identify main application entry points
- Explain what each entry point does
- Show the execution flow

### 6. CONTRIBUTION WORKFLOW
- Explain how to set up development environment
- Describe the branching strategy
- Outline the pull request process
- Mention coding standards or style guides

### 7. LEARNING PATH
Suggest a learning path for new contributors:
1. Start with [file/folder]
2. Then explore [file/folder]
3. Understand [concept/pattern]
4. Finally, review [advanced topics]

### 8. ADDITIONAL NOTES
- Mention any gotchas or common issues
- Link to additional documentation
- Provide contact information for help

## FORMATTING REQUIREMENTS

**CRITICAL:** Follow these rules exactly:

1. **Code Blocks:**
   - Always use triple backticks with language specification
   - Place code blocks on separate lines
   - Never put code blocks inline with text
   
   ✅ CORRECT:
   ```bash
   npm install
   ```
   
   ❌ WRONG:
   Run `npm install` (```bash npm install```)

2. **Inline Code:**
   - Use single backticks for file names, commands, or short code snippets
   - Example: `package.json`, `npm start`, `const x = 5`

3. **Headings:**
   - Use ## for main sections
   - Use ### for subsections
   - Use #### for sub-subsections

4. **Lists:**
   - Use `-` for unordered lists
   - Use `1.` for ordered lists
   - Indent nested lists with 2 spaces

5. **Links:**
   - Format: [Link Text](URL)
   - Always include descriptive text

Now, generate the onboarding guide following these instructions exactly.
"""
    
    def _detect_file_language(self, filename: str) -> str:
        """Detect programming language from filename"""
        ext_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.jsx': 'jsx',
            '.ts': 'typescript',
            '.tsx': 'tsx',
            '.json': 'json',
            '.md': 'markdown',
            '.yml': 'yaml',
            '.yaml': 'yaml',
            '.toml': 'toml',
            '.sh': 'bash',
            '.bash': 'bash',
            '.dockerfile': 'dockerfile',
            'Dockerfile': 'dockerfile',
            '.env': 'bash',
            '.gitignore': 'text',
        }
        
        for ext, lang in ext_map.items():
            if filename.endswith(ext) or filename == ext.lstrip('.'):
                return lang
        
        return 'text'

# Made with Bob