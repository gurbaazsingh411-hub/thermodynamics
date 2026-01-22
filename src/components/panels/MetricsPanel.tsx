import { memo } from 'react';
import { ThermodynamicCycle } from '@/types/thermodynamics';
import { formatValue } from '@/lib/thermodynamics';
import { Zap, Flame, Snowflake, TrendingUp } from 'lucide-react';

interface MetricsPanelProps {
  cycle: ThermodynamicCycle;
}

export const MetricsPanel = memo(function MetricsPanel({ cycle }: MetricsPanelProps) {
  if (!cycle) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-muted/20">
                <div className="w-4 h-4 bg-muted rounded" />
              </div>
            </div>
            <div className="metric-value text-muted">
              <div className="h-6 bg-muted rounded w-16" />
            </div>
            <div className="metric-label">
              <div className="h-4 bg-muted rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="metric-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-efficiency/20">
            <TrendingUp className="w-4 h-4 text-efficiency" />
          </div>
        </div>
        <div className="metric-value text-efficiency">
          {formatValue(cycle.efficiency, 1)}%
        </div>
        <div className="metric-label">Thermal Efficiency</div>
      </div>

      <div className="metric-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="metric-value text-primary">
          {formatValue(cycle.netWork, 1)}
        </div>
        <div className="metric-label">Net Work (kJ/kg)</div>
      </div>

      <div className="metric-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-heat/20">
            <Flame className="w-4 h-4 text-heat" />
          </div>
        </div>
        <div className="metric-value text-heat">
          {formatValue(cycle.heatIn, 1)}
        </div>
        <div className="metric-label">Heat In (kJ/kg)</div>
      </div>

      <div className="metric-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-cold/20">
            <Snowflake className="w-4 h-4 text-cold" />
          </div>
        </div>
        <div className="metric-value text-cold">
          {formatValue(cycle.heatOut, 1)}
        </div>
        <div className="metric-label">Heat Out (kJ/kg)</div>
      </div>
    </div>
  );
});
