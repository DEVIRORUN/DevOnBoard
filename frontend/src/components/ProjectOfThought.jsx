import React, { useState, useEffect, useRef } from 'react'
import { FiZoomIn, FiZoomOut, FiMaximize2, FiCode } from 'react-icons/fi'

function ProjectOfThought({ files, dependencies, onFileClick }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [hoveredFile, setHoveredFile] = useState(null)
  const canvasRef = useRef(null)

  // Group files by directory
  const groupedFiles = groupFilesByDirectory(files || [])

  const handleFileClick = (file) => {
    setSelectedFile(file)
    if (onFileClick) {
      onFileClick(file)
    }
  }

  const getFileColor = (file, isExternal = false) => {
    if (isExternal) return '#f59e0b' // amber for external dependencies
    
    const ext = file.path?.split('.').pop()?.toLowerCase()
    const colors = {
      js: '#f7df1e',
      jsx: '#61dafb',
      ts: '#3178c6',
      tsx: '#3178c6',
      py: '#3776ab',
      java: '#007396',
      html: '#e34c26',
      css: '#264de4',
      json: '#292929',
      md: '#083fa1',
    }
    return colors[ext] || '#6b7280'
  }

  const getConnectionColor = (isExternal) => {
    return isExternal ? '#f59e0b' : '#3b82f6'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🧠</span>
          Project of Thought
        </h2>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400 min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Reset Zoom"
          >
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Internal File</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span className="text-gray-700 dark:text-gray-300">External Dependency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Internal Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-0.5 bg-amber-500"></div>
            <span className="text-gray-700 dark:text-gray-300">External Connection</span>
          </div>
        </div>
      </div>

      {/* Diagram Container */}
      <div className="relative overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 p-4" style={{ height: '600px' }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
          <svg ref={canvasRef} width="100%" height="100%" className="min-w-full min-h-full">
            {/* Draw connections first (so they appear behind nodes) */}
            {dependencies && dependencies.map((dep, idx) => {
              const isExternal = dep.isExternal || !files?.find(f => f.path === dep.target)
              return (
                <line
                  key={`dep-${idx}`}
                  x1={dep.sourceX || 0}
                  y1={dep.sourceY || 0}
                  x2={dep.targetX || 0}
                  y2={dep.targetY || 0}
                  stroke={getConnectionColor(isExternal)}
                  strokeWidth="2"
                  strokeDasharray={isExternal ? "5,5" : "0"}
                  opacity="0.6"
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>

          {/* File Nodes */}
          <div className="relative">
            {Object.entries(groupedFiles).map(([directory, dirFiles], dirIdx) => (
              <div key={directory} className="mb-8">
                {/* Directory Header */}
                <div className="mb-3 pb-2 border-b-2 border-gray-300 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    <FiCode className="mr-2" />
                    {directory || 'Root'}
                  </h3>
                </div>

                {/* Files in Directory */}
                <div className="flex flex-wrap gap-3">
                  {dirFiles.map((file, fileIdx) => {
                    const isExternal = file.isExternal
                    const isSelected = selectedFile?.path === file.path
                    const isHovered = hoveredFile?.path === file.path
                    const hasConnections = dependencies?.some(
                      d => d.source === file.path || d.target === file.path
                    )

                    return (
                      <div
                        key={`${file.path}-${fileIdx}`}
                        className={`relative group cursor-pointer transition-all duration-300 ${
                          isSelected ? 'scale-110 z-10' : 'hover:scale-105'
                        }`}
                        onClick={() => handleFileClick(file)}
                        onMouseEnter={() => setHoveredFile(file)}
                        onMouseLeave={() => setHoveredFile(null)}
                      >
                        {/* File Node */}
                        <div
                          className={`px-4 py-3 rounded-lg shadow-md transition-all duration-300 ${
                            isSelected
                              ? 'ring-4 ring-blue-500 ring-opacity-50'
                              : 'hover:shadow-lg'
                          }`}
                          style={{
                            backgroundColor: getFileColor(file, isExternal),
                            minWidth: '120px',
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            {/* Connection Indicator */}
                            {hasConnections && (
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                            )}
                            
                            {/* File Name */}
                            <span className="text-sm font-mono font-semibold text-white truncate">
                              {file.name || file.path?.split('/').pop()}
                            </span>
                          </div>

                          {/* File Type Badge */}
                          {file.type && (
                            <div className="mt-1">
                              <span className="text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded text-white">
                                {file.type}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Tooltip */}
                        {(isHovered || isSelected) && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-20 animate-fadeIn">
                            <div className="font-semibold">{file.path}</div>
                            {file.functions && file.functions.length > 0 && (
                              <div className="mt-1 text-gray-300">
                                Functions: {file.functions.join(', ')}
                              </div>
                            )}
                            {isExternal && (
                              <div className="mt-1 text-amber-400">External Dependency</div>
                            )}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 animate-slideIn">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Selected: {selectedFile.path}
          </h3>
          {selectedFile.functions && selectedFile.functions.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Functions:</strong> {selectedFile.functions.join(', ')}
            </div>
          )}
          {selectedFile.imports && selectedFile.imports.length > 0 && (
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              <strong>Imports:</strong> {selectedFile.imports.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function groupFilesByDirectory(files) {
  const grouped = {}
  
  files.forEach(file => {
    const path = file.path || ''
    const parts = path.split('/')
    const directory = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Root'
    
    if (!grouped[directory]) {
      grouped[directory] = []
    }
    grouped[directory].push(file)
  })
  
  return grouped
}

export default ProjectOfThought

// Made with Bob