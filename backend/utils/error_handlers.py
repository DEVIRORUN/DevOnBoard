from flask import jsonify
import logging

logger = logging.getLogger(__name__)

class RepositoryError(Exception):
    """Custom exception for repository-related errors"""
    pass

class AIGenerationError(Exception):
    """Custom exception for AI generation errors"""
    pass

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass

def register_error_handlers(app):
    """Register error handlers with Flask app"""
    
    @app.errorhandler(RepositoryError)
    def handle_repository_error(error):
        logger.error(f"Repository error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {
                'message': str(error),
                'code': 'REPOSITORY_ERROR'
            }
        }), 400
    
    @app.errorhandler(AIGenerationError)
    def handle_ai_error(error):
        logger.error(f"AI generation error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {
                'message': 'Failed to generate onboarding guide',
                'code': 'AI_ERROR'
            }
        }), 500
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        logger.error(f"Validation error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {
                'message': str(error),
                'code': 'VALIDATION_ERROR'
            }
        }), 400
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            'success': False,
            'error': {
                'message': 'Endpoint not found',
                'code': 'NOT_FOUND'
            }
        }), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return jsonify({
            'success': False,
            'error': {
                'message': 'Internal server error',
                'code': 'INTERNAL_ERROR'
            }
        }), 500

# Made with Bob
