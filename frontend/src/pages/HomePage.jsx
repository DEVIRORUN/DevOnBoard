import React, { useState } from 'react'
import RepositoryForm from '../components/RepositoryForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Logo from '../components/Logo'
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
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <Logo size="xlarge" animated={true} />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-slideUp">
            AI-Powered Developer Onboarding for GitHub Repositories
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Paste a GitHub repository URL and get instant onboarding documentation
          </p>
        </div>

        {/* Main Content */}
        <div className="glass-effect rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 animate-slideUp" style={{ animationDelay: '0.2s' }}>
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
          <div className="card hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl mb-3 animate-bounce-slow">🚀</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Fast Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get comprehensive onboarding docs in under 2 minutes
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl mb-3 animate-pulse-slow">🤖</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">AI-Powered</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Leverages Claude AI for intelligent code analysis
            </p>
          </div>
          <div className="card hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <div className="text-3xl mb-3 animate-float">📚</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Complete Guide</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Setup, architecture, and contribution workflows included
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

// Made with Bob
