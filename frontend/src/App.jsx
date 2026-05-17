import React, { useState } from 'react'
import HomePage from './pages/HomePage'
import OnboardingPage from './pages/OnboardingPage'
import { ThemeProvider, ThemeToggle } from './components/ThemeProvider'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [onboardingData, setOnboardingData] = useState(null)

  const handleAnalysisComplete = (data) => {
    setOnboardingData(data)
    setCurrentPage('onboarding')
  }

  const handleBackToHome = () => {
    setCurrentPage('home')
    setOnboardingData(null)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
        <ThemeToggle />
        
        <div className="page-transition-enter-active">
          {currentPage === 'home' ? (
            <HomePage onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <OnboardingPage
              data={onboardingData}
              onBack={handleBackToHome}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App

// Made with Bob
