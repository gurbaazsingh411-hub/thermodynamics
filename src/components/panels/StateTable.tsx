import { memo } from 'react';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { formatValue } from '@/lib/thermodynamics';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StateTableProps {
  cycle: ThermodynamicCycle;
}

export const StateTable = memo(function StateTable({ cycle }: StateTableProps) {
  if (!cycle) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">State Points</span>
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="h-32 bg-muted/20 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground">Calculating states...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">State Points</span>
        <span className="text-xs text-muted-foreground">{cycle.states.length} states</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-mono text-xs">State</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">T (K)</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">P (kPa)</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">V (m³/kg)</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">H (kJ/kg)</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">S (kJ/kg·K)</TableHead>
              <TableHead className="text-muted-foreground font-mono text-xs">U (kJ/kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cycle.states.map((state, index) => (
              <TableRow key={state.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-mono font-medium">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ 
                        backgroundColor: `hsl(var(--chart-line-${(index % 4) + 1}))`,
                        boxShadow: `0 0 8px hsl(var(--chart-line-${(index % 4) + 1}))`
                      }} 
                    />
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-heat">{formatValue(state.temperature, 1)}</TableCell>
                <TableCell className="font-mono text-cold">{formatValue(state.pressure, 1)}</TableCell>
                <TableCell className="font-mono">{formatValue(state.volume, 4)}</TableCell>
                <TableCell className="font-mono">{formatValue(state.enthalpy, 1)}</TableCell>
                <TableCell className="font-mono text-entropy">{formatValue(state.entropy, 3)}</TableCell>
                <TableCell className="font-mono">{formatValue(state.internalEnergy, 1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
