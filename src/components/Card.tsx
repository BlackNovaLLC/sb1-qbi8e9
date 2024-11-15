import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card as CardType } from '../types';
import { format } from 'date-fns';
import { useModalStore } from '../store/modalStore';
import { getTagColor } from '../store/tagsStore';

interface CardProps {
  card: CardType;
  index: number;
  columnId: string;
}

export const Card: React.FC<CardProps> = ({ card, index, columnId }) => {
  const completedSubtasks = card.subtasks.filter((t) => t.completed).length;
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(card, columnId);
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={`bg-white p-4 rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow cursor-pointer ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {card.id}
            </span>
            {card.variantId && (
              <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                Variant {card.variantId}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {card.tags?.map((tag) => (
              tag && (
                <span
                  key={tag.id}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag.color)}`}
                >
                  {tag.label}
                </span>
              )
            ))}
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{card.description}</p>

          <div className="flex -space-x-2 mb-3">
            {card.assignedTo.map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={`${member.name} - ${member.role}`}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {completedSubtasks} of {card.subtasks.length} subtasks
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Phase {card.phase.current}
              </span>
              <span>{format(new Date(card.createdAt), 'MMM d')}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};