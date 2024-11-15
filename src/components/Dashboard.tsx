import React, { useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { TagFilter } from './TagFilter';
import { Tag } from '../types';
import { teamMembers } from '../store/teamStore';

export const Dashboard: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const columns = useBoardStore((state) => state.columns);

  // Calculate phase statistics
  const phaseStats = columns.map(column => ({
    id: column.id,
    title: column.title,
    phase: column.phase,
    count: column.cards.length,
    completedCount: column.cards.filter(card => 
      card.subtasks.every(subtask => subtask.completed)
    ).length,
    inProgressCount: column.cards.filter(card =>
      card.subtasks.some(subtask => subtask.completed) &&
      !card.subtasks.every(subtask => subtask.completed)
    ).length
  }));

  // Filter cards based on selected tags
  const filteredColumns = columns.map(column => ({
    ...column,
    cards: column.cards.filter(card =>
      selectedTags.length === 0 ||
      selectedTags.every(tag =>
        card.tags.some(cardTag => cardTag.id === tag.id)
      )
    )
  }));

  // Calculate total metrics
  const totalCards = columns.reduce((sum, column) => sum + column.cards.length, 0);
  const completedCards = columns.reduce(
    (sum, column) => sum + column.cards.filter(card =>
      card.subtasks.every(subtask => subtask.completed)
    ).length,
    0
  );

  const handleTagFilter = (tags: Tag[]) => {
    setSelectedTags(tags);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Creative Testing Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCards} Total Cards • {completedCards} Completed
          </p>
        </div>

        {/* Filters */}
        <TagFilter onFilterChange={handleTagFilter} />

        {/* Phase Statistics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {phaseStats.map(stat => (
            <div
              key={stat.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {stat.title}
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-500">Total Cards</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-green-600">{stat.completedCount} Complete</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-blue-600">{stat.inProgressCount} In Progress</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtered Cards View */}
        <div className="grid grid-cols-4 gap-6">
          {filteredColumns.map(column => (
            <div key={column.id} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="font-medium text-gray-900">
                  {column.title}
                  <span className="ml-2 text-sm text-gray-500">
                    ({column.cards.length})
                  </span>
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {column.cards.map(card => (
                  <div
                    key={card.id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                        {card.id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        card.status === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                        card.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {card.status}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{card.title}</h4>
                    <div className="flex -space-x-2">
                      {card.assignedTo.map(member => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          title={member.name}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {card.subtasks.filter(st => st.completed).length} of {card.subtasks.length} tasks complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};