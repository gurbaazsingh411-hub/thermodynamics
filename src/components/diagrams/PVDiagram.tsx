import { useMemo, memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { generatePVPoints, formatValue } from '@/lib/thermodynamics';
import { motion } from 'framer-motion';

interface PVDiagramProps {
  cycle: ThermodynamicCycle;
  className?: string;
}

export const PVDiagram = memo(function PVDiagram({ cycle, className = '' }: PVDiagramProps) {
  if (!cycle) {
    return (
      <div className={`chart-container p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">P-V Diagram</h3>
          <span className="text-xs text-muted-foreground font-mono">Loading...</span>
        </div>
        <div className="h-80 bg-muted/20 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Calculating cycle...</div>
        </div>
      </div>
    );
  }

  const data = useMemo(() => generatePVPoints(cycle), [cycle]);
  
  const statePoints = cycle.states.map(s => ({
    x: s.volume,
    y: s.pressure,
    name: s.name,
  }));

  return (
    <motion.div 
      className={`chart-container p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">P-V Diagram</h3>
        <span className="text-xs text-muted-foreground font-mono">Pressure vs Volume</span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" opacity={0.5} />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin - 0.1', 'dataMax + 0.1']}
            tickFormatter={(v) => formatValue(v, 2)}
            label={{ value: 'Volume (m³/kg)', position: 'bottom', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            stroke="hsl(var(--chart-axis))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={['dataMin - 100', 'dataMax + 100']}
            tickFormatter={(v) => formatValue(v, 0)}
            label={{ value: 'Pressure (kPa)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            stroke="hsl(var(--chart-axis))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            formatter={(value: number, name: string) => [formatValue(value, 4), name === 'y' ? 'P (kPa)' : 'V (m³/kg)']}
            labelFormatter={(label) => `V: ${formatValue(Number(label), 4)} m³/kg`}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="hsl(var(--chart-line-1))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
          />
          {statePoints.map((point, index) => (
            <ReferenceDot
              key={index}
              x={point.x}
              y={point.y}
              r={8}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <motion.div 
        className="flex justify-center gap-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {cycle.states.map((state, i) => (
          <motion.div 
            key={i}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
          >
            <div className="w-3 h-3 rounded-full bg-primary" style={{ boxShadow: '0 0 8px hsl(var(--primary))' }} />
            <span className="text-xs font-mono text-muted-foreground">
              {i + 1}: {formatValue(state.pressure, 0)} kPa
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
});
