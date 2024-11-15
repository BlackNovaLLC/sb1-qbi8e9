import { Card } from '../types';
import { tags, generateVariantTag } from './tagsStore';
import { teamMembers } from './teamStore';
import { generateId } from '../utils/generateId';
import { subtaskTemplates } from './subtaskTemplates';

// Helper function to create subtasks from templates
const createSubtasks = (phase: string) => {
  return subtaskTemplates[phase as keyof typeof subtaskTemplates].map((template, index) => ({
    id: `st-${generateId()}`,
    title: template.title,
    completed: false,
    assignedTo: template.assignedTo,
    nextAssignee: template.nextAssignee
  }));
};

export const initialCards: { [key: string]: Card[] } = {
  'script-testing': [
    {
      id: generateId(),
      title: 'Product Demo Script',
      description: 'Create and test main product demonstration script variations',
      status: 'IN_PROGRESS',
      tags: [
        tags.phase[0],
        tags.role[0],
        tags.status[0],
        generateVariantTag('PDS', 1)
      ],
      phase: { current: 1, startedAt: new Date().toISOString() },
      metrics: { views: 1200, engagement: 65, conversion: 12 },
      subtasks: createSubtasks('script-testing'),
      assignedTo: [teamMembers[0], teamMembers[1]],
      createdAt: new Date().toISOString(),
      variantId: 'PDS-1'
    },
    {
      id: generateId(),
      title: 'Feature Highlight Script',
      description: 'Develop script focusing on key product features',
      status: 'IN_PROGRESS',
      tags: [
        tags.phase[0],
        tags.role[0],
        tags.status[0],
        generateVariantTag('FHS', 1)
      ],
      phase: { current: 1, startedAt: new Date().toISOString() },
      metrics: { views: 800, engagement: 58, conversion: 9 },
      subtasks: createSubtasks('script-testing'),
      assignedTo: [teamMembers[0], teamMembers[2]],
      createdAt: new Date().toISOString(),
      variantId: 'FHS-1'
    }
  ],
  'hook-testing': [
    {
      id: generateId(),
      title: 'Problem-Solution Hook',
      description: 'Test different opening hooks highlighting customer pain points',
      status: 'TESTING',
      tags: [
        tags.phase[1],
        tags.role[1],
        tags.status[1],
        generateVariantTag('PSH', 1)
      ],
      phase: { current: 2, startedAt: new Date().toISOString() },
      metrics: { views: 800, engagement: 72, conversion: 8 },
      subtasks: createSubtasks('hook-testing'),
      assignedTo: [teamMembers[2], teamMembers[3]],
      createdAt: new Date().toISOString(),
      variantId: 'PSH-1'
    },
    {
      id: generateId(),
      title: 'Benefit-First Hook',
      description: 'Test hooks emphasizing immediate product benefits',
      status: 'IN_PROGRESS',
      tags: [
        tags.phase[1],
        tags.role[1],
        tags.status[0],
        generateVariantTag('BFH', 1)
      ],
      phase: { current: 2, startedAt: new Date().toISOString() },
      metrics: { views: 950, engagement: 68, conversion: 10 },
      subtasks: createSubtasks('hook-testing'),
      assignedTo: [teamMembers[0], teamMembers[2]],
      createdAt: new Date().toISOString(),
      variantId: 'BFH-1'
    }
  ],
  'opening-scene': [
    {
      id: generateId(),
      title: 'Lifestyle Opening Scene',
      description: 'Test lifestyle-focused opening scene variations',
      status: 'TESTING',
      tags: [
        tags.phase[2],
        tags.role[1],
        tags.status[1],
        generateVariantTag('LOS', 1)
      ],
      phase: { current: 3, startedAt: new Date().toISOString() },
      metrics: { views: 950, engagement: 68, conversion: 15 },
      subtasks: createSubtasks('opening-scene'),
      assignedTo: [teamMembers[1], teamMembers[2]],
      createdAt: new Date().toISOString(),
      variantId: 'LOS-1'
    },
    {
      id: generateId(),
      title: 'Product-First Opening',
      description: 'Test product-centric opening scenes',
      status: 'IN_PROGRESS',
      tags: [
        tags.phase[2],
        tags.role[1],
        tags.status[0],
        generateVariantTag('PFO', 1)
      ],
      phase: { current: 3, startedAt: new Date().toISOString() },
      metrics: { views: 1100, engagement: 75, conversion: 18 },
      subtasks: createSubtasks('opening-scene'),
      assignedTo: [teamMembers[2], teamMembers[3]],
      createdAt: new Date().toISOString(),
      variantId: 'PFO-1'
    }
  ],
  'scaling': [
    {
      id: generateId(),
      title: 'Top Performing Ad Scale',
      description: 'Scale the best performing ad variation',
      status: 'IN_PROGRESS',
      tags: [
        tags.phase[3],
        tags.role[2],
        tags.status[0]
      ],
      phase: { current: 4, startedAt: new Date().toISOString() },
      metrics: { views: 2500, engagement: 82, conversion: 22 },
      subtasks: createSubtasks('scaling'),
      assignedTo: [teamMembers[1], teamMembers[3]],
      createdAt: new Date().toISOString()
    }
  ]
};