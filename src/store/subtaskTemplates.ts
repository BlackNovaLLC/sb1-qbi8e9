import { teamMembers } from './teamStore';

const scriptwriter = teamMembers.find(m => m.role === 'Scriptwriter')!;
const editor = teamMembers.find(m => m.role === 'Video Editor')!;
const analyst = teamMembers.find(m => m.role === 'Marketing Analyst')!;
const director = teamMembers.find(m => m.role === 'Creative Director')!;

export const subtaskTemplates = {
  'script-testing': [
    {
      title: 'Write Script',
      assignedTo: scriptwriter,
      nextAssignee: editor
    },
    {
      title: 'Create Video Variant',
      assignedTo: editor,
      nextAssignee: analyst
    },
    {
      title: 'Submit for Media Test',
      assignedTo: analyst,
      nextAssignee: director
    }
  ],
  'hook-testing': [
    {
      title: 'Generate Hook Variants',
      assignedTo: scriptwriter,
      nextAssignee: editor
    },
    {
      title: 'Edit Video',
      assignedTo: editor,
      nextAssignee: analyst
    },
    {
      title: 'Submit for Media Test',
      assignedTo: analyst,
      nextAssignee: director
    }
  ],
  'opening-scene': [
    {
      title: 'Create Opening Scene Variants',
      assignedTo: editor,
      nextAssignee: director
    },
    {
      title: 'Edit Video',
      assignedTo: editor,
      nextAssignee: analyst
    },
    {
      title: 'Submit for Media Test',
      assignedTo: analyst,
      nextAssignee: director
    }
  ],
  'scaling': [
    {
      title: 'Scale Winning Ad',
      assignedTo: analyst,
      nextAssignee: director
    },
    {
      title: 'Optimize',
      assignedTo: analyst,
      nextAssignee: director
    },
    {
      title: 'Archive',
      assignedTo: director,
      nextAssignee: undefined
    }
  ]
};