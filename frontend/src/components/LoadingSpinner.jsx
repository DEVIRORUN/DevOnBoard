import React from 'react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="mt-2 text-sm text-gray-500">This may take 1-2 minutes</p>
    </div>
  )
}

export default LoadingSpinner

// Made with Bob
