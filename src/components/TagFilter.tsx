import React, { useState } from 'react';
import { Tag } from '../types';
import { TagSelector } from './TagSelector';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface TagFilterProps {
  onFilterChange: (tags: Tag[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagSelect = (tag: Tag) => {
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange(newTags);
  };

  const handleTagRemove = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId);
    setSelectedTags(newTags);
    onFilterChange(newTags);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    onFilterChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div 
        className="p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Filter Cards</h2>
            {selectedTags.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full">
                {selectedTags.length} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedTags.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      <div 
        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t">
          <TagSelector
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
          />
        </div>
      </div>
    </div>
  );
};