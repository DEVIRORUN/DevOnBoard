/**
 * Intelligence Visualization Component
 * 
 * The living, breathing AI Repository Intelligence System visualization
 * Shows how the AI analyzes, understands, and synthesizes repository knowledge
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IntelligenceNode,
  IntelligenceConnection,
  Particle,
  IntelligenceGraph,
  ZoomLevel,
  INTELLIGENCE_COLORS,
  NODE_SIZES,
  ZOOM_SCALES,
  ANIMATION_TIMINGS,
} from '../types/intelligence';
import {
  getConnectionPath,
  getConnectionStyle,
  getNodeStyle,
  calculateRadialLayout,
  getZoomScale,
  createParticle,
  updateParticle,
  renderParticle,
  getNodeCenter,
} from '../utils/intelligenceRenderer';
import '../styles/intelligence-animations.css';

export default function IntelligenceVisualization({ repositoryData, analysisState }) {
  const [graph, setGraph] = useState(null);
  const [zoomLevel, setZoomLevel] = useState('macro');
  const [focusedNode, setFocusedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  // Initialize the intelligence graph
  useEffect(() => {
    const initialGraph = createIntelligenceGraph(repositoryData, analysisState);
    setGraph(initialGraph);
  }, [repositoryData, analysisState]);

  // Update graph based on analysis state
  useEffect(() => {
    if (!graph || !analysisState) return;

    const updatedGraph = updateGraphFromAnalysis(graph, analysisState);
    setGraph(updatedGraph);
  }, [analysisState]);

  // Particle animation loop
  useEffect(() => {
    if (!canvasRef.current || !graph) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      setParticles(prevParticles => {
        const updated = prevParticles.map(p => updateParticle(p, deltaTime));
        
        // Render each particle
        updated.forEach(particle => {
          const connection = graph.connections.find(c => c.id === particle.connectionId);
          if (connection) {
            const path = getConnectionPath(connection, graph.nodes.reduce((acc, n) => {
              acc[n.id] = n;
              return acc;
            }, {}));
            renderParticle(particle, path, ctx);
          }
        });

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [graph]);

  // Generate particles for active connections
  useEffect(() => {
    if (!graph) return;

    const activeConnections = graph.connections.filter(c => c.animated);
    const newParticles = [];

    activeConnections.forEach(connection => {
      // Create 3 particles per active connection
      for (let i = 0; i < 3; i++) {
        newParticles.push(
          createParticle(connection.id, connection.color, 0.001 + Math.random() * 0.001)
        );
      }
    });

    setParticles(prev => [...prev, ...newParticles]);
  }, [graph?.connections]);

  const handleNodeClick = useCallback((node) => {
    setFocusedNode(node.id);
    
    // Zoom to system level if clicking from macro
    if (zoomLevel === 'macro') {
      setZoomLevel('system');
    } else if (zoomLevel === 'system') {
      setZoomLevel('microscopic');
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel === 'microscopic') {
      setZoomLevel('system');
    } else if (zoomLevel === 'system') {
      setZoomLevel('macro');
      setFocusedNode(null);
    }
  }, [zoomLevel]);

  if (!graph) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing Intelligence System...</p>
        </div>
      </div>
    );
  }

  const currentScale = getZoomScale(zoomLevel);

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-500/30">
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">Zoom Level:</div>
          <div className="text-sm font-semibold text-blue-400 uppercase">{zoomLevel}</div>
          <div className="text-xs text-gray-500">({currentScale}x)</div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel === 'macro'}
          className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 max-w-xs">
        <div className="text-xs font-semibold text-gray-300 mb-2">System Status</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-gray-400">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-gray-400">Thinking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400">Complete</span>
          </div>
        </div>
      </div>

      {/* Main Visualization Container */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${currentScale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            {/* Glow filters */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Render connections */}
          {graph.connections.map(connection => {
            const nodesMap = graph.nodes.reduce((acc, n) => {
              acc[n.id] = n;
              return acc;
            }, {});
            const path = getConnectionPath(connection, nodesMap);
            const style = getConnectionStyle(connection);

            return (
              <path
                key={connection.id}
                d={path}
                className="intelligence-connection"
                style={style}
                filter="url(#glow)"
              />
            );
          })}
        </svg>

        {/* Canvas for particles */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Render nodes */}
        {graph.nodes.map(node => {
          const isHovered = hoveredNode === node.id;
          const isFocused = focusedNode === node.id;
          const style = getNodeStyle(node, isHovered, isFocused);

          return (
            <div
              key={node.id}
              className="intelligence-node"
              style={style}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-center">
                <div className="text-xs font-semibold text-white/90 mb-1">
                  {node.label}
                </div>
                {node.confidence !== undefined && (
                  <div className="text-[10px] text-white/60">
                    {Math.round(node.confidence * 100)}%
                  </div>
                )}
              </div>

              {/* Status indicator */}
              {node.status === 'thinking' && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Node Detail Panel */}
      {focusedNode && (
        <NodeDetailPanel
          node={graph.nodes.find(n => n.id === focusedNode)}
          onClose={() => setFocusedNode(null)}
        />
      )}
    </div>
  );
}

// Helper component for node details
function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;

  return (
    <div className="absolute top-20 right-4 z-20 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 max-w-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{node.label}</h3>
          <p className="text-sm text-gray-400">{node.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {node.confidence !== undefined && (
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-1">Confidence</div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${node.confidence * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(node.confidence * 100)}%</div>
        </div>
      )}

      {node.reasoning && node.reasoning.length > 0 && (
        <div>
          <div className="text-xs text-gray-400 mb-2">Reasoning Trace</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {node.reasoning.map((thought, idx) => (
              <div key={idx} className="text-xs text-gray-300 bg-gray-800/50 rounded p-2">
                {thought}
              </div>
            ))}
          </div>
        </div>
      )}

      {node.metadata && Object.keys(node.metadata).length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-gray-400 mb-2">Metadata</div>
          <div className="space-y-1">
            {Object.entries(node.metadata).map(([key, value]) => (
              <div key={key} className="text-xs flex justify-between">
                <span className="text-gray-500">{key}:</span>
                <span className="text-gray-300">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Create initial intelligence graph
function createIntelligenceGraph(repositoryData, analysisState) {
  const centerX = 960;
  const centerY = 540;

  // Central core node
  const coreNode = {
    id: 'core',
    type: 'core',
    label: 'Repository Intelligence Core',
    description: 'Central AI orchestration system',
    status: analysisState?.phase === 'complete' ? 'complete' : 'active',
    position: { x: centerX - NODE_SIZES.CORE / 2, y: centerY - NODE_SIZES.CORE / 2 },
    size: NODE_SIZES.CORE,
    color: INTELLIGENCE_COLORS.ACTIVE,
    confidence: 1.0,
  };

  // Primary system nodes in radial layout
  const systemTypes = [
    { id: 'fetch', label: 'Repository Fetch', color: INTELLIGENCE_COLORS.LIVE_DATA, type: 'fetch-engine' },
    { id: 'structure', label: 'Structure Analysis', color: INTELLIGENCE_COLORS.ANALYSIS, type: 'structure-engine' },
    { id: 'stack', label: 'Stack Detection', color: INTELLIGENCE_COLORS.VALIDATED, type: 'stack-detection' },
    { id: 'entry', label: 'Entry Point Intelligence', color: INTELLIGENCE_COLORS.EXECUTION, type: 'entry-point' },
    { id: 'reasoning', label: 'AI Reasoning Engine', color: INTELLIGENCE_COLORS.MEMORY, type: 'ai-reasoning' },
    { id: 'prompt', label: 'Prompt Engineering', color: INTELLIGENCE_COLORS.CRITICAL, type: 'prompt-engineering' },
    { id: 'agents', label: 'Multi-Agent System', color: INTELLIGENCE_COLORS.ANALYSIS, type: 'multi-agent' },
    { id: 'knowledge', label: 'Knowledge Graph', color: INTELLIGENCE_COLORS.LIVE_DATA, type: 'knowledge-graph' },
    { id: 'synthesis', label: 'Onboarding Synthesis', color: INTELLIGENCE_COLORS.VALIDATED, type: 'synthesis' },
  ];

  const positions = calculateRadialLayout(centerX, centerY, 300, systemTypes.length);

  const systemNodes = systemTypes.map((system, idx) => ({
    id: system.id,
    type: system.type,
    label: system.label,
    description: `${system.label} subsystem`,
    status: getSystemStatus(system.id, analysisState),
    position: { x: positions[idx].x - NODE_SIZES.PRIMARY_SYSTEM / 2, y: positions[idx].y - NODE_SIZES.PRIMARY_SYSTEM / 2 },
    size: NODE_SIZES.PRIMARY_SYSTEM,
    color: system.color,
    confidence: getSystemConfidence(system.id, analysisState),
  }));

  // Create connections
  const connections = systemNodes.map(node => ({
    id: `core-${node.id}`,
    source: 'core',
    target: node.id,
    type: node.status === 'active' ? 'pulsing' : 'neural',
    animated: node.status === 'active',
    color: node.color,
  }));

  // Add inter-system connections
  connections.push(
    { id: 'fetch-structure', source: 'fetch', target: 'structure', type: 'neural', animated: false, color: INTELLIGENCE_COLORS.ANALYSIS },
    { id: 'structure-stack', source: 'structure', target: 'stack', type: 'neural', animated: false, color: INTELLIGENCE_COLORS.ANALYSIS },
    { id: 'stack-entry', source: 'stack', target: 'entry', type: 'neural', animated: false, color: INTELLIGENCE_COLORS.EXECUTION },
    { id: 'reasoning-prompt', source: 'reasoning', target: 'prompt', type: 'pulsing', animated: true, color: INTELLIGENCE_COLORS.MEMORY },
    { id: 'prompt-agents', source: 'prompt', target: 'agents', type: 'branching', animated: true, color: INTELLIGENCE_COLORS.CRITICAL },
    { id: 'agents-knowledge', source: 'agents', target: 'knowledge', type: 'particle', animated: true, color: INTELLIGENCE_COLORS.LIVE_DATA },
    { id: 'knowledge-synthesis', source: 'knowledge', target: 'synthesis', type: 'neural', animated: false, color: INTELLIGENCE_COLORS.VALIDATED },
  );

  return {
    nodes: [coreNode, ...systemNodes],
    connections,
    particles: [],
    agents: [],
    phases: [],
    currentZoom: 'macro',
  };
}

// Update graph based on analysis state
function updateGraphFromAnalysis(graph, analysisState) {
  if (!analysisState) return graph;

  const updatedNodes = graph.nodes.map(node => ({
    ...node,
    status: getSystemStatus(node.id, analysisState),
    confidence: getSystemConfidence(node.id, analysisState),
  }));

  return {
    ...graph,
    nodes: updatedNodes,
  };
}

// Get system status from analysis state
function getSystemStatus(systemId, analysisState) {
  if (!analysisState) return 'inactive';

  const phaseMap = {
    'fetch': 'fetching',
    'structure': 'analyzing',
    'stack': 'detecting',
    'entry': 'tracing',
    'reasoning': 'thinking',
    'prompt': 'engineering',
    'agents': 'collaborating',
    'knowledge': 'mapping',
    'synthesis': 'synthesizing',
  };

  if (analysisState.phase === phaseMap[systemId]) {
    return 'active';
  }

  if (analysisState.completedPhases?.includes(phaseMap[systemId])) {
    return 'complete';
  }

  return 'inactive';
}

// Get system confidence from analysis state
function getSystemConfidence(systemId, analysisState) {
  if (!analysisState?.confidence) return 0;
  return analysisState.confidence[systemId] || 0;
}

// Made with Bob