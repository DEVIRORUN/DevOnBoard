# Frontend Code - Complete Implementation

This document contains all frontend code files for the AI-powered developer onboarding platform.

## Directory Structure
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── OnboardingPage.jsx
│   ├── components/
│   │   ├── RepositoryForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── OnboardingGuide.jsx
│   │   ├── MarkdownRenderer.jsx
│   │   └── TechStackBadges.jsx
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   └── useRepository.js
│   └── styles/
│       └── index.css
└── public/
    └── favicon.ico
```

## Configuration Files

### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevOnboard - AI-Powered Developer Onboarding</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
```

### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Core Application Files

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `src/App.jsx`
```jsx
import React, { useState } from 'react'
import HomePage from './pages/HomePage'
import OnboardingPage from './pages/OnboardingPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [onboardingData, setOnboardingData] = useState(null)

  const handleAnalysisComplete = (data) => {
    setOnboardingData(data)
    setCurrentPage('onboarding')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setOnboardingData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentPage === 'home' ? (
        <HomePage onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <OnboardingPage data={onboardingData} onBack={handleBackToHome} />
      )}
    </div>
  )
}

export default App
```

### `src/styles/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all;
  }
}
```

## Pages

### `src/pages/HomePage.jsx`
```jsx
import React, { useState } from 'react'
import RepositoryForm from '../components/RepositoryForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { analyzeRepository } from '../services/api'

function HomePage({ onAnalysisComplete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (repositoryUrl) => {
    setLoading(true)
    setError(null)

    try {
      const response = await analyzeRepository(repositoryUrl)
      
      if (response.success) {
        onAnalysisComplete(response.data)
      } else {
        setError(response.error.message)
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze repository')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            DevOnboard
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Developer Onboarding for GitHub Repositories
          </p>
          <p className="text-gray-500 mt-2">
            Paste a GitHub repository URL and get instant onboarding documentation
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading ? (
            <LoadingSpinner message="Analyzing repository..." />
          ) : (
            <>
              <RepositoryForm onSubmit={handleSubmit} />
              {error && <ErrorMessage message={error} />}
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2">Fast Analysis</h3>
            <p className="text-gray-600 text-sm">
              Get comprehensive onboarding docs in under 2 minutes
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">
              Leverages Claude AI for intelligent code analysis
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-lg mb-2">Complete Guide</h3>
            <p className="text-gray-600 text-sm">
              Setup, architecture, and contribution workflows included
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
```

### `src/pages/OnboardingPage.jsx`
```jsx
import React from 'react'
import OnboardingGuide from '../components/OnboardingGuide'

function OnboardingPage({ data, onBack }) {
  if (!data) {
    return null
  }

  const { repository, onboarding } = data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center"
          >
            ← Back to Home
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {repository.name}
            </h1>
            <p className="text-gray-600 mb-3">{repository.description}</p>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* Onboarding Guide */}
        <OnboardingGuide onboarding={onboarding} />
      </div>
    </div>
  )
}

export default OnboardingPage
```

## Components

### `src/components/RepositoryForm.jsx`
```jsx
import React, { useState } from 'react'

function RepositoryForm({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)

  const validateUrl = (value) => {
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
    return githubUrlPattern.test(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setIsValid(false)
      return
    }

    if (!validateUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    onSubmit(url)
  }

  const handleChange = (e) => {
    setUrl(e.target.value)
    setIsValid(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
          GitHub Repository URL
        </label>
        <input
          id="repo-url"
          type="text"
          value={url}
          onChange={handleChange}
          placeholder="https://github.com/username/repository"
          className={`input-field ${!isValid ? 'border-red-500' : ''}`}
        />
        {!isValid && (
          <p className="mt-2 text-sm text-red-600">
            Please enter a valid GitHub repository URL
          </p>
        )}
      </div>
      
      <button type="submit" className="btn-primary w-full">
        Analyze Repository
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Example: https://github.com/facebook/react
      </p>
    </form>
  )
}

export default RepositoryForm
```

### `src/components/LoadingSpinner.jsx`
```jsx
import React from 'react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="mt-2 text-sm text-gray-500">This may take 1-2 minutes</p>
    </div>
  )
}

export default LoadingSpinner
```

### `src/components/ErrorMessage.jsx`
```jsx
import React from 'react'

function ErrorMessage({ message }) {
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
```

### `src/components/OnboardingGuide.jsx`
```jsx
import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import TechStackBadges from './TechStackBadges'

function OnboardingGuide({ onboarding }) {
  const sections = [
    { key: 'overview', title: 'Project Overview', icon: '📋' },
    { key: 'tech_stack', title: 'Tech Stack', icon: '🛠️' },
    { key: 'folder_structure', title: 'Folder Structure', icon: '📁' },
    { key: 'setup_instructions', title: 'Setup Instructions', icon: '⚙️' },
    { key: 'entry_points', title: 'Entry Points', icon: '🚪' },
    { key: 'contribution_guide', title: 'Contribution Guide', icon: '🤝' },
    { key: 'learning_path', title: 'Learning Path', icon: '📚' },
  ]

  return (
    <div className="space-y-6">
      {/* Tech Stack Badges */}
      {onboarding.tech_stack && onboarding.tech_stack.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <TechStackBadges technologies={onboarding.tech_stack} />
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <MarkdownRenderer content={onboarding.overview} />
      </div>

      {/* Additional Sections */}
      {sections.slice(1).map((section) => {
        const content = onboarding[section.key]
        if (!content || (Array.isArray(content) && content.length === 0)) {
          return null
        }

        return (
          <div key={section.key} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </h2>
            {Array.isArray(content) ? (
              <ul className="list-disc list-inside space-y-2">
                {content.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            ) : (
              <MarkdownRenderer content={content} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default OnboardingGuide
```

### `src/components/MarkdownRenderer.jsx`
```jsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-blue max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="text-gray-700" {...props} />,
          code: ({ node, inline, ...props }) => 
            inline ? (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props} />
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
            ),
          pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
```

### `src/components/TechStackBadges.jsx`
```jsx
import React from 'react'

function TechStackBadges({ technologies }) {
  const techColors = {
    'Python': 'bg-blue-100 text-blue-800',
    'JavaScript': 'bg-yellow-100 text-yellow-800',
    'TypeScript': 'bg-blue-100 text-blue-800',
    'React': 'bg-cyan-100 text-cyan-800',
    'Vue': 'bg-green-100 text-green-800',
    'Node.js': 'bg-green-100 text-green-800',
    'Flask': 'bg-gray-100 text-gray-800',
    'Django': 'bg-green-100 text-green-800',
    'Docker': 'bg-blue-100 text-blue-800',
    'default': 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologies Used</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              techColors[tech] || techColors.default
            }`}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TechStackBadges
```

## Services

### `src/services/api.js`
```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes
})

export const analyzeRepository = async (repositoryUrl) => {
  try {
    const response = await apiClient.post('/api/analyze', {
      repository_url: repositoryUrl,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error?.message || 'Server error')
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.')
    } else {
      throw new Error('Failed to send request')
    }
  }
}

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health')
    return response.data
  } catch (error) {
    throw new Error('Health check failed')
  }
}

export default apiClient
```

## Hooks

### `src/hooks/useRepository.js`
```javascript
import { useState } from 'react'
import { analyzeRepository } from '../services/api'

export const useRepository = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const analyze = async (repositoryUrl) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await analyzeRepository(repositoryUrl)
      
      if (response.success) {
        setData(response.data)
        return response.data
      } else {
        const errorMessage = response.error?.message || 'Analysis failed'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to analyze repository'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setLoading(false)
    setError(null)
    setData(null)
  }

  return {
    loading,
    error,
    data,
    analyze,
    reset,
  }
}
```

## Build Configuration

### `.gitignore`
```
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```

## Deployment

### Vercel Configuration (`vercel.json`)
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

### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Testing

### Manual Testing Checklist
- [ ] Form validation works correctly
- [ ] Loading spinner displays during analysis
- [ ] Error messages display properly
- [ ] Markdown renders correctly
- [ ] Tech stack badges display
- [ ] Navigation between pages works
- [ ] Responsive design on mobile
- [ ] Links open in new tabs
- [ ] Back button returns to home

### Sample Test URLs
```
https://github.com/facebook/react
https://github.com/pallets/flask
https://github.com/vercel/next.js
https://github.com/vuejs/vue
```

## Performance Optimization

### Code Splitting (Optional Enhancement)
```javascript
// In App.jsx
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <HomePage />
</Suspense>
```

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Add loading="lazy" to images

### Bundle Size Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer