import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Copy, FileText, Image, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  exportDiagramAsPNG, 
  exportDataAsCSV, 
  exportCycleDataAsCSV, 
  generatePDFReport,
  copyToClipboard,
  generateCycleSummary
} from '@/utils/export-utils';
import { ThermodynamicCycle } from '@/types/thermodynamics';

interface ExportButtonsProps {
  cycle: ThermodynamicCycle;
  pvDiagramId?: string;
  tsDiagramId?: string;
}

export function ExportButtons({ cycle, pvDiagramId = 'pv-diagram', tsDiagramId = 'ts-diagram' }: ExportButtonsProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (exportType: string) => {
    setIsExporting(true);
    try {
      switch (exportType) {
        case 'png-pv':
          await exportDiagramAsPNG(pvDiagramId, `pv-diagram-${Date.now()}.png`);
          toast({
            title: "Success",
            description: "P-V diagram exported as PNG",
          });
          break;
          
        case 'png-ts':
          await exportDiagramAsPNG(tsDiagramId, `ts-diagram-${Date.now()}.png`);
          toast({
            title: "Success",
            description: "T-S diagram exported as PNG",
          });
          break;
          
        case 'csv-states':
          exportDataAsCSV(
            cycle.states.map((state, index) => ({
              State: index + 1,
              Name: state.name,
              Temperature_K: state.temperature.toFixed(2),
              Pressure_kPa: state.pressure.toFixed(2),
              Volume_m3_per_kg: state.volume.toExponential(4),
              Enthalpy_kJ_per_kg: state.enthalpy.toFixed(2),
              Entropy_kJ_per_kg_K: state.entropy.toFixed(4),
              InternalEnergy_kJ_per_kg: state.internalEnergy.toFixed(2)
            })),
            `state-points-${Date.now()}.csv`
          );
          toast({
            title: "Success",
            description: "State points exported as CSV",
          });
          break;
          
        case 'csv-cycle':
          exportCycleDataAsCSV(cycle, `cycle-data-${Date.now()}.csv`);
          toast({
            title: "Success",
            description: "Complete cycle data exported as CSV",
          });
          break;
          
        case 'pdf':
          await generatePDFReport(cycle, pvDiagramId, tsDiagramId, `thermodynamic-report-${Date.now()}.pdf`);
          toast({
            title: "Success",
            description: "PDF report generated",
          });
          break;
          
        case 'copy-summary':
          const summary = generateCycleSummary(cycle);
          await copyToClipboard(summary);
          toast({
            title: "Copied",
            description: "Cycle summary copied to clipboard",
          });
          break;
          
        default:
          throw new Error('Unknown export type');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Error",
        description: `Failed to export: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
          {isExporting && <div className="ml-2 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleExport('png-pv')}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Export P-V Diagram (PNG)
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('png-ts')}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Export T-S Diagram (PNG)
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('csv-states')}
          className="gap-2"
        >
          <Table className="w-4 h-4" />
          Export State Points (CSV)
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('csv-cycle')}
          className="gap-2"
        >
          <Table className="w-4 h-4" />
          Export Full Data (CSV)
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Generate PDF Report
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('copy-summary')}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Summary to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}