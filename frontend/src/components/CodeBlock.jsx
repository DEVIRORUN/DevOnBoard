import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FiCopy, FiCheck } from 'react-icons/fi'

function CodeBlock({ code, language = 'javascript', fileName = '', showLineNumbers = true, theme = 'dark' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      jsx: '⚛️',
      tsx: '⚛️',
      html: '🌐',
      css: '🎨',
      json: '📋',
      markdown: '📝',
      bash: '💻',
      shell: '💻',
    }
    return icons[lang.toLowerCase()] || '📄'
  }

  const selectedTheme = theme === 'dark' ? vscDarkPlus : vs

  return (
    <div className="my-4 rounded-lg overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl">
      {/* IDE-like Header */}
      <div className={`flex items-center justify-between px-4 py-2 ${
        theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-300'
      }`}>
        <div className="flex items-center space-x-2">
          {/* Window Controls */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* File Info */}
          {fileName && (
            <div className={`flex items-center space-x-2 ml-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span className="text-lg">{getLanguageIcon(language)}</span>
              <span className="text-sm font-mono font-semibold">{fileName}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                {language}
              </span>
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-4 h-4" />
              <span className="text-sm font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={selectedTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
          }}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: theme === 'dark' ? '#858585' : '#999',
            userSelect: 'none',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default CodeBlock

// Made with Bob