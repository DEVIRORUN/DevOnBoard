from flask import Blueprint, request, jsonify
import logging

from services.onboarding_service import OnboardingService
from utils.validators import validate_github_url

repository_bp = Blueprint('repository', __name__)
logger = logging.getLogger(__name__)

@repository_bp.route('/analyze', methods=['POST'])
def analyze_repository():
    """
    Analyze a GitHub repository and generate onboarding guide
    
    Request Body:
        {
            "repository_url": "https://github.com/username/repo"
        }
    
    Response:
        {
            "success": true,
            "data": {
                "repository": {...},
                "onboarding": {...}
            }
        }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'repository_url' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'repository_url is required',
                    'code': 'MISSING_URL'
                }
            }), 400
        
        repo_url = data['repository_url'].strip()
        
        # Validate URL
        is_valid, error_message = validate_github_url(repo_url)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': {
                    'message': error_message,
                    'code': 'INVALID_URL'
                }
            }), 400
        
        logger.info(f"Analyzing repository: {repo_url}")
        
        # Analyze repository
        service = OnboardingService()
        result = service.generate_onboarding(repo_url)
        
        logger.info(f"Successfully analyzed repository: {repo_url}")
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Error analyzing repository: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': {
                'message': str(e),
                'code': 'ANALYSIS_ERROR'
            }
        }), 500

# Made with Bob
