import React, { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiCode, FiPackage, FiCpu, FiZap, FiCheckCircle } from 'react-icons/fi';

/**
 * Repository Analysis Visualization
 * Shows how the AI analyzes the repository being examined
 */
function RepositoryAnalysisViz({ analysisData, isAnalyzing }) {
  const [activePhase, setActivePhase] = useState('idle');
  const [discoveredItems, setDiscoveredItems] = useState({
    files: [],
    techStack: [],
    frameworks: [],
    entryPoints: [],
    languages: {},
  });

  // Simulate discovery animation as analysis progresses
  useEffect(() => {
    if (analysisData && isAnalyzing) {
      // Simulate progressive discovery
      const phases = ['fetching', 'structure', 'tech', 'entry', 'complete'];
      let currentPhaseIndex = 0;

      const interval = setInterval(() => {
        if (currentPhaseIndex < phases.length) {
          setActivePhase(phases[currentPhaseIndex]);
          currentPhaseIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [analysisData, isAnalyzing]);

  // Extract data from analysis
  useEffect(() => {
    if (analysisData) {
      setDiscoveredItems({
        files: analysisData.files || [],
        techStack: analysisData.tech_stack || [],
        frameworks: analysisData.frameworks || [],
        entryPoints: analysisData.entry_points || [],
        languages: analysisData.languages || {},
      });
    }
  }, [analysisData]);

  const phases = [
    {
      id: 'fetching',
      title: 'Fetching Repository',
      icon: FiFolder,
      color: 'cyan',
      description: 'Cloning repository and reading file structure',
      active: activePhase === 'fetching',
      complete: ['structure', 'tech', 'entry', 'complete'].includes(activePhase),
    },
    {
      id: 'structure',
      title: 'Analyzing Structure',
      icon: FiCode,
      color: 'blue',
      description: 'Mapping folder hierarchy and file relationships',
      active: activePhase === 'structure',
      complete: ['tech', 'entry', 'complete'].includes(activePhase),
    },
    {
      id: 'tech',
      title: 'Detecting Tech Stack',
      icon: FiPackage,
      color: 'purple',
      description: 'Identifying technologies, frameworks, and dependencies',
      active: activePhase === 'tech',
      complete: ['entry', 'complete'].includes(activePhase),
    },
    {
      id: 'entry',
      title: 'Finding Entry Points',
      icon: FiZap,
      color: 'orange',
      description: 'Locating main files and execution paths',
      active: activePhase === 'entry',
      complete: activePhase === 'complete',
    },
  ];

  const getPhaseColor = (color) => {
    const colors = {
      cyan: 'from-cyan-500 to-cyan-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color] || colors.blue;
  };

  const getPhaseTextColor = (color) => {
    const colors = {
      cyan: 'text-cyan-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      orange: 'text-orange-400',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Analysis Pipeline */}
      <div className="glass rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiCpu className="w-6 h-6 mr-2 text-cyan-400" />
          AI Analysis Pipeline
        </h3>

        <div className="space-y-4">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.id}
                className={`relative p-4 rounded-lg border-2 transition-all duration-500 ${
                  phase.active
                    ? `border-${phase.color}-500 bg-${phase.color}-500 bg-opacity-10`
                    : phase.complete
                    ? 'border-green-500 bg-green-500 bg-opacity-5'
                    : 'border-gray-700 bg-gray-800 bg-opacity-30'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      phase.active
                        ? `bg-gradient-to-br ${getPhaseColor(phase.color)} animate-pulse`
                        : phase.complete
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    }`}
                  >
                    {phase.complete ? (
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${phase.active ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold ${
                          phase.active
                            ? getPhaseTextColor(phase.color)
                            : phase.complete
                            ? 'text-green-400'
                            : 'text-gray-400'
                        }`}
                      >
                        {phase.title}
                      </h4>
                      {phase.active && (
                        <span className="text-xs text-cyan-400 animate-pulse">Processing...</span>
                      )}
                      {phase.complete && (
                        <span className="text-xs text-green-400">✓ Complete</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{phase.description}</p>
                  </div>
                </div>

                {/* Progress bar */}
                {phase.active && (
                  <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getPhaseColor(phase.color)} animate-pulse`}
                      style={{
                        width: '70%',
                        animation: 'progress 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discovered Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages Detected */}
        {Object.keys(discoveredItems.languages).length > 0 && (
          <div className="glass rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiCode className="w-5 h-5 mr-2 text-blue-400" />
              Languages Detected
            </h4>
            <div className="space-y-2">
              {Object.entries(discoveredItems.languages).map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-gray-300">{lang}</span>
                  <span className="text-sm text-gray-400">{count} files</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {discoveredItems.techStack.length > 0 && (
          <div className="glass rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiPackage className="w-5 h-5 mr-2 text-purple-400" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {discoveredItems.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm border border-purple-500 border-opacity-30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Frameworks */}
        {discoveredItems.frameworks.length > 0 && (
          <div className="glass rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiCpu className="w-5 h-5 mr-2 text-cyan-400" />
              Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {discoveredItems.frameworks.map((framework) => (
                <span
                  key={framework}
                  className="px-3 py-1 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-full text-sm border border-cyan-500 border-opacity-30"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Entry Points */}
        {discoveredItems.entryPoints.length > 0 && (
          <div className="glass rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiZap className="w-5 h-5 mr-2 text-orange-400" />
              Entry Points
            </h4>
            <div className="space-y-2">
              {discoveredItems.entryPoints.map((entry) => (
                <div key={entry} className="flex items-center space-x-2">
                  <FiFile className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-mono truncate">{entry}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Count */}
      {discoveredItems.files.length > 0 && (
        <div className="glass rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total Files Analyzed</span>
            <span className="text-2xl font-bold text-cyan-400">
              {discoveredItems.files.length.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RepositoryAnalysisViz;

// Made with Bob