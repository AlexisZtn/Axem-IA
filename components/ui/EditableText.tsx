import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  isTextarea?: boolean;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  className, 
  isTextarea = false,
  placeholder = "Click to edit..."
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue.trim() !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextarea) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
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
          className={cn("bg-transparent border border-[#00FA9A]/50 outline-none p-1 rounded w-full min-h-[100px] text-white", className)}
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
        className={cn("bg-transparent border-b border-[#00FA9A]/50 outline-none w-full text-white min-w-[50px]", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span 
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={cn("cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors border border-transparent hover:border-white/5", className)}
      title="Click to edit"
    >
      {currentValue || <span className="text-white/30 italic">{placeholder}</span>}
    </span>
  );
};

export default EditableText;