import React from 'react';
import { Tag } from '../types';
import { tags } from '../store/tagsStore';

interface FilterBarProps {
  onFilterChange: (selectedTags: Tag[]) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const handleTagClick = (tag: Tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onFilterChange(newSelectedTags);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-sm">
      {tags.all.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTags.includes(tag)
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
};