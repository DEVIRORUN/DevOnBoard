import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage analysis state and parse backend logs
 * Tracks the real-time progress of repository analysis
 */
export function useAnalysisState() {
  const [analysisState, setAnalysisState] = useState({
    phase: 'idle', // idle, fetching, analyzing, generating, complete, error
    progress: 0,
    logs: [],
    activeSystem: null,
    systemStates: {
      repositoryFetch: { status: 'idle', progress: 0 },
      structureAnalysis: { status: 'idle', progress: 0 },
      stackDetection: { status: 'idle', progress: 0 },
      entryPointIntelligence: { status: 'idle', progress: 0 },
      aiReasoning: { status: 'idle', progress: 0 },
      promptEngineering: { status: 'idle', progress: 0 },
      multiAgent: { status: 'idle', progress: 0 },
      knowledgeGraph: { status: 'idle', progress: 0 },
      onboardingSynthesis: { status: 'idle', progress: 0 },
    },
    metadata: {
      totalFiles: 0,
      startTime: null,
      elapsedTime: 0,
    },
  });

  // Parse backend log message and update state
  const parseLogMessage = useCallback((message, timestamp) => {
    const log = {
      timestamp: timestamp || new Date().toLocaleTimeString(),
      message,
      type: 'info',
      level: 'INFO',
      source: 'backend',
    };

    // Detect phase from log message
    if (message.includes('Fetching repository data')) {
      log.type = 'processing';
      log.source = 'github.github_client';
      setAnalysisState(prev => ({
        ...prev,
        phase: 'fetching',
        activeSystem: 'repositoryFetch',
        systemStates: {
          ...prev.systemStates,
          repositoryFetch: { status: 'processing', progress: 10 },
        },
      }));
    } else if (message.includes('Successfully fetched repository data')) {
      log.type = 'success';
      log.source = 'github.github_client';
      
      // Extract file count
      const match = message.match(/\((\d+) files\)/);
      const fileCount = match ? parseInt(match[1]) : 0;
      log.details = `Repository contains ${fileCount.toLocaleString()} files`;
      
      setAnalysisState(prev => ({
        ...prev,
        progress: 25,
        systemStates: {
          ...prev.systemStates,
          repositoryFetch: { status: 'complete', progress: 100 },
        },
        metadata: {
          ...prev.metadata,
          totalFiles: fileCount,
        },
      }));
    } else if (message.includes('Analyzing files')) {
      log.type = 'processing';
      log.source = 'services.onboarding_service';
      setAnalysisState(prev => ({
        ...prev,
        phase: 'analyzing',
        progress: 30,
        activeSystem: 'structureAnalysis',
        systemStates: {
          ...prev.systemStates,
          structureAnalysis: { status: 'processing', progress: 20 },
          stackDetection: { status: 'processing', progress: 10 },
          entryPointIntelligence: { status: 'processing', progress: 5 },
        },
      }));
    } else if (message.includes('Generating onboarding content')) {
      log.type = 'processing';
      log.source = 'services.onboarding_service';
      setAnalysisState(prev => ({
        ...prev,
        phase: 'generating',
        progress: 60,
        activeSystem: 'promptEngineering',
        systemStates: {
          ...prev.systemStates,
          structureAnalysis: { status: 'complete', progress: 100 },
          stackDetection: { status: 'complete', progress: 100 },
          entryPointIntelligence: { status: 'complete', progress: 100 },
          aiReasoning: { status: 'processing', progress: 50 },
          promptEngineering: { status: 'processing', progress: 30 },
        },
      }));
    } else if (message.includes('Sending request to Gemini API') || message.includes('Sending request to Claude API')) {
      log.type = 'processing';
      log.source = message.includes('Gemini') ? 'ai.gemini_client' : 'ai.claude_client';
      setAnalysisState(prev => ({
        ...prev,
        progress: 70,
        activeSystem: 'multiAgent',
        systemStates: {
          ...prev.systemStates,
          promptEngineering: { status: 'complete', progress: 100 },
          multiAgent: { status: 'processing', progress: 40 },
        },
      }));
    } else if (message.includes('Network error') || message.includes('retrying')) {
      log.type = 'warning';
      log.level = 'WARNING';
      log.source = 'github.github_client';
    } else if (message.includes('error') || message.includes('Error')) {
      log.type = 'error';
      log.level = 'ERROR';
    }

    return log;
  }, []);

  // Add log entry
  const addLog = useCallback((message, timestamp) => {
    const log = parseLogMessage(message, timestamp);
    setAnalysisState(prev => ({
      ...prev,
      logs: [...prev.logs, log],
    }));
  }, [parseLogMessage]);

  // Mark analysis as complete
  const completeAnalysis = useCallback(() => {
    setAnalysisState(prev => ({
      ...prev,
      phase: 'complete',
      progress: 100,
      activeSystem: 'onboardingSynthesis',
      systemStates: {
        repositoryFetch: { status: 'complete', progress: 100 },
        structureAnalysis: { status: 'complete', progress: 100 },
        stackDetection: { status: 'complete', progress: 100 },
        entryPointIntelligence: { status: 'complete', progress: 100 },
        aiReasoning: { status: 'complete', progress: 100 },
        promptEngineering: { status: 'complete', progress: 100 },
        multiAgent: { status: 'complete', progress: 100 },
        knowledgeGraph: { status: 'complete', progress: 100 },
        onboardingSynthesis: { status: 'complete', progress: 100 },
      },
    }));
    
    addLog('✓ Analysis complete! Onboarding guide generated successfully.', new Date().toLocaleTimeString());
  }, [addLog]);

  // Mark analysis as error
  const errorAnalysis = useCallback((errorMessage) => {
    setAnalysisState(prev => ({
      ...prev,
      phase: 'error',
      activeSystem: null,
    }));
    
    addLog(`✗ Error: ${errorMessage}`, new Date().toLocaleTimeString());
  }, [addLog]);

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    setAnalysisState({
      phase: 'idle',
      progress: 0,
      logs: [],
      activeSystem: null,
      systemStates: {
        repositoryFetch: { status: 'idle', progress: 0 },
        structureAnalysis: { status: 'idle', progress: 0 },
        stackDetection: { status: 'idle', progress: 0 },
        entryPointIntelligence: { status: 'idle', progress: 0 },
        aiReasoning: { status: 'idle', progress: 0 },
        promptEngineering: { status: 'idle', progress: 0 },
        multiAgent: { status: 'idle', progress: 0 },
        knowledgeGraph: { status: 'idle', progress: 0 },
        onboardingSynthesis: { status: 'idle', progress: 0 },
      },
      metadata: {
        totalFiles: 0,
        startTime: null,
        elapsedTime: 0,
      },
    });
  }, []);

  // Start analysis
  const startAnalysis = useCallback(() => {
    resetAnalysis();
    setAnalysisState(prev => ({
      ...prev,
      phase: 'fetching',
      metadata: {
        ...prev.metadata,
        startTime: Date.now(),
      },
    }));
    addLog('Starting repository analysis...', new Date().toLocaleTimeString());
  }, [resetAnalysis, addLog]);

  // Update elapsed time
  useEffect(() => {
    if (analysisState.phase !== 'idle' && analysisState.phase !== 'complete' && analysisState.phase !== 'error') {
      const interval = setInterval(() => {
        setAnalysisState(prev => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            elapsedTime: prev.metadata.startTime ? Date.now() - prev.metadata.startTime : 0,
          },
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [analysisState.phase]);

  return {
    analysisState,
    addLog,
    startAnalysis,
    completeAnalysis,
    errorAnalysis,
    resetAnalysis,
  };
}

// Made with Bob