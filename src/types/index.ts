export type Status = 'IN_PROGRESS' | 'TESTING' | 'COMPLETE' | 'WINNING' | 'NEEDS_IMPROVEMENT';

export interface Column {
  id: string;
  title: string;
  phase: number;
  cards: Card[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Metrics {
  views: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  epc: number;
  cost: number;
  roas: number;
  updatedAt: string;
  updatedBy: TeamMember;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo: TeamMember;
  nextAssignee?: TeamMember;
}

export interface Tag {
  id: string;
  label: string;
  color: string;
  category: TagCategory;
}

export type TagCategory = 'phase' | 'variant' | 'role' | 'status';

export interface Card {
  id: string;
  title: string;
  description: string;
  status: Status;
  tags: Tag[];
  phase: {
    current: number;
    startedAt: string;
  };
  metrics?: Metrics;
  subtasks: Subtask[];
  assignedTo: TeamMember[];
  createdAt: string;
  variantId?: string;
  campaignName?: string;
}