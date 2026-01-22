import { useState, memo } from 'react';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { StateTable } from '@/components/panels/StateTable';
import { ProcessPanel } from '@/components/panels/ProcessPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table2, GitBranch, FileText, Calculator } from 'lucide-react';

interface BottomPanelProps {
  cycle: ThermodynamicCycle;
}

export const BottomPanel = memo(function BottomPanel({ cycle }: BottomPanelProps) {
  return (
    <div className="h-72 border-t border-border bg-card/50 overflow-hidden">
      <Tabs defaultValue="states" className="h-full flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger 
              value="states" 
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
            >
              <Table2 className="w-4 h-4 mr-2" />
              State Points
            </TabsTrigger>
            <TabsTrigger 
              value="process" 
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Processes
            </TabsTrigger>
            <TabsTrigger 
              value="equations" 
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Equations
            </TabsTrigger>
            <TabsTrigger 
              value="log" 
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              Solver Log
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="states" className="mt-0 h-full">
            <StateTable cycle={cycle} />
          </TabsContent>
          
          <TabsContent value="process" className="mt-0 h-full">
            <ProcessPanel cycle={cycle} />
          </TabsContent>
          
          <TabsContent value="equations" className="mt-0 h-full">
            <EquationsPanel cycle={cycle} />
          </TabsContent>
          
          <TabsContent value="log" className="mt-0 h-full">
            <SolverLog />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});

function EquationsPanel({ cycle }: { cycle: ThermodynamicCycle }) {
  const equations: Record<string, { title: string; equations: string[] }> = {
    otto: {
      title: 'Otto Cycle Equations',
      equations: [
        'η = 1 - (1/r^(γ-1))',
        'T₂/T₁ = r^(γ-1)',
        'P₂/P₁ = r^γ',
        'Q_in = cv(T₃ - T₂)',
        'W_net = Q_in - Q_out',
      ],
    },
    diesel: {
      title: 'Diesel Cycle Equations',
      equations: [
        'η = 1 - (1/r^(γ-1)) × (ρ^γ - 1)/(γ(ρ - 1))',
        'T₂/T₁ = r^(γ-1)',
        'T₃/T₂ = ρ (cutoff ratio)',
        'Q_in = cp(T₃ - T₂)',
        'W_net = Q_in - Q_out',
      ],
    },
    brayton: {
      title: 'Brayton Cycle Equations',
      equations: [
        'η = 1 - (1/rp)^((γ-1)/γ)',
        'T₂/T₁ = rp^((γ-1)/γ)',
        'Q_in = cp(T₃ - T₂)',
        'W_comp = cp(T₂ - T₁)',
        'W_turb = cp(T₃ - T₄)',
      ],
    },
  };

  const info = equations[cycle.type] || equations.otto;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">{info.title}</span>
      </div>
      <div className="panel-content">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {info.equations.map((eq, i) => (
            <div key={i} className="bg-muted/30 rounded-lg px-4 py-3 font-mono text-sm text-foreground">
              {eq}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SolverLog() {
  const logs = [
    { time: '00:00:00.000', level: 'INFO', message: 'Initializing thermodynamic solver...' },
    { time: '00:00:00.012', level: 'INFO', message: 'Working fluid: Air (R=0.287 kJ/kg·K)' },
    { time: '00:00:00.015', level: 'INFO', message: 'Cycle type: Otto' },
    { time: '00:00:00.018', level: 'CALC', message: 'Computing isentropic compression (1→2)...' },
    { time: '00:00:00.021', level: 'CALC', message: 'Computing isochoric heat addition (2→3)...' },
    { time: '00:00:00.024', level: 'CALC', message: 'Computing isentropic expansion (3→4)...' },
    { time: '00:00:00.027', level: 'CALC', message: 'Computing isochoric heat rejection (4→1)...' },
    { time: '00:00:00.030', level: 'OK', message: 'Cycle computation complete. Efficiency: 56.5%' },
  ];

  return (
    <div className="panel h-full">
      <div className="panel-header">
        <span className="panel-title">Solver Log</span>
        <span className="status-dot status-dot-active" />
      </div>
      <div className="font-mono text-xs space-y-1 p-3 bg-background/50 rounded max-h-40 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-muted-foreground">[{log.time}]</span>
            <span className={
              log.level === 'OK' ? 'text-efficiency' : 
              log.level === 'CALC' ? 'text-primary' : 
              'text-muted-foreground'
            }>
              [{log.level}]
            </span>
            <span className="text-foreground">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
