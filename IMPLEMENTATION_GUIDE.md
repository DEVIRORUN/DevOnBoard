# Implementation Guide - AI-Powered Developer Onboarding Platform

This guide contains all the code templates, configurations, and step-by-step instructions to build the platform.

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Table of Contents
1. [Backend Implementation](#backend-implementation)
2. [Frontend Implementation](#frontend-implementation)
3. [Deployment Guide](#deployment-guide)

---

## Backend Implementation

### File: `backend/requirements.txt`
```txt
Flask==3.0.0
flask-cors==4.0.0
GitPython==3.1.40
PyGithub==2.1.1
anthropic==0.7.0
python-dotenv==1.0.0
requests==2.31.0
Flask-Limiter==3.5.0
gunicorn==21.2.0
```

### File: `backend/.env.example`
```env
FLASK_ENV=development
FLASK_DEBUG=True
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GITHUB_TOKEN=your_github_token_here
MAX_REPO_SIZE_MB=500
ANALYSIS_TIMEOUT_SECONDS=300
CORS_ORIGINS=http://localhost:5173
```

### File: `backend/app.py`
```python
from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os
import logging

from routes.repository_routes import repository_bp
from utils.error_handlers import register_error_handlers

load_dotenv()

app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["10 per minute", "100 per hour"],
    storage_uri="memory://"
)

app.register_blueprint(repository_bp, url_prefix='/api')
register_error_handlers(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'DevOnboard API'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
```

### File: `backend/config.py`
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
    MAX_REPO_SIZE_MB = int(os.getenv('MAX_REPO_SIZE_MB', 500))
    ANALYSIS_TIMEOUT_SECONDS = int(os.getenv('ANALYSIS_TIMEOUT_SECONDS', 300))
    
    IGNORED_PATTERNS = [
        'node_modules/', 'venv/', '.git/', 'dist/', 'build/',
        '*.log', '*.pyc', '*.min.js', '*.map'
    ]
    
    PRIORITY_FILES = [
        'README.md', 'package.json', 'requirements.txt',
        'Dockerfile', 'docker-compose.yml'
    ]
```

See BACKEND_CODE.md for complete backend implementation details.

---

## Frontend Implementation

### File: `frontend/package.json`
```json
{
  "name": "devonboard-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

### File: `frontend/.env.example`
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=DevOnboard
```

### File: `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

See FRONTEND_CODE.md for complete frontend implementation details.

---

## Deployment Guide

### Backend Deployment (Railway/Heroku)

1. **Create Procfile**:
```
web: gunicorn app:app
```

2. **Set environment variables** in platform dashboard

3. **Deploy**:
```bash
git push railway main  # or heroku main
```

### Frontend Deployment (Vercel)

1. **Connect GitHub repository**
2. **Set build command**: `npm run build`
3. **Set output directory**: `dist`
4. **Add environment variables**
5. **Deploy**

---

## Testing

### Test with Sample Repository
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repository_url": "https://github.com/facebook/react"}'
```

### Recommended Test Repositories
- https://github.com/facebook/react (Large, well-documented)
- https://github.com/pallets/flask (Medium, Python)
- https://github.com/vercel/next.js (Large, JavaScript)

---

## Next Steps

1. Review ARCHITECTURE.md for system design
2. Review BACKEND_CODE.md for complete backend code
3. Review FRONTEND_CODE.md for complete frontend code
4. Follow setup instructions above
5. Test with sample repositories
6. Deploy to production

## Support

For issues or questions, refer to:
- ARCHITECTURE.md - System design and architecture
- BACKEND_CODE.md - Backend implementation
- FRONTEND_CODE.md - Frontend implementation
- README.md - Project overview and setup