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
    'Express': 'bg-gray-100 text-gray-800',
    'Next.js': 'bg-black text-white',
    'Angular': 'bg-red-100 text-red-800',
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

// Made with Bob
