import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Plus, 
  Save, 
  Trash2,
  Zap,
  Flame,
  Wind
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  CyclePreset, 
  loadPresets, 
  saveCustomPreset, 
  deleteCustomPreset,
  getPresetsByCategory,
  findPresetById
} from '@/utils/presets';
import { useThermoStore } from '@/store/thermoStore';

interface PresetSelectorProps {
  onPresetLoad?: (preset: CyclePreset) => void;
}

export function PresetSelector({ onPresetLoad }: PresetSelectorProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  
  const {
    cycleType,
    fluid,
    parameters
  } = useThermoStore();

  const handleLoadPreset = (preset: CyclePreset) => {
    const store = useThermoStore.getState();
    store.setCycleType(preset.cycleType);
    store.setFluid(preset.fluid);
    store.setParameters(preset.parameters);
    
    onPresetLoad?.(preset);
    setIsOpen(false);
    
    toast({
      title: "Preset Loaded",
      description: `${preset.name} configuration applied successfully`,
    });
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your preset",
        variant: "destructive"
      });
      return;
    }

    try {
      const newPreset = saveCustomPreset(
        presetName.trim(),
        presetDescription.trim() || 'Custom user configuration',
        {
          cycleType,
          fluid,
          parameters,
          category: 'custom'
        }
      );

      setPresetName('');
      setPresetDescription('');
      setSaveDialogOpen(false);
      
      toast({
        title: "Preset Saved",
        description: `${newPreset.name} has been saved to your library`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preset",
        variant: "destructive"
      });
    }
  };

  const handleDeletePreset = (presetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      deleteCustomPreset(presetId);
      toast({
        title: "Preset Deleted",
        description: "Custom preset removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete preset",
        variant: "destructive"
      });
    }
  };

  const getPresetIcon = (preset: CyclePreset) => {
    switch (preset.cycleType) {
      case 'otto': return <Zap className="w-4 h-4" />;
      case 'diesel': return <Flame className="w-4 h-4" />;
      case 'brayton': return <Wind className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: CyclePreset['category']) => {
    switch (category) {
      case 'standard': return 'Standard Configurations';
      case 'high-performance': return 'High Performance';
      case 'efficient': return 'Fuel Efficient';
      case 'custom': return 'My Presets';
      default: return category;
    }
  };

  const renderPresetItems = (presets: CyclePreset[], category: CyclePreset['category']) => {
    if (presets.length === 0) return null;

    return (
      <>
        <DropdownMenuLabel>{getCategoryLabel(category)}</DropdownMenuLabel>
        {presets.map((preset) => (
          <DropdownMenuItem 
            key={preset.id}
            onClick={() => handleLoadPreset(preset)}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              {getPresetIcon(preset)}
              <div>
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground">{preset.description}</div>
              </div>
            </div>
            {preset.category === 'custom' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => handleDeletePreset(preset.id, e)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </DropdownMenuItem>
        ))}
      </>
    );
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Presets
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-80">
          {renderPresetItems(getPresetsByCategory('standard'), 'standard')}
          <DropdownMenuSeparator />
          {renderPresetItems(getPresetsByCategory('high-performance'), 'high-performance')}
          <DropdownMenuSeparator />
          {renderPresetItems(getPresetsByCategory('efficient'), 'efficient')}
          <DropdownMenuSeparator />
          {renderPresetItems(getPresetsByCategory('custom'), 'custom')}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </DialogTrigger>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Configuration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Enter a name for this configuration"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preset-description">Description</Label>
              <Textarea
                id="preset-description"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="Describe this configuration (optional)"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePreset} className="gap-2">
                <Save className="w-4 h-4" />
                Save Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}