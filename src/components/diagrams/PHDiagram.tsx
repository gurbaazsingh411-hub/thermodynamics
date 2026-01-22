import React, { useEffect, useRef } from 'react';
import { useThermoStore } from '../../store/thermoStore';
import { ThermodynamicCycle, CycleType } from '@/types/thermodynamics';

interface PHDiagramProps {
  cycle?: ThermodynamicCycle;
  className?: string;
}

const PHDiagram: React.FC<PHDiagramProps> = ({ cycle, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    fluid, 
    cycleType, 
    useRealGas,
    steamQuality
  } = useThermoStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw saturation dome for water if applicable
    if (fluid.name === 'Water') {
      drawSaturationDome(ctx, canvas.width, canvas.height);
    }

    // Draw cycle or process based on current selection
    if (cycle && cycleType && cycleType !== 'otto') { // Using 'otto' as default since 'None' is not valid
      drawCycle(ctx, canvas.width, canvas.height, cycleType);
    }

    // Draw current state point if no cycle is provided
    if (!cycle) {
      drawCurrentStatePoint(ctx, canvas.width, canvas.height);
    }
  }, [fluid, cycleType, useRealGas, steamQuality, cycle]);

  // Function to draw grid
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Draw vertical lines (enthalpy)
    for (let i = 0; i < width; i += width / 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Draw horizontal lines (pressure)
    for (let i = 0; i < height; i += height / 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw axes labels
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '14px sans-serif';
    ctx.fillText('Enthalpy (kJ/kg)', width / 2 - 50, height - 10);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Pressure (kPa)', 0, 0);
    ctx.restore();
  };

  // Function to draw saturation dome for water
  const drawSaturationDome = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]); // Dashed line for saturation dome
    
    ctx.beginPath();
    
    // Simplified saturation dome curve (this is a rough approximation)
    // In a real implementation, we'd use actual steam table data
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width * 0.3;
    const radiusY = height * 0.4;
    
    // Draw an ellipse-like shape for the saturation dome
    for (let angle = 0; angle <= Math.PI; angle += 0.01) {
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Label the dome
    ctx.fillStyle = '#93C5FD';
    ctx.font = '12px sans-serif';
    ctx.fillText('Saturation Dome', centerX, centerY - radiusY - 10);
  };

  // Function to draw thermodynamic cycle
  const drawCycle = (ctx: CanvasRenderingContext2D, width: number, height: number, cycleType: CycleType) => {
    // Different drawing logic based on cycle type
    switch (cycleType) {
      case 'rankine':
        drawRankineCycle(ctx, width, height);
        break;
      case 'refrigeration':
        drawRefrigerationCycle(ctx, width, height);
        break;
      default:
        // Draw other cycles if needed
        break;
    }
  };

  // Function to draw Rankine cycle on P-H diagram
  const drawRankineCycle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#F87171';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Simplified Rankine cycle on P-H diagram
    // Points: 1-2-3-4 (Pump -> Boiler -> Turbine -> Condenser)
    const points = [
      { h: 200, p: 10 },   // Point 1: Saturated liquid at condenser pressure
      { h: 250, p: 3000 }, // Point 2: Compressed liquid at boiler pressure
      { h: 3000, p: 3000 }, // Point 3: Superheated steam at turbine inlet
      { h: 2200, p: 10 }   // Point 4: Wet steam at condenser pressure
    ];

    // Convert points to canvas coordinates
    const canvasPoints = points.map(point => ({
      x: mapValue(point.h, 0, 4000, 0, width),
      y: mapValue(point.p, 0, 4000, height, 0) // Pressure inverted (higher pressure at bottom)
    }));

    // Draw the cycle
    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
    }
    
    ctx.closePath();
    ctx.stroke();

    // Draw points and labels
    canvasPoints.forEach((point, index) => {
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${index + 1}`, point.x - 5, point.y - 10);
    });
  };

  // Function to draw Refrigeration cycle on P-H diagram
  const drawRefrigerationCycle = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Simplified refrigeration cycle on P-H diagram
    // Points: 1-2-3-4 (Evaporator -> Compressor -> Condenser -> Expansion valve)
    const points = [
      { h: 250, p: 200 },   // Point 1: Saturated vapor at evaporator pressure
      { h: 450, p: 1000 },  // Point 2: Superheated vapor after compression
      { h: 270, p: 1000 },  // Point 3: Subcooled liquid after condensation
      { h: 250, p: 200 }    // Point 4: Mixed phase after expansion
    ];

    // Convert points to canvas coordinates
    const canvasPoints = points.map(point => ({
      x: mapValue(point.h, 0, 500, 0, width),
      y: mapValue(point.p, 0, 1200, height, 0) // Pressure inverted (higher pressure at bottom)
    }));

    // Draw the cycle
    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
    }
    
    ctx.closePath();
    ctx.stroke();

    // Draw points and labels
    canvasPoints.forEach((point, index) => {
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${index + 1}`, point.x - 5, point.y - 10);
    });
  };

  // Function to draw current state point
  const drawCurrentStatePoint = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw a default point if no specific state data is available
    const currentPoint = {
      x: width / 2,
      y: height / 2
    };

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(currentPoint.x, currentPoint.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Helper function to map values to canvas coordinates
  const mapValue = (value: number, min1: number, max1: number, min2: number, max2: number): number => {
    return ((value - min1) / (max1 - min1)) * (max2 - min2) + min2;
  };

  return (
    <div className={`${className || ''} w-full h-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default PHDiagram;