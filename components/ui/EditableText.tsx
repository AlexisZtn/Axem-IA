import React, { useState, useEffect, useRef } from 'react';
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
  onSave, 
  className, 
  isTextarea = false,
  placeholder = "Cliquez pour éditer...",
  storageKey
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Load from storage on mount if key exists
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    
    // Save to local storage if key is present
    if (storageKey) {
        localStorage.setItem(storageKey, currentValue);
    }

    // Call external handler if present
    if (onSave) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextarea) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      // Revert to last valid state
      if (storageKey) {
          const saved = localStorage.getItem(storageKey);
          setCurrentValue(saved || value);
      } else {
          setCurrentValue(value);
      }
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (isTextarea) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("bg-neutral-900/90 border border-[#00FA9A] outline-none p-2 rounded w-full min-h-[100px] text-white z-50 relative shadow-xl", className)}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("bg-neutral-900/90 border-b border-[#00FA9A] outline-none w-auto text-white min-w-[50px] z-50 relative shadow-xl px-1", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
      }}
      className={cn("cursor-text hover:bg-[#00FA9A]/10 rounded px-1 -mx-1 transition-all border border-transparent hover:border-[#00FA9A]/20 hover:shadow-[0_0_15px_rgba(0,250,154,0.1)]", className)}
      title="Cliquez pour éditer ce texte"
    >
      {currentValue || <span className="text-white/30 italic">{placeholder}</span>}
    </span>
  );
};

export default EditableText;