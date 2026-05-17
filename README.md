# DevOnboard - AI-Powered Developer Onboarding Platform

An intelligent full-stack application that analyzes GitHub repositories and generates comprehensive onboarding guides for new developers using AI.

![DevOnboard](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.0-black)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

DevOnboard automatically analyzes any GitHub repository and generates:

- **Project Overview** - Clear description of the project's purpose
- **Tech Stack Detection** - Identifies all technologies and frameworks
- **Folder Structure Explanation** - Explains the codebase organization
- **Setup Instructions** - Step-by-step guide to run the project
- **Entry Points** - Identifies main files and their purposes
- **Contribution Workflow** - How to contribute to the project
- **Learning Path** - Suggested order to explore the codebase

## ✨ Features

- 🚀 **Fast Analysis** - Complete onboarding guide in under 2 minutes
- 🤖 **AI-Powered** - Uses Anthropic Claude for intelligent code analysis
- 📚 **Comprehensive** - Covers setup, architecture, and contribution workflows
- 🎨 **Beautiful UI** - Modern, responsive React interface
- 🔒 **Secure** - Input validation, rate limiting, and error handling
- 📱 **Responsive** - Works seamlessly on desktop and mobile

## 🏗️ Architecture

```
DevOnboard/
├── backend/          # Flask API server
│   ├── routes/       # API endpoints
│   ├── services/     # Business logic
│   ├── github/       # GitHub integration
│   ├── ai/           # Claude AI integration
│   └── utils/        # Utilities and validators
└── frontend/         # React application
    ├── pages/        # Page components
    ├── components/   # Reusable components
    ├── services/     # API client
    └── hooks/        # Custom React hooks
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Git**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your API keys
# Required: ANTHROPIC_API_KEY
# Optional: GITHUB_TOKEN (for higher rate limits)

# Run the server
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional
GITHUB_TOKEN=your_github_token_here
FLASK_ENV=development
FLASK_DEBUG=True
MAX_REPO_SIZE_MB=500
ANALYSIS_TIMEOUT_SECONDS=300
CORS_ORIGINS=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=DevOnboard
```

## 📖 Usage

1. **Start both backend and frontend servers** (see Quick Start above)
2. **Open your browser** to `http://localhost:5173`
3. **Enter a GitHub repository URL** (e.g., `https://github.com/facebook/react`)
4. **Click "Analyze Repository"**
5. **Wait 1-2 minutes** for the AI to analyze the codebase
6. **View your comprehensive onboarding guide!**

### Example Repositories to Try

- `https://github.com/facebook/react` - Large, well-documented React library
- `https://github.com/pallets/flask` - Medium-sized Python web framework
- `https://github.com/vercel/next.js` - Full-stack React framework
- `https://github.com/vuejs/vue` - Progressive JavaScript framework

## 🛠️ Technology Stack

### Backend

- **Flask** - Python web framework
- **Anthropic Claude** - AI for code analysis
- **GitPython** - Git repository operations
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Limiter** - Rate limiting

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture details
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Quick reference guide
- **[BACKEND_CODE.md](BACKEND_CODE.md)** - Complete backend implementation
- **[FRONTEND_CODE.md](FRONTEND_CODE.md)** - Complete frontend implementation

## 🧪 Testing

### Backend Testing

```bash
cd backend
python test_api.py
```

### Frontend Testing

```bash
cd frontend
npm run build  # Test production build
npm run preview  # Preview production build
```

### Manual Testing

1. Test with various repository sizes (small, medium, large)
2. Test error handling (invalid URLs, private repos, etc.)
3. Test on different browsers (Chrome, Firefox, Safari)
4. Test responsive design on mobile devices

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. **Create a `Procfile`** in the backend directory:

   ```
   web: gunicorn app:app
   ```

2. **Set environment variables** in your platform's dashboard

3. **Deploy**:
   ```bash
   git push railway main  # or heroku main
   ```

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository** to Vercel
2. **Set build command**: `npm run build`
3. **Set output directory**: `dist`
4. **Add environment variables**:
   - `VITE_API_BASE_URL` - Your backend URL
5. **Deploy**

### Alternative Deployment Options

- **Backend**: AWS EC2, Google Cloud Run, DigitalOcean
- **Frontend**: Netlify, AWS S3 + CloudFront, GitHub Pages

## 🔒 Security Features

- ✅ Input validation for GitHub URLs
- ✅ Rate limiting (10 requests/minute, 100/hour)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Temporary file cleanup
- ✅ Error handling and logging
- ✅ Request timeout protection

## 🎯 API Endpoints

### `POST /api/analyze`

Analyze a GitHub repository and generate onboarding guide.

**Request:**

```json
{
  "repository_url": "https://github.com/username/repo"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "repository": {
      "name": "repo-name",
      "owner": "username",
      "url": "https://github.com/username/repo"
    },
    "onboarding": {
      "overview": "...",
      "tech_stack": ["Python", "React"],
      "setup_instructions": "...",
      ...
    }
  }
}
```

### `GET /api/health`

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "service": "DevOnboard API"
}
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'flask'`

- **Solution**: Activate virtual environment and run `pip install -r requirements.txt`

**Problem**: `anthropic.APIError: Invalid API key`

- **Solution**: Check your `.env` file and ensure `ANTHROPIC_API_KEY` is set correctly

**Problem**: `git.GitCommandError: Failed to clone repository`

- **Solution**: Ensure the repository URL is correct and publicly accessible

### Frontend Issues

**Problem**: `Failed to fetch` or CORS errors

- **Solution**: Ensure backend is running and `VITE_API_BASE_URL` is correct

**Problem**: `npm ERR! code ENOENT`

- **Solution**: Run `npm install` to install dependencies

**Problem**: Blank page after build

- **Solution**: Check browser console for errors and verify API URL

## 📈 Performance Optimization

- **Caching**: Consider adding Redis for caching analysis results
- **Async Processing**: Use Celery for background job processing
- **CDN**: Use CloudFront or similar for frontend assets
- **Database**: Add PostgreSQL for persistent storage
- **Monitoring**: Implement logging and error tracking (Sentry)

## 🔮 Future Enhancements

### Phase 2

- [ ] User authentication and saved analyses
- [ ] Database integration for caching results
- [ ] Support for private repositories
- [ ] Multiple AI model options
- [ ] Export guides as PDF/Markdown

### Phase 3

- [ ] Interactive code walkthroughs
- [ ] Video tutorial generation
- [ ] Team collaboration features
- [ ] VS Code extension
- [ ] GitHub App integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Anthropic for Claude AI API, Changed to Gemini 2.5 Flash
- GitHub for repository hosting
- The open-source community

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Email: irorun757@gmail.com, excelgbadamosi@gmail.com
- Twitter: @IROR_111, @excelopemipo22

## 🎉 Hackathon Ready

This project is designed for rapid hackathon development while maintaining production-ready architecture:

- ✅ **Fast Setup** - Get running in under 10 minutes
- ✅ **Clean Code** - Modular, well-documented structure
- ✅ **Scalable** - Easy to add features and improvements
- ✅ **Demo Ready** - Beautiful UI and smooth user experience
- ✅ **Production Path** - Clear deployment and scaling strategy

---

**Built with ❤️ for developers, by developers**

⭐ Star this repo if you find it helpful!
