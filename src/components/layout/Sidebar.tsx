import { useState } from 'react';
import { ParameterPanel } from '@/components/panels/ParameterPanel';
import { useThermoStore } from '@/store/thermoStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const {
    cycleType,
    fluid,
    parameters,
    setCycleType,
    setFluid,
    setParameter
  } = useThermoStore();

  return (
    <aside className={`${isMinimized ? 'w-12' : 'w-80'} border-r border-border bg-sidebar transition-all duration-300 ease-in-out overflow-y-auto relative`}>
      {!isMinimized ? (
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
      ) : (
        <div className="p-2 flex justify-center items-center h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(false)}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="absolute top-1/2 right-0 transform translate-x-1/2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8 p-0 rounded-l-none rounded-r-full border-l-0"
        >
          {isMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}