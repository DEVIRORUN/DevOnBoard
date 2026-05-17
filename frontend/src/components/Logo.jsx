import React from 'react'
import { FiCode, FiGitBranch, FiBook } from 'react-icons/fi'

function Logo({ size = 'medium', animated = true }) {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24',
  }

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12',
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`relative ${sizes[size]}`}>
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ${
            animated ? 'animate-spin-slow' : ''
          }`}
          style={{ animationDuration: '8s' }}
        ></div>

        {/* Middle Ring */}
        <div
          className={`absolute inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ${
            animated ? 'animate-spin-slow' : ''
          }`}
          style={{ animationDuration: '6s', animationDirection: 'reverse' }}
        ></div>

        {/* Inner Circle */}
        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
          <FiCode className={`${iconSizes[size]} text-blue-600 dark:text-blue-400`} />
        </div>

        {/* Orbiting Icons */}
        {animated && (
          <>
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit"
              style={{ animationDuration: '4s' }}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                <FiGitBranch className="w-2 h-2 text-white" />
              </div>
            </div>
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 animate-orbit"
              style={{ animationDuration: '4s', animationDelay: '2s' }}
            >
              <div className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center">
                <FiBook className="w-2 h-2 text-white" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          DevOnboard
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
          LEGACY CODE MADE EASY
        </span>
      </div>
    </div>
  )
}

export function LogoIcon({ size = 'medium', animated = true }) {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24',
  }

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12',
  }

  return (
    <div className={`relative ${sizes[size]}`}>
      {/* Outer Ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 ${
          animated ? 'animate-spin-slow' : ''
        }`}
        style={{ animationDuration: '8s' }}
      ></div>

      {/* Middle Ring */}
      <div
        className={`absolute inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ${
          animated ? 'animate-spin-slow' : ''
        }`}
        style={{ animationDuration: '6s', animationDirection: 'reverse' }}
      ></div>

      {/* Inner Circle */}
      <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
        <FiCode className={`${iconSizes[size]} text-blue-600 dark:text-blue-400`} />
      </div>

      {/* Orbiting Icons */}
      {animated && (
        <>
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit"
            style={{ animationDuration: '4s' }}
          >
            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <FiGitBranch className="w-2 h-2 text-white" />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 animate-orbit"
            style={{ animationDuration: '4s', animationDelay: '2s' }}
          >
            <div className="w-3 h-3 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
              <FiBook className="w-2 h-2 text-white" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Logo

// Made with Bob