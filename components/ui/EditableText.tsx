
import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface EditableTextProps {
  value: string;
  onSave?: (newValue: string) => void;
  className?: string;
  isTextarea?: boolean;
  placeholder?: string;
  storageKey?: string; // New prop for auto-persistence
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  className, 
  storageKey
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  // Load from storage on mount if key exists to maintain previously saved edits
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCurrentValue(saved);
      } else {
        setCurrentValue(value);
      }
    } else {
        setCurrentValue(value);
    }
  }, [storageKey, value]);

  // Render strictly as a span, no interactions, no editing state.
  return (
    <span className={cn(className)}>
      {currentValue}
    </span>
  );
};

export default EditableText;
