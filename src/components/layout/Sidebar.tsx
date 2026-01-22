import { ParameterPanel } from '@/components/panels/ParameterPanel';
import { useThermoStore } from '@/store/thermoStore';

export function Sidebar() {
  const {
    cycleType,
    fluid,
    parameters,
    setCycleType,
    setFluid,
    setParameter
  } = useThermoStore();

  return (
    <aside className="w-80 border-r border-border bg-sidebar overflow-y-auto">
      <div className="p-4">
        <ParameterPanel
          cycleType={cycleType}
          onCycleChange={setCycleType}
          fluid={fluid}
          onFluidChange={setFluid}
          parameters={parameters}
          onParameterChange={setParameter}
        />
      </div>
    </aside>
  );
}
