import React, { useEffect, useRef } from 'react';
import { FiTerminal, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

/**
 * Real-time Analysis Console
 * Shows backend processing logs like a terminal
 */
function AnalysisConsole({ logs, isActive }) {
  const consoleRef = useRef(null);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);
  
  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-4 h-4 text-green-400" />;
      case 'error':
        return <FiAlertCircle className="w-4 h-4 text-red-400" />;
      case 'processing':
        return <FiLoader className="w-4 h-4 text-cyan-400 animate-spin" />;
      default:
        return <FiTerminal className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'processing':
        return 'text-cyan-400';
      default:
        return 'text-gray-300';
    }
  };
  
  return (
    <div className="glass rounded-lg overflow-hidden border border-gray-700">
      {/* Console Header */}
      <div className="bg-gray-900 bg-opacity-80 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiTerminal className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-semibold">Analysis Console</span>
          {isActive && (
            <span className="flex items-center space-x-1 text-xs text-cyan-400">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span>Live</span>
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>
      
      {/* Console Body */}
      <div
        ref={consoleRef}
        className="bg-gray-950 p-4 font-mono text-sm overflow-y-auto"
        style={{ height: '300px' }}
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Waiting for analysis to start...
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span>{log.source}</span>
                    <span>•</span>
                    <span className="uppercase">{log.level}</span>
                  </div>
                  <div className={`${getLogColor(log.type)} leading-relaxed`}>
                    {log.message}
                  </div>
                  {log.details && (
                    <div className="text-gray-400 text-xs mt-1 pl-4 border-l-2 border-gray-700">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Console Footer */}
      {isActive && (
        <div className="bg-gray-900 bg-opacity-80 px-4 py-2 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Processing repository analysis...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisConsole;

// Made with Bob