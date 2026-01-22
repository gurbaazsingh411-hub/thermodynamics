import { motion } from 'framer-motion';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { formatValue } from '@/lib/thermodynamics';

interface AnimatedCycleDiagramProps {
  cycle: ThermodynamicCycle;
  currentProcess: number;
}

export function AnimatedCycleDiagram({ cycle, currentProcess }: AnimatedCycleDiagramProps) {
  const states = cycle.states;
  const centerX = 200;
  const centerY = 150;
  const radius = 100;

  // Calculate positions for each state
  const statePositions = states.map((_, i) => {
    const angle = (i * 2 * Math.PI) / states.length - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Cycle Flow Diagram</span>
      </div>
      <div className="panel-content">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--chart-grid))" strokeWidth="0.5" opacity="0.3" />
            </pattern>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Process arrows */}
          {statePositions.map((pos, i) => {
            const nextPos = statePositions[(i + 1) % states.length];
            const isActive = i === currentProcess;
            const isCompleted = i < currentProcess;
            
            return (
              <motion.g key={`arrow-${i}`}>
                <motion.line
                  x1={pos.x}
                  y1={pos.y}
                  x2={nextPos.x}
                  y2={nextPos.y}
                  stroke={isActive ? 'hsl(var(--primary))' : isCompleted ? 'hsl(var(--efficiency))' : 'hsl(var(--border))'}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray={isActive ? '10,5' : 'none'}
                  markerEnd="url(#arrowhead)"
                  filter={isActive ? 'url(#glow)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    strokeDashoffset: isActive ? [0, -30] : 0
                  }}
                  transition={{ 
                    pathLength: { duration: 0.5 },
                    strokeDashoffset: { duration: 1, repeat: Infinity, ease: 'linear' }
                  }}
                />
                {/* Process label */}
                <text
                  x={(pos.x + nextPos.x) / 2}
                  y={(pos.y + nextPos.y) / 2 - 10}
                  fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {i + 1}→{(i + 1) % states.length + 1}
                </text>
              </motion.g>
            );
          })}

          {/* State nodes */}
          {statePositions.map((pos, i) => {
            const state = states[i];
            const isCurrentStart = i === currentProcess;
            const isCurrentEnd = i === (currentProcess + 1) % states.length;
            const isActive = isCurrentStart || isCurrentEnd;
            
            return (
              <motion.g key={`state-${i}`}>
                {/* Outer glow ring for active states */}
                {isActive && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={35}
                    fill="none"
                    stroke={isCurrentStart ? 'hsl(var(--cold))' : 'hsl(var(--heat))'}
                    strokeWidth={2}
                    opacity={0.3}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* State circle */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={28}
                  fill={isActive ? 'hsl(var(--card))' : 'hsl(var(--muted))'}
                  stroke={isCurrentStart ? 'hsl(var(--cold))' : isCurrentEnd ? 'hsl(var(--heat))' : 'hsl(var(--border))'}
                  strokeWidth={isActive ? 3 : 2}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
                
                {/* State number */}
                <text
                  x={pos.x}
                  y={pos.y - 8}
                  fill="hsl(var(--foreground))"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {i + 1}
                </text>
                
                {/* Temperature */}
                <text
                  x={pos.x}
                  y={pos.y + 8}
                  fill="hsl(var(--heat))"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {formatValue(state.temperature, 0)}K
                </text>
                
                {/* Pressure */}
                <text
                  x={pos.x}
                  y={pos.y + 20}
                  fill="hsl(var(--cold))"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {formatValue(state.pressure, 0)}kPa
                </text>
              </motion.g>
            );
          })}

          {/* Legend */}
          <g transform="translate(10, 260)">
            <circle cx={10} cy={10} r={6} fill="hsl(var(--cold))" />
            <text x={22} y={14} fill="hsl(var(--muted-foreground))" fontSize="10">Start</text>
            <circle cx={70} cy={10} r={6} fill="hsl(var(--heat))" />
            <text x={82} y={14} fill="hsl(var(--muted-foreground))" fontSize="10">End</text>
            <line x1={130} y1={10} x2={160} y2={10} stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5,3" />
            <text x={170} y={14} fill="hsl(var(--muted-foreground))" fontSize="10">Active Process</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
