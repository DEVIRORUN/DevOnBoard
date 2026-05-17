import React, { useState } from 'react'
import OnboardingGuide from '../components/OnboardingGuide'
import ProjectStructure from '../components/ProjectStructure'
import RepositoryAnalysisViz from '../components/RepositoryAnalysisViz'
import { LogoIcon } from '../components/Logo'
import { FiGithub } from 'react-icons/fi'

function OnboardingPage({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('guide')

  if (!data) {
    return null
  }

  const { repository, onboarding } = data

  // Mock data for Project Structure and Project of Thought
  // In production, this would come from the backend
  const mockStructure = {
    name: repository.name,
    type: 'directory',
    children: [
      {
        name: 'src',
        type: 'directory',
        children: [
          { name: 'index.js', type: 'file', size: 1024 },
          { name: 'App.jsx', type: 'file', size: 2048 },
        ]
      },
      { name: 'package.json', type: 'file', size: 512 },
      { name: 'README.md', type: 'file', size: 1536 },
    ]
  }

  const mockFiles = [
    { path: 'src/index.js', name: 'index.js', type: 'entry', functions: ['init', 'render'] },
    { path: 'src/App.jsx', name: 'App.jsx', type: 'component', functions: ['App', 'handleClick'] },
    { path: 'src/utils.js', name: 'utils.js', type: 'utility', functions: ['formatDate', 'parseData'] },
  ]

  const mockDependencies = [
    { source: 'src/index.js', target: 'src/App.jsx', sourceX: 100, sourceY: 100, targetX: 300, targetY: 100 },
    { source: 'src/App.jsx', target: 'src/utils.js', sourceX: 300, sourceY: 100, targetX: 500, targetY: 100 },
  ]

  const tabs = [
    { id: 'guide', label: 'Onboarding Guide', icon: '📚' },
    { id: 'structure', label: 'Project Structure', icon: '📁' },
    { id: 'analysis', label: 'AI Analysis', icon: '🔍' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={onBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-4 flex items-center transition-all hover:translate-x-[-4px]"
          >
            ← Back to Home
          </button>
          
          <div className="glass-effect rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <LogoIcon size="medium" animated={false} />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {repository.name}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{repository.description}</p>
                <div className="flex items-center space-x-4">
                  <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <FiGithub className="w-5 h-5" />
                    <span>View on GitHub</span>
                    <span className="text-xs">↗</span>
                  </a>
                  {repository.stars && (
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <span>⭐</span>
                      <span>{repository.stars}</span>
                    </span>
                  )}
                  {repository.language && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {repository.language}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slideIn">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'guide' && (
            <OnboardingGuide onboarding={onboarding} />
          )}
          
          {activeTab === 'structure' && (
            <ProjectStructure
              structure={mockStructure}
              onFileClick={(path, node) => console.log('File clicked:', path, node)}
            />
          )}
          
          {activeTab === 'analysis' && (
            <RepositoryAnalysisViz
              analysisData={onboarding}
              isAnalyzing={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage

// Made with Bob
