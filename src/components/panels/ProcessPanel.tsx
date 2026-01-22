import { memo } from 'react';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { ArrowRight } from 'lucide-react';

interface ProcessPanelProps {
  cycle: ThermodynamicCycle;
}

const processInfo: Record<string, { processes: string[]; colors: string[] }> = {
  otto: {
    processes: ['Isentropic Compression', 'Isochoric Heat Addition', 'Isentropic Expansion', 'Isochoric Heat Rejection'],
    colors: ['process-isentropic', 'process-isochoric', 'process-isentropic', 'process-isochoric'],
  },
  diesel: {
    processes: ['Isentropic Compression', 'Isobaric Heat Addition', 'Isentropic Expansion', 'Isochoric Heat Rejection'],
    colors: ['process-isentropic', 'process-isobaric', 'process-isentropic', 'process-isochoric'],
  },
  brayton: {
    processes: ['Isentropic Compression', 'Isobaric Heat Addition', 'Isentropic Expansion', 'Isobaric Heat Rejection'],
    colors: ['process-isentropic', 'process-isobaric', 'process-isentropic', 'process-isobaric'],
  },
  carnot: {
    processes: ['Isothermal Compression', 'Isentropic Compression', 'Isothermal Expansion', 'Isentropic Expansion'],
    colors: ['process-isothermal', 'process-isentropic', 'process-isothermal', 'process-isentropic'],
  },
};

export const ProcessPanel = memo(function ProcessPanel({ cycle }: ProcessPanelProps) {
  if (!cycle) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Process Sequence</span>
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
        <div className="panel-content">
          <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const info = processInfo[cycle.type] || processInfo.otto;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Process Sequence</span>
        <span className="text-xs text-muted-foreground">{cycle.name}</span>
      </div>
      <div className="panel-content">
        <div className="flex flex-wrap items-center gap-2">
          {info.processes.map((process, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground font-medium">
                  {index + 1}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="font-mono text-sm text-foreground font-medium">
                  {(index + 1) % cycle.states.length + 1}
                </span>
              </div>
              <span className={`process-tag ${info.colors[index]}`}>
                {process}
              </span>
              {index < info.processes.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
