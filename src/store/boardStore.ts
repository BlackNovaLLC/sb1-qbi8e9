import { create } from 'zustand';
import { Column, Card } from '../types';
import { initialCards } from './initialData';
import { useNotificationStore } from './notificationStore';
import { teamMembers } from './teamStore';
import { subtaskTemplates } from './subtaskTemplates';
import { generateId } from '../utils/generateId';

interface BoardState {
  columns: Column[];
  moveCard: (cardId: string, source: string, destination: string) => void;
  addCard: (columnId: string, card: Card) => void;
  updateCard: (columnId: string, card: Card) => void;
  toggleSubtask: (columnId: string, cardId: string, subtaskId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [
    {
      id: 'script-testing',
      title: 'Script Testing',
      phase: 1,
      cards: initialCards['script-testing'] || [],
    },
    {
      id: 'hook-testing',
      title: 'Hook Testing',
      phase: 2,
      cards: initialCards['hook-testing'] || [],
    },
    {
      id: 'opening-scene',
      title: 'Opening Scene Testing',
      phase: 3,
      cards: initialCards['opening-scene'] || [],
    },
    {
      id: 'scaling',
      title: 'Scaling & Optimization',
      phase: 4,
      cards: initialCards['scaling'] || [],
    },
  ],

  moveCard: (cardId, source, destination) =>
    set((state) => {
      const newColumns = [...state.columns];
      const sourceColumn = newColumns.find((col) => col.id === source);
      const destColumn = newColumns.find((col) => col.id === destination);
      
      if (!sourceColumn || !destColumn) return state;

      const cardIndex = sourceColumn.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return state;

      const [card] = sourceColumn.cards.splice(cardIndex, 1);
      
      const updatedCard = {
        ...card,
        phase: {
          current: destColumn.phase,
          startedAt: new Date().toISOString()
        },
        subtasks: subtaskTemplates[destination as keyof typeof subtaskTemplates]?.map(template => ({
          id: generateId(),
          title: template.title,
          completed: false,
          assignedTo: template.assignedTo,
          nextAssignee: template.nextAssignee
        })) || []
      };
      
      destColumn.cards.push(updatedCard);

      const addNotification = useNotificationStore.getState().addNotification;
      updatedCard.assignedTo.forEach((member) => {
        addNotification({
          type: 'CARD_MOVED',
          message: `Card ${updatedCard.id} moved to ${destColumn.title}`,
          cardId: updatedCard.id,
          forUser: member.id,
        });
      });

      return { columns: newColumns };
    }),

  addCard: (columnId, card) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, card],
          };
        }
        return col;
      });
      return { columns: newColumns };
    }),

  updateCard: (columnId, updatedCard) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.map((card) =>
              card.id === updatedCard.id ? updatedCard : card
            ),
          };
        }
        return col;
      });
      return { columns: newColumns };
    }),

  toggleSubtask: (columnId, cardId, subtaskId) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.map((card) => {
              if (card.id === cardId) {
                const updatedSubtasks = card.subtasks.map((subtask) => {
                  if (subtask.id === subtaskId) {
                    const completed = !subtask.completed;
                    
                    if (completed && subtask.nextAssignee) {
                      const addNotification = useNotificationStore.getState().addNotification;
                      addNotification({
                        type: 'SUBTASK_COMPLETED',
                        message: `${subtask.assignedTo.name} completed "${subtask.title}"`,
                        cardId: card.id,
                        forUser: subtask.nextAssignee.id,
                      });
                    }

                    return { ...subtask, completed };
                  }
                  return subtask;
                });

                return { ...card, subtasks: updatedSubtasks };
              }
              return card;
            }),
          };
        }
        return col;
      });
      return { columns: newColumns };
    }),
}));