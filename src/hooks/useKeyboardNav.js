import { useEffect, useCallback } from 'react';

/**
 * useKeyboardNav - Adds keyboard navigation to quiz components
 * 
 * Keys:
 * - 1, 2, 3, 4: Select answer option
 * - Enter/Space: Submit/Continue
 * - Escape: Exit/Cancel
 * - H: Toggle hint
 * 
 * @param {Object} options
 * @param {Function} options.onSelect - Called when option selected (index)
 * @param {Function} options.onSubmit - Called when Enter pressed
 * @param {Function} options.onExit - Called when Escape pressed
 * @param {Function} options.onHint - Called when H pressed
 * @param {boolean} options.enabled - Whether to listen for keys
 * @param {number} options.optionCount - Number of options (1-4 keys)
 */
const useKeyboardNav = ({
  onSelect,
  onSubmit,
  onExit,
  onHint,
  enabled = true,
  optionCount = 4
} = {}) => {
  
  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;
    
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    
    // Number keys for option selection
    if (['1', '2', '3', '4'].includes(key)) {
      const index = parseInt(key) - 1;
      if (index < optionCount && onSelect) {
        e.preventDefault();
        onSelect(index);
      }
      return;
    }
    
    // A, B, C, D keys for option selection
    if (['a', 'b', 'c', 'd'].includes(key)) {
      const index = key.charCodeAt(0) - 97; // a=0, b=1, etc.
      if (index < optionCount && onSelect) {
        e.preventDefault();
        onSelect(index);
      }
      return;
    }
    
    // Enter or Space to submit
    if (key === 'enter' || key === ' ') {
      if (onSubmit) {
        e.preventDefault();
        onSubmit();
      }
      return;
    }
    
    // Escape to exit
    if (key === 'escape') {
      if (onExit) {
        e.preventDefault();
        onExit();
      }
      return;
    }
    
    // H for hint
    if (key === 'h') {
      if (onHint) {
        e.preventDefault();
        onHint();
      }
      return;
    }
    
    // Arrow keys for navigation
    if (key === 'arrowup' || key === 'arrowleft') {
      if (onSelect) {
        e.preventDefault();
        // Could implement cycling through options
      }
      return;
    }
    
    if (key === 'arrowdown' || key === 'arrowright') {
      if (onSelect) {
        e.preventDefault();
        // Could implement cycling through options
      }
      return;
    }
  }, [enabled, optionCount, onSelect, onSubmit, onExit, onHint]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
  
  return {
    // Expose for manual trigger
    handleKeyDown
  };
};

export default useKeyboardNav;
