# Deployment Guide - DevOnboard

Complete guide for deploying DevOnboard to production.

## 🎯 Deployment Overview

This guide covers deploying:
- **Backend**: Flask API to Railway/Heroku
- **Frontend**: React app to Vercel/Netlify
- **Alternative**: Full-stack deployment options

## 🚀 Backend Deployment

### Option 1: Railway (Recommended)

Railway offers free tier and automatic deployments from Git.

#### Step 1: Prepare Backend

Create `Procfile` in backend directory:
```
web: gunicorn app:app
```

Create `runtime.txt` (optional):
```
python-3.9.18
```

Update `requirements.txt` to include gunicorn:
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

#### Step 2: Deploy to Railway

1. **Sign up** at [railway.app](https://railway.app)
2. **Create new project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure**:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app`

#### Step 3: Set Environment Variables

In Railway dashboard, add:
```
ANTHROPIC_API_KEY=your_api_key
GITHUB_TOKEN=your_github_token (optional)
FLASK_ENV=production
FLASK_DEBUG=False
MAX_REPO_SIZE_MB=500
ANALYSIS_TIMEOUT_SECONDS=300
CORS_ORIGINS=https://your-frontend-domain.vercel.app
PORT=5000
```

#### Step 4: Get Deployment URL

Railway will provide a URL like: `https://your-app.railway.app`

### Option 2: Heroku

#### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Deploy
```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set FLASK_ENV=production
heroku config:set CORS_ORIGINS=https://your-frontend.vercel.app

# Deploy
git push heroku main

# Open app
heroku open
```

### Option 3: AWS EC2 (Production)

#### Step 1: Launch EC2 Instance
- Ubuntu 22.04 LTS
- t2.micro (free tier) or larger
- Configure security group (ports 22, 80, 443)

#### Step 2: SSH and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx -y

# Clone repository
git clone https://github.com/yourusername/devonboard.git
cd devonboard/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
nano .env
# Add your environment variables
```

#### Step 3: Configure Gunicorn
```bash
# Create systemd service
sudo nano /etc/systemd/system/devonboard.service
```

Add:
```ini
[Unit]
Description=DevOnboard Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/devonboard/backend
Environment="PATH=/home/ubuntu/devonboard/backend/venv/bin"
ExecStart=/home/ubuntu/devonboard/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 app:app

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start devonboard
sudo systemctl enable devonboard
sudo systemctl status devonboard
```

#### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/devonboard
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/devonboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Frontend

Create `vercel.json` in frontend directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### Step 2: Deploy to Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import project** from GitHub
3. **Configure**:
   - Framework: Vite
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

#### Step 3: Set Environment Variables

In Vercel dashboard:
```
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_APP_NAME=DevOnboard
```

#### Step 4: Deploy

Vercel will automatically deploy on every push to main branch.

### Option 2: Netlify

#### Step 1: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy

1. **Sign up** at [netlify.com](https://netlify.com)
2. **New site from Git**
3. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Add environment variables**:
   - `VITE_API_BASE_URL`

### Option 3: AWS S3 + CloudFront

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html
```

#### Step 3: Upload Files
```bash
aws s3 sync dist/ s3://your-bucket-name --acl public-read
```

#### Step 4: Configure CloudFront
- Create CloudFront distribution
- Point to S3 bucket
- Configure custom domain (optional)

## 🔒 Production Security Checklist

### Backend Security

- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Use strong API keys
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Input validation on all endpoints
- [ ] Implement request timeouts
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains

### Frontend Security

- [ ] Use HTTPS only
- [ ] Sanitize user inputs
- [ ] Implement CSP headers
- [ ] Regular dependency updates
- [ ] Minimize bundle size
- [ ] Enable compression
- [ ] Use secure cookies (if applicable)

## 📊 Monitoring & Logging

### Backend Monitoring

#### Option 1: Sentry
```bash
pip install sentry-sdk[flask]
```

In `app.py`:
```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

#### Option 2: LogDNA/Datadog
- Sign up for service
- Install agent
- Configure log forwarding

### Frontend Monitoring

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

In `main.jsx`:
```javascript
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
  </>
)
```

## 🚀 Performance Optimization

### Backend Optimization

1. **Enable Caching**
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.cached(timeout=3600)
def expensive_operation():
    pass
```

2. **Use Redis for Session Storage**
```bash
pip install redis flask-session
```

3. **Implement CDN for Static Assets**

4. **Database Connection Pooling** (if using database)

### Frontend Optimization

1. **Code Splitting**
```javascript
const HomePage = lazy(() => import('./pages/HomePage'))
```

2. **Image Optimization**
- Use WebP format
- Implement lazy loading
- Compress images

3. **Bundle Analysis**
```bash
npm run build
npx vite-bundle-visualizer
```

4. **Enable Compression**
```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
}
```

## 💰 Cost Estimation

### Free Tier (MVP)
- **Railway**: Free tier (500 hours/month)
- **Vercel**: Free tier (100GB bandwidth)
- **Anthropic API**: Pay-per-use (~$0.10 per analysis)
- **Total**: ~$0-10/month for low traffic

### Production (1000 users/month)
- **Railway/Heroku**: $7-25/month
- **Vercel Pro**: $20/month
- **Anthropic API**: ~$100/month (1000 analyses)
- **Domain**: $12/year
- **Total**: ~$150/month

### Scale (10,000 users/month)
- **AWS EC2**: $50-100/month
- **CloudFront**: $50/month
- **Anthropic API**: ~$1000/month
- **Database**: $50/month
- **Total**: ~$1200/month

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          # Railway deployment commands
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 📈 Scaling Strategy

### Horizontal Scaling
- Use load balancer (AWS ELB, Nginx)
- Multiple backend instances
- Redis for shared session storage

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching layers

### Database Scaling
- Read replicas
- Connection pooling
- Query optimization

## 🐛 Troubleshooting Production Issues

### Common Issues

1. **502 Bad Gateway**
   - Check if backend is running
   - Verify port configuration
   - Check firewall rules

2. **CORS Errors**
   - Verify CORS_ORIGINS includes frontend domain
   - Check protocol (http vs https)

3. **Slow Response Times**
   - Enable caching
   - Optimize AI prompts
   - Use CDN for static assets

4. **High API Costs**
   - Implement result caching
   - Add rate limiting
   - Optimize prompt length

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Rate limiting configured
- [ ] Security headers configured
- [ ] Performance tested
- [ ] Load tested
- [ ] Documentation updated
- [ ] Domain configured
- [ ] SSL certificate installed

## 🎉 Post-Deployment

1. **Test all features** in production
2. **Monitor logs** for errors
3. **Check analytics** for usage patterns
4. **Gather user feedback**
5. **Plan iterations** based on data

---

**Congratulations!** Your DevOnboard platform is now live! 🚀