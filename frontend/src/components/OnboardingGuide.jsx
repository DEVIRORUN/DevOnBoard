import React from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import TechStackBadges from './TechStackBadges'

function OnboardingGuide({ onboarding }) {
  const sections = [
    { key: 'overview', title: 'Project Overview', icon: '📋', color: 'blue' },
    { key: 'tech_stack', title: 'Tech Stack', icon: '🛠️', color: 'purple' },
    { key: 'folder_structure', title: 'Folder Structure', icon: '📁', color: 'green' },
    { key: 'setup_instructions', title: 'Setup Instructions', icon: '⚙️', color: 'orange' },
    { key: 'entry_points', title: 'Entry Points', icon: '🚪', color: 'red' },
    { key: 'contribution_guide', title: 'Contribution Guide', icon: '🤝', color: 'indigo' },
    { key: 'learning_path', title: 'Learning Path', icon: '📚', color: 'pink' },
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
      purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20',
      green: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
      orange: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
      red: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
      indigo: 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
      pink: 'border-l-pink-500 bg-pink-50 dark:bg-pink-900/20',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* Tech Stack Badges */}
      {onboarding.tech_stack && onboarding.tech_stack.length > 0 && (
        <div className="card border-l-4 border-l-purple-500 animate-slideUp">
          <TechStackBadges technologies={onboarding.tech_stack} />
        </div>
      )}

      {/* Main Content */}
      <div className="card border-l-4 border-l-blue-500 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <MarkdownRenderer content={onboarding.overview} />
      </div>

      {/* Additional Sections */}
      {sections.slice(1).map((section, index) => {
        const content = onboarding[section.key]
        if (!content || (Array.isArray(content) && content.length === 0)) {
          return null
        }

        return (
          <div
            key={section.key}
            className={`card border-l-4 ${getColorClasses(section.color)} animate-slideUp transition-all duration-300 hover:shadow-2xl`}
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="mr-3 text-3xl">{section.icon}</span>
              <span className="gradient-text">{section.title}</span>
            </h2>
            {Array.isArray(content) ? (
              <ul className="list-disc list-inside space-y-2">
                {content.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </li>
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

// Made with Bob
