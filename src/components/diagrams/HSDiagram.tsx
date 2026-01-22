import React, { useEffect, useRef } from 'react';
import { useThermoStore } from '../../store/thermoStore';
import { ThermodynamicCycle } from '@/types/thermodynamics';

interface HSDiagramProps {
  cycle?: ThermodynamicCycle;
  className?: string;
}

const HSDiagram: React.FC<HSDiagramProps> = ({ cycle, className }) => {
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
    if (cycle && cycleType && cycleType !== 'otto') { // Using 'otto' as default since it's the base case
      drawCycle(ctx, canvas.width, canvas.height, cycleType, cycle);
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

    // Draw vertical lines (entropy)
    for (let i = 0; i < width; i += width / 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Draw horizontal lines (enthalpy)
    for (let i = 0; i < height; i += height / 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw axes labels
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '14px sans-serif';
    ctx.fillText('Entropy (kJ/kg·K)', width / 2 - 50, height - 10);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Enthalpy (kJ/kg)', 0, 0);
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
  const drawCycle = (ctx: CanvasRenderingContext2D, width: number, height: number, cycleType: string, cycle: ThermodynamicCycle) => {
    // Different drawing logic based on cycle type
    switch (cycleType) {
      case 'rankine':
        drawRankineCycle(ctx, width, height, cycle);
        break;
      case 'refrigeration':
        drawRefrigerationCycle(ctx, width, height, cycle);
        break;
      default:
        // Draw other cycles if needed
        drawGenericCycle(ctx, width, height, cycle);
        break;
    }
  };

  // Function to draw Rankine cycle on H-S diagram
  const drawRankineCycle = (ctx: CanvasRenderingContext2D, width: number, height: number, cycle: ThermodynamicCycle) => {
    ctx.strokeStyle = '#F87171';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Simplified Rankine cycle on H-S diagram
    // Points: 1-2-3-4 (Condensate Pump -> Boiler -> Turbine -> Condenser)
    const points = [
      { h: 200, s: 0.5 },   // Point 1: Saturated liquid at condenser pressure
      { h: 250, s: 0.5 },   // Point 2: Compressed liquid at boiler pressure (isentropic)
      { h: 3000, s: 6.5 },  // Point 3: Superheated steam at turbine inlet
      { h: 2200, s: 6.0 }   // Point 4: Wet steam at condenser pressure (isentropic)
    ];

    // Convert points to canvas coordinates
    const canvasPoints = points.map(point => ({
      x: mapValue(point.s, 0, 8, 0, width),  // Entropy on x-axis
      y: mapValue(point.h, 0, 4000, height, 0) // Enthalpy on y-axis (inverted)
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

  // Function to draw Refrigeration cycle on H-S diagram
  const drawRefrigerationCycle = (ctx: CanvasRenderingContext2D, width: number, height: number, cycle: ThermodynamicCycle) => {
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Simplified refrigeration cycle on H-S diagram
    // Points: 1-2-3-4 (Evaporator -> Compressor -> Condenser -> Expansion valve)
    const points = [
      { h: 250, s: 0.9 },   // Point 1: Saturated vapor at evaporator pressure
      { h: 450, s: 0.95 },  // Point 2: Superheated vapor after compression (entropy increases)
      { h: 270, s: 0.95 },  // Point 3: Subcooled liquid after condensation
      { h: 250, s: 0.85 }   // Point 4: Mixed phase after expansion (isenthalpic)
    ];

    // Convert points to canvas coordinates
    const canvasPoints = points.map(point => ({
      x: mapValue(point.s, 0, 1.5, 0, width),  // Entropy on x-axis
      y: mapValue(point.h, 0, 500, height, 0) // Enthalpy on y-axis (inverted)
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

  // Function to draw generic cycle
  const drawGenericCycle = (ctx: CanvasRenderingContext2D, width: number, height: number, cycle: ThermodynamicCycle) => {
    if (!cycle?.states?.length) return;

    // Draw a generic representation based on the cycle's states
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    // Map the first few states to H-S coordinates
    const points = cycle.states.slice(0, 4).map(state => ({
      h: state.enthalpy,
      s: state.entropy
    }));

    // Convert points to canvas coordinates
    const canvasPoints = points.map(point => ({
      x: mapValue(point.s, 0, 10, 0, width),  // Entropy on x-axis
      y: mapValue(point.h, 0, 4000, height, 0) // Enthalpy on y-axis (inverted)
    }));

    if (canvasPoints.length > 1) {
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
        ctx.fillStyle = '#34D399';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#F3F4F6';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${index + 1}`, point.x - 5, point.y - 10);
      });
    }
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

export default HSDiagram;