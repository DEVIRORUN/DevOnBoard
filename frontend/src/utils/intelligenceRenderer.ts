/**
 * Intelligence Visualization Renderer Utilities
 * 
 * Helper functions for rendering the AI Repository Intelligence System
 */

import {
  IntelligenceNode,
  IntelligenceConnection,
  Particle,
  ConnectionType,
  AgentState,
  NodeStatus,
} from '../types/intelligence';

// ============================================================================
// GEOMETRY UTILITIES
// ============================================================================

export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function lerpPosition(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  t: number
): { x: number; y: number } {
  return {
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
  };
}

export function getNodeCenter(node: IntelligenceNode): { x: number; y: number } {
  return {
    x: node.position.x + node.size / 2,
    y: node.position.y + node.size / 2,
  };
}

export function isPointInNode(point: { x: number; y: number }, node: IntelligenceNode): boolean {
  return (
    point.x >= node.position.x &&
    point.x <= node.position.x + node.size &&
    point.y >= node.position.y &&
    point.y <= node.position.y + node.size
  );
}

// ============================================================================
// PATH UTILITIES
// ============================================================================

export function createStraightPath(
  start: { x: number; y: number },
  end: { x: number; y: number }
): string {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

export function createCurvedPath(
  start: { x: number; y: number },
  end: { x: number; y: number }
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Control point for smooth curve
  const controlX = start.x + dx / 2;
  const controlY = start.y + dy / 2 - dist * 0.2;
  
  return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
}

export function createRecursivePath(
  start: { x: number; y: number },
  end: { x: number; y: number }
): string {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Create a loop that goes out and comes back
  const midX = start.x + dx / 2;
  const midY = start.y + dy / 2;
  const loopRadius = dist * 0.3;
  
  return `
    M ${start.x} ${start.y}
    Q ${midX - loopRadius} ${midY - loopRadius} ${midX} ${midY}
    Q ${midX + loopRadius} ${midY - loopRadius} ${end.x} ${end.y}
  `;
}

export function getPointOnPath(path: string, t: number): { x: number; y: number } {
  // Create a temporary SVG path element to calculate point
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  const pathElement = document.createElementNS(svgNS, 'path');
  pathElement.setAttribute('d', path);
  svg.appendChild(pathElement);
  
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(t * length);
  
  return { x: point.x, y: point.y };
}

// ============================================================================
// CONNECTION RENDERING
// ============================================================================

export function getConnectionPath(
  connection: IntelligenceConnection,
  nodes: Record<string, IntelligenceNode>
): string {
  const source = nodes[connection.source];
  const target = nodes[connection.target];
  
  if (!source || !target) return '';
  
  const startPos = getNodeCenter(source);
  const endPos = getNodeCenter(target);
  
  switch (connection.type) {
    case 'neural':
    case 'pulsing':
    case 'particle':
      return createStraightPath(startPos, endPos);
    
    case 'dashed':
    case 'branching':
      return createCurvedPath(startPos, endPos);
    
    case 'recursive':
      return createRecursivePath(startPos, endPos);
    
    default:
      return createStraightPath(startPos, endPos);
  }
}

export function getConnectionStyle(connection: IntelligenceConnection): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    stroke: connection.color,
    strokeWidth: 2,
    opacity: 0.6,
    fill: 'none',
  };
  
  switch (connection.type) {
    case 'dashed':
      return {
        ...baseStyle,
        strokeDasharray: '5,5',
      };
    
    case 'pulsing':
      return {
        ...baseStyle,
        animation: 'pulse 2s ease-in-out infinite',
      };
    
    case 'recursive':
      return {
        ...baseStyle,
        strokeDasharray: '10,5',
        animation: 'dash 3s linear infinite',
      };
    
    default:
      return baseStyle;
  }
}

// ============================================================================
// NODE RENDERING
// ============================================================================

export function getNodeStyle(
  node: IntelligenceNode,
  isHovered: boolean,
  isSelected: boolean
): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: node.position.x,
    top: node.position.y,
    width: node.size,
    height: node.size,
    backgroundColor: node.color,
    borderRadius: node.type === 'core' ? '50%' : '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  if (node.status === 'active' || node.status === 'thinking') {
    baseStyle.boxShadow = `
      0 0 20px ${node.color}80,
      0 0 40px ${node.color}40,
      inset 0 0 20px ${node.color}20
    `;
    baseStyle.animation = 'pulse 2s ease-in-out infinite';
  }
  
  if (isHovered) {
    baseStyle.transform = 'scale(1.05)';
    baseStyle.boxShadow = `
      0 0 30px ${node.color}90,
      0 0 60px ${node.color}50
    `;
  }
  
  if (isSelected) {
    baseStyle.transform = 'scale(1.1)';
    baseStyle.boxShadow = `
      0 0 40px ${node.color},
      0 0 80px ${node.color}60,
      inset 0 0 30px ${node.color}30
    `;
    baseStyle.border = `2px solid ${node.color}`;
  }
  
  return baseStyle;
}

export function getGlowStyle(color: string, intensity: number): React.CSSProperties {
  return {
    boxShadow: `
      0 0 ${20 * intensity}px ${color}${Math.round(128 * intensity).toString(16)},
      0 0 ${40 * intensity}px ${color}${Math.round(64 * intensity).toString(16)}
    `,
  };
}

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================

export function updateParticle(particle: Particle, deltaTime: number): Particle {
  let newPosition = particle.position + particle.speed * deltaTime;
  
  // Loop back to start when reaching end
  if (newPosition > 1) {
    newPosition = 0;
  }
  
  return {
    ...particle,
    position: newPosition,
  };
}

export function createParticle(
  connectionId: string,
  color: string,
  speed: number = 0.02
): Particle {
  return {
    id: `particle-${connectionId}-${Date.now()}-${Math.random()}`,
    connectionId,
    position: Math.random(), // Start at random position
    speed,
    color,
    size: 3,
    glowRadius: 8,
  };
}

export function renderParticle(
  particle: Particle,
  path: string,
  ctx: CanvasRenderingContext2D
): void {
  const point = getPointOnPath(path, particle.position);
  
  // Draw glow
  ctx.shadowBlur = particle.glowRadius;
  ctx.shadowColor = particle.color;
  
  // Draw particle
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowBlur = 0;
}

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function createPulseAnimation(duration: number = 2000): string {
  return `pulse ${duration}ms ease-in-out infinite`;
}

export function createGlowAnimation(color: string, intensity: number = 1): string {
  return `
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 ${20 * intensity}px ${color}80;
      }
      50% {
        box-shadow: 0 0 ${40 * intensity}px ${color};
      }
    }
  `;
}

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

export function calculateRadialLayout(
  centerX: number,
  centerY: number,
  radius: number,
  count: number,
  startAngle: number = 0
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const angleStep = (2 * Math.PI) / count;
  
  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }
  
  return positions;
}

export function calculateCircularLayout(
  centerX: number,
  centerY: number,
  radius: number,
  count: number
): Array<{ x: number; y: number }> {
  return calculateRadialLayout(centerX, centerY, radius, count, -Math.PI / 2);
}

export function calculateGridLayout(
  startX: number,
  startY: number,
  cols: number,
  rows: number,
  spacingX: number,
  spacingY: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: startX + col * spacingX,
        y: startY + row * spacingY,
      });
    }
  }
  
  return positions;
}

// ============================================================================
// ZOOM UTILITIES
// ============================================================================

export function calculateZoomTransform(
  zoomLevel: number,
  focusPoint: { x: number; y: number },
  viewportWidth: number,
  viewportHeight: number
): string {
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  const translateX = centerX - focusPoint.x * zoomLevel;
  const translateY = centerY - focusPoint.y * zoomLevel;
  
  return `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;
}

export function getZoomScale(level: 'macro' | 'system' | 'microscopic'): number {
  switch (level) {
    case 'macro':
      return 1;
    case 'system':
      return 2.5;
    case 'microscopic':
      return 5;
    default:
      return 1;
  }
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function adjustBrightness(hex: string, percent: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };
  
  const newR = adjust(r).toString(16).padStart(2, '0');
  const newG = adjust(g).toString(16).padStart(2, '0');
  const newB = adjust(b).toString(16).padStart(2, '0');
  
  return `#${newR}${newG}${newB}`;
}

// ============================================================================
// STATUS UTILITIES
// ============================================================================

export function getStatusColor(status: NodeStatus): string {
  switch (status) {
    case 'inactive':
      return '#6b7280'; // gray
    case 'active':
    case 'thinking':
      return '#3b82f6'; // blue
    case 'complete':
      return '#10b981'; // green
    case 'error':
      return '#ef4444'; // red
    default:
      return '#6b7280';
  }
}

export function getStatusIcon(status: NodeStatus): string {
  switch (status) {
    case 'inactive':
      return '⏸️';
    case 'active':
    case 'thinking':
      return '🧠';
    case 'complete':
      return '✅';
    case 'error':
      return '❌';
    default:
      return '⚪';
  }
}

// Made with Bob