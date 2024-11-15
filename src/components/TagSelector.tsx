import React from 'react';
import { Tag, TagCategory } from '../types';
import { getTagsByCategory, getTagColor } from '../store/tagsStore';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
  categories?: TagCategory[];
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagSelect,
  onTagRemove,
  categories = ['phase', 'role', 'variant', 'status'],
}) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 capitalize">
            {category} Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {getTagsByCategory(category).map((tag) => {
              const isSelected = selectedTags.some((t) => t.id === tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => isSelected ? onTagRemove(tag.id) : onTagSelect(tag)}
                  className={`${
                    getTagColor(tag.color)
                  } px-3 py-1 rounded-full text-sm font-medium ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};