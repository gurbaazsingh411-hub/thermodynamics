import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { ThermodynamicCycle } from '@/types/thermodynamics';

// Export diagram as PNG
export async function exportDiagramAsPNG(elementId: string, filename: string = 'diagram.png'): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      logging: false
    });

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting diagram as PNG:', error);
    throw error;
  }
}

// Export diagram as SVG (if SVG is available)
export async function exportDiagramAsSVG(svgElement: SVGSVGElement, filename: string = 'diagram.svg'): Promise<void> {
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting diagram as SVG:', error);
    throw error;
  }
}

// Export data as CSV
export function exportDataAsCSV(data: any[], filename: string = 'data.csv'): void {
  try {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Create CSV header
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting data as CSV:', error);
    throw error;
  }
}

// Export cycle data as detailed CSV
export function exportCycleDataAsCSV(cycle: ThermodynamicCycle, filename: string = 'cycle-data.csv'): void {
  try {
    // State data
    const stateData = cycle.states.map((state, index) => ({
      'State': index + 1,
      'Name': state.name,
      'Temperature (K)': state.temperature.toFixed(2),
      'Pressure (kPa)': state.pressure.toFixed(2),
      'Volume (m³/kg)': state.volume.toExponential(4),
      'Enthalpy (kJ/kg)': state.enthalpy.toFixed(2),
      'Entropy (kJ/kg·K)': state.entropy.toFixed(4),
      'Internal Energy (kJ/kg)': state.internalEnergy.toFixed(2)
    }));

    // Performance metrics
    const metricsData = [{
      'Metric': 'Thermal Efficiency',
      'Value': `${cycle.efficiency.toFixed(2)}%`,
      'Unit': '%'
    }, {
      'Metric': 'Net Work',
      'Value': cycle.netWork.toFixed(2),
      'Unit': 'kJ/kg'
    }, {
      'Metric': 'Heat Input',
      'Value': cycle.heatIn.toFixed(2),
      'Unit': 'kJ/kg'
    }, {
      'Metric': 'Heat Output',
      'Value': cycle.heatOut.toFixed(2),
      'Unit': 'kJ/kg'
    }];

    // Combine all data with section headers
    const csvSections = [
      ['CYCLE INFORMATION'],
      [`Cycle Type,${cycle.name}`],
      [`Cycle ID,${cycle.id}`],
      [''],
      ['STATE POINTS'],
      ...stateData.map(row => Object.values(row)),
      [''],
      ['PERFORMANCE METRICS'],
      ...metricsData.map(row => Object.values(row))
    ];

    const csvContent = csvSections.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting cycle data as CSV:', error);
    throw error;
  }
}

// Generate comprehensive PDF report
export async function generatePDFReport(
  cycle: ThermodynamicCycle,
  pvDiagramId: string,
  tsDiagramId: string,
  filename: string = 'thermodynamic-report.pdf'
): Promise<void> {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Title
    doc.setFontSize(20);
    doc.text('Thermodynamic Cycle Analysis Report', 105, 20, { align: 'center' });
    
    // Cycle information
    doc.setFontSize(12);
    doc.text(`Cycle Type: ${cycle.name}`, 20, 35);
    doc.text(`Working Fluid: Air`, 20, 42);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 49);

    // Performance metrics table
    doc.setFontSize(14);
    doc.text('Performance Metrics', 20, 65);
    
    doc.setFontSize(10);
    const metrics = [
      ['Metric', 'Value', 'Unit'],
      ['Thermal Efficiency', `${cycle.efficiency.toFixed(2)}`, '%'],
      ['Net Work', cycle.netWork.toFixed(2), 'kJ/kg'],
      ['Heat Input', cycle.heatIn.toFixed(2), 'kJ/kg'],
      ['Heat Output', cycle.heatOut.toFixed(2), 'kJ/kg']
    ];

    (doc as any).autoTable({
      head: [metrics[0]],
      body: metrics.slice(1),
      startY: 70,
      theme: 'grid'
    });

    // State points table
    doc.addPage();
    doc.setFontSize(14);
    doc.text('State Points', 20, 20);
    
    doc.setFontSize(10);
    const stateHeaders = ['State', 'T (K)', 'P (kPa)', 'V (m³/kg)', 'H (kJ/kg)', 'S (kJ/kg·K)', 'U (kJ/kg)'];
    const stateData = cycle.states.map((state, index) => [
      index + 1,
      state.temperature.toFixed(1),
      state.pressure.toFixed(1),
      state.volume.toExponential(3),
      state.enthalpy.toFixed(1),
      state.entropy.toFixed(4),
      state.internalEnergy.toFixed(1)
    ]);

    (doc as any).autoTable({
      head: [stateHeaders],
      body: stateData,
      startY: 25,
      theme: 'grid'
    });

    // Export PDF
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
}

// Generate summary text for copying
export function generateCycleSummary(cycle: ThermodynamicCycle): string {
  return `
Thermodynamic Cycle: ${cycle.name}
Efficiency: ${cycle.efficiency.toFixed(2)}%
Net Work: ${cycle.netWork.toFixed(2)} kJ/kg
Heat Input: ${cycle.heatIn.toFixed(2)} kJ/kg
Heat Output: ${cycle.heatOut.toFixed(2)} kJ/kg

State Points:
${cycle.states.map((state, index) => 
  `${index + 1}. T=${state.temperature.toFixed(1)}K, P=${state.pressure.toFixed(1)}kPa, V=${state.volume.toExponential(3)}m³/kg`
).join('\n')}
  `.trim();
}