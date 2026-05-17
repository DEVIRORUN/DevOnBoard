import React, { useState } from 'react'
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi'

function ProjectStructure({ structure, onFileClick }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="mr-2">📁</span>
        Project Structure
      </h2>
      <div className="font-mono text-sm">
        {structure ? (
          <TreeNode node={structure} level={0} onFileClick={onFileClick} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No structure available</p>
        )}
      </div>
    </div>
  )
}

function TreeNode({ node, level, onFileClick, path = '' }) {
  const [isOpen, setIsOpen] = useState(level < 2) // Auto-expand first 2 levels

  if (!node) return null

  const isFolder = node.type === 'directory' || node.children
  const currentPath = path ? `${path}/${node.name}` : node.name
  const hasChildren = node.children && node.children.length > 0

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const icons = {
      js: '🟨',
      jsx: '⚛️',
      ts: '🔷',
      tsx: '⚛️',
      py: '🐍',
      java: '☕',
      html: '🌐',
      css: '🎨',
      json: '📋',
      md: '📝',
      txt: '📄',
      png: '🖼️',
      jpg: '🖼️',
      svg: '🎨',
      git: '🔧',
      env: '⚙️',
    }
    return icons[ext] || '📄'
  }

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen)
    } else if (onFileClick) {
      onFileClick(currentPath, node)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-all duration-200 ${
          isFolder
            ? 'hover:bg-blue-50 dark:hover:bg-gray-700'
            : 'hover:bg-green-50 dark:hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleClick}
      >
        {/* Expand/Collapse Icon */}
        {isFolder && hasChildren && (
          <span className="mr-1 text-gray-500 dark:text-gray-400">
            {isOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
          </span>
        )}
        {isFolder && !hasChildren && <span className="mr-1 w-4"></span>}

        {/* Folder/File Icon */}
        <span className="mr-2 text-lg">
          {isFolder ? (
            <FiFolder className={`w-4 h-4 text-blue-500 ${isOpen ? 'opacity-100' : 'opacity-70'}`} />
          ) : (
            <span>{getFileIcon(node.name)}</span>
          )}
        </span>

        {/* Name */}
        <span
          className={`${
            isFolder
              ? 'font-semibold text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {node.name}
        </span>

        {/* File Size/Count */}
        {node.size && (
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {formatSize(node.size)}
          </span>
        )}
        {isFolder && hasChildren && (
          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {node.children.length} items
          </span>
        )}
      </div>

      {/* Children */}
      {isFolder && isOpen && hasChildren && (
        <div className="transition-all duration-300">
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.name}-${index}`}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              path={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default ProjectStructure

// Made with Bob