import { Tag, TagCategory } from '../types';

const createTag = (
  id: string,
  label: string,
  color: string,
  category: TagCategory
): Tag => ({
  id,
  label,
  color,
  category,
});

// Phase tags
const phaseTags: Tag[] = [
  createTag('phase-1', 'Phase 1 - Script Testing', 'blue', 'phase'),
  createTag('phase-2', 'Phase 2 - Hook Testing', 'indigo', 'phase'),
  createTag('phase-3', 'Phase 3 - Opening Scene', 'purple', 'phase'),
  createTag('phase-4', 'Phase 4 - Scaling', 'pink', 'phase'),
];

// Role tags
const roleTags: Tag[] = [
  createTag('role-scriptwriter', 'Scriptwriter', 'green', 'role'),
  createTag('role-editor', 'Video Editor', 'yellow', 'role'),
  createTag('role-analyst', 'Marketing Analyst', 'orange', 'role'),
  createTag('role-director', 'Creative Director', 'red', 'role'),
];

// Status tags
const statusTags: Tag[] = [
  createTag('status-progress', 'In Progress', 'yellow', 'status'),
  createTag('status-testing', 'Testing', 'blue', 'status'),
  createTag('status-complete', 'Complete', 'green', 'status'),
];

// Helper function to generate variant tags
export const generateVariantTag = (baseId: string, variantNumber: number): Tag => {
  return createTag(
    `variant-${baseId}-${variantNumber}`,
    `Variant ${variantNumber}`,
    'cyan',
    'variant'
  );
};

export const tags = {
  phase: phaseTags,
  role: roleTags,
  status: statusTags,
  all: [...phaseTags, ...roleTags, ...statusTags],
};

export const getTagsByCategory = (category: TagCategory) => {
  return tags[category] || [];
};

export const getTagColor = (color: string): string => {
  const colors: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    cyan: 'bg-cyan-100 text-cyan-800',
  };
  return colors[color] || colors.blue;
};