# Quick Start Guide - DevOnboard

Get DevOnboard running in **under 10 minutes**!

## 🎯 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Python 3.9 or higher installed
- [ ] Node.js 18 or higher installed
- [ ] Git installed
- [ ] Anthropic API key ([Sign up here](https://console.anthropic.com/))
- [ ] A code editor (VS Code recommended)

## ⚡ 5-Minute Setup

### Step 1: Clone or Create Project Structure (1 min)

```bash
# Create project directory
mkdir devonboard
cd devonboard

# Create backend and frontend directories
mkdir backend frontend
```

### Step 2: Backend Setup (2 min)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Create requirements.txt
cat > requirements.txt << EOF
Flask==3.0.0
flask-cors==4.0.0
GitPython==3.1.40
PyGithub==2.1.1
anthropic==0.7.0
python-dotenv==1.0.0
requests==2.31.0
Flask-Limiter==3.5.0
gunicorn==21.2.0
EOF

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
FLASK_ENV=development
FLASK_DEBUG=True
ANTHROPIC_API_KEY=your_api_key_here
CORS_ORIGINS=http://localhost:5173
EOF

# IMPORTANT: Edit .env and add your actual Anthropic API key!
```

### Step 3: Copy Backend Code (1 min)

Copy all Python files from `BACKEND_CODE.md` into the appropriate directories:

```
backend/
├── app.py
├── config.py
├── routes/
│   ├── __init__.py
│   └── repository_routes.py
├── services/
│   ├── __init__.py
│   └── onboarding_service.py
├── github/
│   ├── __init__.py
│   ├── github_client.py
│   └── repository_parser.py
├── ai/
│   ├── __init__.py
│   ├── claude_client.py
│   └── prompt_templates.py
└── utils/
    ├── __init__.py
    ├── validators.py
    ├── file_analyzer.py
    └── error_handlers.py
```

**Quick tip**: Create empty `__init__.py` files first:
```bash
touch routes/__init__.py services/__init__.py github/__init__.py ai/__init__.py utils/__init__.py
```

### Step 4: Frontend Setup (1 min)

```bash
cd ../frontend

# Initialize with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install additional packages
npm install axios react-markdown remark-gfm

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=DevOnboard
EOF
```

### Step 5: Copy Frontend Code (1 min)

Copy all JavaScript/JSX files from `FRONTEND_CODE.md` into the appropriate directories:

```
frontend/src/
├── main.jsx
├── App.jsx
├── pages/
│   ├── HomePage.jsx
│   └── OnboardingPage.jsx
├── components/
│   ├── RepositoryForm.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorMessage.jsx
│   ├── OnboardingGuide.jsx
│   ├── MarkdownRenderer.jsx
│   └── TechStackBadges.jsx
├── services/
│   └── api.js
├── hooks/
│   └── useRepository.js
└── styles/
    └── index.css
```

Also update:
- `tailwind.config.js`
- `index.html`

## 🚀 Launch

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

## ✅ Verify Installation

1. **Open browser** to `http://localhost:5173`
2. **You should see** the DevOnboard landing page
3. **Test with a repository**: `https://github.com/pallets/flask`
4. **Wait 1-2 minutes** for analysis
5. **View the onboarding guide!**

## 🐛 Common Issues

### Issue: "ModuleNotFoundError"
**Solution**: Make sure virtual environment is activated and dependencies are installed
```bash
pip install -r requirements.txt
```

### Issue: "Invalid API key"
**Solution**: Check your `.env` file in the backend directory
```bash
# Make sure it contains:
ANTHROPIC_API_KEY=sk-ant-...your-actual-key...
```

### Issue: "CORS error" in browser
**Solution**: Ensure backend is running on port 5000
```bash
# Check if backend is running:
curl http://localhost:5000/api/health
```

### Issue: Frontend shows blank page
**Solution**: Check browser console for errors
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Ensure all components are properly imported

## 📝 Next Steps

1. ✅ **Test with different repositories**
   - Small: `https://github.com/pallets/flask`
   - Medium: `https://github.com/facebook/react`
   - Large: `https://github.com/vercel/next.js`

2. ✅ **Customize the UI**
   - Edit colors in `tailwind.config.js`
   - Modify components in `frontend/src/components/`

3. ✅ **Enhance AI prompts**
   - Edit `backend/ai/prompt_templates.py`
   - Adjust temperature and max_tokens in `claude_client.py`

4. ✅ **Add features**
   - Export to PDF
   - Save analysis history
   - Support for private repos

## 🎉 You're Ready!

Your DevOnboard platform is now running! Start analyzing repositories and generating onboarding guides.

## 📚 Additional Resources

- **Full Documentation**: See `README.md`
- **Architecture Details**: See `ARCHITECTURE.md`
- **Complete Code**: See `BACKEND_CODE.md` and `FRONTEND_CODE.md`

## 💡 Pro Tips

1. **Use GitHub Token**: Add `GITHUB_TOKEN` to `.env` for higher rate limits
2. **Test Locally First**: Always test with small repos before large ones
3. **Monitor Logs**: Watch terminal output for debugging
4. **Cache Results**: Consider adding Redis for production
5. **Rate Limiting**: Be mindful of API costs during testing

---

**Need help?** Check the troubleshooting section in `README.md` or open an issue!

Happy coding! 🚀