// Type definitions for the AI Repository Intelligence Visualization System

export type NodeType = 
  | 'core'
  | 'fetch-engine'
  | 'structure-engine'
  | 'stack-detection'
  | 'entry-point'
  | 'ai-reasoning'
  | 'prompt-engineering'
  | 'multi-agent'
  | 'knowledge-graph'
  | 'synthesis'
  | 'agent'
  | 'sub-component';

export type ConnectionType = 
  | 'neural'        // Solid neural lines - direct architectural dependency
  | 'pulsing'       // Pulsing animated lines - live AI reasoning flow
  | 'dashed'        // Dashed context links - indirect contextual influence
  | 'recursive'     // Circular recursive loops - reflection and reevaluation
  | 'particle'      // Particle streams - data transfer between systems
  | 'branching';    // Branching multi-paths - parallel AI reasoning

export type NodeStatus = 
  | 'inactive'      // Gray - not yet analyzed
  | 'active'        // Glowing - currently processing
  | 'complete'      // Green - finished successfully
  | 'thinking'      // Purple - AI reasoning in progress
  | 'error';        // Red - encountered an issue

export type ZoomLevel = 
  | 'macro'         // Level 1: 10,000 ft view - entire ecosystem
  | 'system'        // Level 2: 1,000 ft view - internal pipelines
  | 'microscopic';  // Level 3: 10 ft view - reasoning traces

export interface IntelligenceNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  status: NodeStatus;
  position: { x: number; y: number };
  size: number;
  color: string;
  confidence?: number;
  children?: IntelligenceNode[];
  metadata?: Record<string, any>;
  reasoning?: string[];
  timestamp?: number;
}

export interface IntelligenceConnection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  label?: string;
  animated: boolean;
  color: string;
  strength?: number;
  bidirectional?: boolean;
}

export interface Particle {
  id: string;
  connectionId: string;
  position: number; // 0 to 1 along the connection
  speed: number;
  color: string;
  size: number;
  glowRadius: number;
}

export interface ReasoningTrace {
  id: string;
  nodeId: string;
  timestamp: number;
  thought: string;
  confidence: number;
  context: string[];
  tokens?: number;
}

export interface AgentState {
  id: string;
  name: string;
  type: 'documentation' | 'architecture' | 'dependency' | 'learning-path' | 'code-explanation' | 'risk-detection' | 'setup';
  status: NodeStatus;
  currentTask?: string;
  progress: number;
  findings: string[];
  collaborating: string[]; // IDs of other agents
}

export interface AnalysisPhase {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
  progress: number;
  startTime?: number;
  endTime?: number;
  nodes: string[]; // Node IDs involved in this phase
}

export interface IntelligenceGraph {
  nodes: IntelligenceNode[];
  connections: IntelligenceConnection[];
  particles: Particle[];
  agents: AgentState[];
  phases: AnalysisPhase[];
  currentZoom: ZoomLevel;
  focusedNode?: string;
  reasoning: ReasoningTrace[];
}

export interface RepositoryIntelligence {
  repository: {
    name: string;
    owner: string;
    url: string;
    description: string;
  };
  structure: {
    folders: string[];
    files: string[];
    depth: number;
  };
  techStack: {
    languages: Record<string, number>;
    frameworks: string[];
    tools: string[];
    confidence: Record<string, number>;
  };
  entryPoints: {
    main: string[];
    routes: string[];
    config: string[];
  };
  architecture: {
    pattern: string;
    layers: string[];
    dependencies: Record<string, string[]>;
  };
  complexity: {
    score: number;
    hotspots: string[];
    risks: string[];
  };
}

export interface VisualizationConfig {
  width: number;
  height: number;
  enableParticles: boolean;
  enableAnimations: boolean;
  particleCount: number;
  animationSpeed: number;
  zoomSensitivity: number;
  colorScheme: 'default' | 'dark' | 'light' | 'neon';
}

export interface InteractionEvent {
  type: 'click' | 'hover' | 'zoom' | 'pan' | 'focus';
  target: string; // Node or connection ID
  timestamp: number;
  data?: any;
}

// Color system constants
export const INTELLIGENCE_COLORS = {
  // System colors
  ANALYSIS: '#3B82F6',        // Blue - analysis systems
  MEMORY: '#A855F7',          // Purple - memory/context
  LIVE_DATA: '#06B6D4',       // Cyan - live repository data
  VALIDATED: '#10B981',       // Green - validated understanding
  EXECUTION: '#F59E0B',       // Orange - execution pipelines
  ERROR: '#EF4444',           // Red - conflicts/errors
  ACTIVE: '#FFFFFF',          // White glow - active cognition
  CRITICAL: '#F59E0B',        // Gold - critical architecture nodes
  INACTIVE: '#6B7280',        // Gray - inactive/pending
  
  // Agent colors
  DOCUMENTATION: '#3B82F6',
  ARCHITECTURE: '#8B5CF6',
  DEPENDENCY: '#06B6D4',
  LEARNING_PATH: '#10B981',
  CODE_EXPLANATION: '#F59E0B',
  RISK_DETECTION: '#EF4444',
  SETUP: '#14B8A6',
} as const;

// Animation timing constants
export const ANIMATION_TIMINGS = {
  PULSE_DURATION: 2000,
  PARTICLE_SPEED: 0.001,
  GLOW_DURATION: 1500,
  TRANSITION_DURATION: 500,
  THINKING_ROTATION: 3000,
  WAVE_PROPAGATION: 1000,
} as const;

// Node size constants
export const NODE_SIZES = {
  CORE: 120,
  PRIMARY_SYSTEM: 80,
  SUB_COMPONENT: 50,
  AGENT: 60,
  MICRO: 30,
} as const;

// Zoom level scales
export const ZOOM_SCALES = {
  MACRO: 1,
  SYSTEM: 2.5,
  MICROSCOPIC: 5,
} as const;

// Made with Bob
