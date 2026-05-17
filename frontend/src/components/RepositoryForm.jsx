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

// Made with Bob
