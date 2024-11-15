import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card } from './Card';
import { Column as ColumnType } from '../types';
import { PhaseReport } from './PhaseReport';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { teamMembers } from '../store/teamStore';
import { useBoardStore } from '../store/boardStore';

interface ColumnProps {
  column: ColumnType;
}

export const Column: React.FC<ColumnProps> = ({ column }) => {
  const [showReport, setShowReport] = useState(false);
  const columns = useBoardStore((state) => state.columns);
  
  // Find cards that moved to the next phase
  const nextPhaseColumn = columns.find(col => col.phase === column.phase + 1);
  const nextPhaseCards = nextPhaseColumn?.cards.filter(card => 
    card.phase.current === column.phase + 1
  ) || [];

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  return (
    <>
      <div className="bg-gray-100 p-4 rounded-lg min-w-[300px] flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700 flex items-center">
              {column.title}
              <span className="ml-2 bg-gray-200 px-2 py-1 rounded text-sm">
                {column.cards.length}
              </span>
            </h2>
            <button
              onClick={handleGenerateReport}
              className="p-1 hover:bg-gray-200 rounded"
              title="Generate Phase Report"
            >
              <ChartBarIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Phase {column.phase}</p>
        </div>
        
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 min-h-[200px] transition-colors rounded-lg ${
                snapshot.isDraggingOver ? 'bg-gray-200' : ''
              }`}
            >
              <div className="h-full">
                {column.cards.map((card, index) => (
                  <Card 
                    key={card.id} 
                    card={card} 
                    index={index} 
                    columnId={column.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>

      {showReport && (
        <PhaseReport
          column={column}
          nextPhaseCards={nextPhaseCards}
          teamMembers={teamMembers}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
};