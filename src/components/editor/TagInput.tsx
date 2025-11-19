'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ value, onChange, maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Tags (up to {maxTags})
      </label>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
        {value.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(index)}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {value.length < maxTags && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder="Add a tag..."
            className="flex-1 min-w-[120px] outline-none text-sm"
          />
        )}
      </div>
      <p className="text-xs text-gray-500">
        Press Enter or comma to add tags
      </p>
    </div>
  );
}