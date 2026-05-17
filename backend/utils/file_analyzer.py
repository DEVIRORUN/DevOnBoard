import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class FileAnalyzer:
    """Analyzes repository files to extract insights"""
    
    def analyze_repository(self, repo_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze repository to extract tech stack and patterns
        
        Args:
            repo_data: Repository metadata
            
        Returns:
            Analysis results
        """
        try:
            analysis = {
                'tech_stack': self._detect_tech_stack(repo_data),
                'frameworks': self._detect_frameworks(repo_data),
                'entry_points': self._find_entry_points(repo_data),
                'has_tests': self._has_tests(repo_data),
                'has_ci': self._has_ci(repo_data)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing repository: {str(e)}")
            return {}
    
    def _detect_tech_stack(self, repo_data: Dict) -> List[str]:
        """Detect technologies used"""
        tech_stack = []
        priority_files = repo_data.get('priority_files', {})
        
        # Check for specific files
        if 'package.json' in priority_files:
            tech_stack.append('Node.js')
        if 'requirements.txt' in priority_files or 'Pipfile' in priority_files:
            tech_stack.append('Python')
        if 'Cargo.toml' in priority_files:
            tech_stack.append('Rust')
        if 'go.mod' in priority_files:
            tech_stack.append('Go')
        if 'pom.xml' in priority_files or 'build.gradle' in priority_files:
            tech_stack.append('Java')
        if 'Dockerfile' in priority_files:
            tech_stack.append('Docker')
        
        return tech_stack
    
    def _detect_frameworks(self, repo_data: Dict) -> List[str]:
        """Detect frameworks used"""
        frameworks = []
        priority_files = repo_data.get('priority_files', {})
        
        # Check package.json for frameworks
        if 'package.json' in priority_files:
            content = priority_files['package.json'].lower()
            if 'react' in content:
                frameworks.append('React')
            if 'vue' in content:
                frameworks.append('Vue')
            if 'angular' in content:
                frameworks.append('Angular')
            if 'express' in content:
                frameworks.append('Express')
            if 'next' in content:
                frameworks.append('Next.js')
        
        # Check requirements.txt for frameworks
        if 'requirements.txt' in priority_files:
            content = priority_files['requirements.txt'].lower()
            if 'flask' in content:
                frameworks.append('Flask')
            if 'django' in content:
                frameworks.append('Django')
            if 'fastapi' in content:
                frameworks.append('FastAPI')
        
        return frameworks
    
    def _find_entry_points(self, repo_data: Dict) -> List[str]:
        """Find main entry points"""
        entry_points = []
        files = repo_data.get('files', [])
        
        common_entry_points = [
            'main.py', 'app.py', '__main__.py',
            'index.js', 'main.js', 'app.js', 'server.js',
            'index.ts', 'main.ts', 'app.ts',
            'Main.java', 'Application.java',
            'main.go'
        ]
        
        for file in files:
            if file['name'] in common_entry_points:
                entry_points.append(file['path'])
        
        return entry_points
    
    def _has_tests(self, repo_data: Dict) -> bool:
        """Check if repository has tests"""
        structure = repo_data.get('structure', {})
        
        test_indicators = ['test', 'tests', '__tests__', 'spec']
        
        for path in structure.keys():
            if any(indicator in path.lower() for indicator in test_indicators):
                return True
        
        return False
    
    def _has_ci(self, repo_data: Dict) -> bool:
        """Check if repository has CI/CD"""
        structure = repo_data.get('structure', {})
        
        ci_indicators = ['.github/workflows', '.gitlab-ci', '.circleci', 'jenkins']
        
        for path in structure.keys():
            if any(indicator in path.lower() for indicator in ci_indicators):
                return True
        
        return False

# Made with Bob
