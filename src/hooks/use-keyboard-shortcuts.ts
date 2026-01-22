import { useEffect, useCallback } from 'react';
import { useThermoStore } from '@/store/thermoStore';

interface UseKeyboardShortcutsProps {
  onToggleEducationalMode?: () => void;
  onSaveConfiguration?: () => void;
}

export function useKeyboardShortcuts({
  onToggleEducationalMode,
  onSaveConfiguration
}: UseKeyboardShortcutsProps = {}) {
  const {
    cycleType,
    fluid,
    parameters,
    setCycleType,
    setFluid,
    setParameter
  } = useThermoStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target instanceof HTMLElement && event.target.isContentEditable)
    ) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

    // Ctrl/Cmd + S - Save configuration
    if (ctrlKey && event.key === 's') {
      event.preventDefault();
      onSaveConfiguration?.();
      return;
    }

    // Ctrl/Cmd + Z - Reset to default parameters
    if (ctrlKey && event.key === 'z') {
      event.preventDefault();
      // Reset parameters to defaults
      setParameter('T1', 300);
      setParameter('P1', 100);
      setParameter('compressionRatio', 8);
      setParameter('heatAddition', 1000);
      setParameter('pressureRatio', 10);
      setParameter('T3', 1200);
      setParameter('cutoffRatio', 2);
      return;
    }

    // Space - Toggle educational mode
    if (event.key === ' ' && onToggleEducationalMode) {
      event.preventDefault();
      onToggleEducationalMode();
      return;
    }

    // Arrow keys for fine-tuning (when focused on parameter controls)
    // This would require more specific element targeting
    
  }, [onSaveConfiguration, onToggleEducationalMode, setParameter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { handleKeyDown };
}

// Hook for slider keyboard navigation
export function useSliderKeyboardNavigation(
  currentValue: number,
  minValue: number,
  maxValue: number,
  step: number,
  onChange: (value: number) => void
) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      const newValue = Math.min(maxValue, currentValue + step);
      onChange(newValue);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const newValue = Math.max(minValue, currentValue - step);
      onChange(newValue);
    }
  }, [currentValue, minValue, maxValue, step, onChange]);

  return { handleKeyDown };
}