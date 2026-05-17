import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'

function MarkdownRenderer({ content }) {
  // Track theme changes reactively
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  useEffect(() => {
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  // Extract language from className (e.g., "language-javascript")
  const getLanguage = (className) => {
    if (!className) return 'text'
    const match = className.match(/language-(\w+)/)
    return match ? match[1] : 'text'
  }

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white animate-slideUp" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white animate-slideUp" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white animate-slideUp" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700 dark:text-gray-300" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const code = String(children).replace(/\n$/, '')
            
            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            
            const language = getLanguage(className)
            return (
              <CodeBlock
                code={code}
                language={language}
                theme={theme}
                showLineNumbers={true}
              />
            )
          },
          pre: ({ node, children, ...props }) => {
            // Let CodeBlock handle the pre tag styling
            return <>{children}</>
          },
          a: ({ node, href, children, ...props }) => {
            // Check if link is external
            const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'))
            
            return (
              <a
                href={href}
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
                {isExternal && (
                  <span className="inline-block ml-1 text-xs">↗</span>
                )}
              </a>
            )
          },
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-r"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer

// Made with Bob
