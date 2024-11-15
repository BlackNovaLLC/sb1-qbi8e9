import React, { useCallback, useState } from 'react';
import { useModalStore } from '../store/modalStore';
import { useBoardStore } from '../store/boardStore';
import { format } from 'date-fns';
import { Status, FileAttachment, Metrics } from '../types';
import { FileUpload } from './FileUpload';
import { MetricsForm } from './MetricsForm';
import { MetricsDisplay } from './MetricsDisplay';
import { teamMembers } from '../store/teamStore';
import { generateId } from '../utils/generateId';
import { evaluateMetrics } from '../utils/metricsEvaluator';
import { useNotificationStore } from '../store/notificationStore';

export const CardModal: React.FC = () => {
  const { isOpen, card, columnId, closeModal, updateCard: updateModalCard } = useModalStore();
  const { toggleSubtask, updateCard: updateBoardCard } = useBoardStore();
  const { addNotification } = useNotificationStore();
  const [showMetricsForm, setShowMetricsForm] = useState(false);

  const handleClose = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  if (!isOpen || !card || !columnId) return null;

  const handleSubtaskToggle = (subtaskId: string) => {
    toggleSubtask(columnId, card.id, subtaskId);
  };

  const handleStatusChange = (status: Status) => {
    if (card && columnId) {
      const updatedCard = { ...card, status };
      updateModalCard(updatedCard);
      updateBoardCard(columnId, updatedCard);
    }
  };

  const handleMetricsSave = (metrics: Metrics) => {
    if (!card || !columnId) return;

    // Evaluate metrics and update card status
    const newStatus = evaluateMetrics(metrics);
    
    const updatedCard = {
      ...card,
      metrics,
      status: newStatus
    };

    updateModalCard(updatedCard);
    updateBoardCard(columnId, updatedCard);
    setShowMetricsForm(false);

    // Notify team members about metrics update and status change
    card.assignedTo.forEach((member) => {
      addNotification({
        type: 'METRICS_UPDATED',
        message: `Metrics updated for ${card.title} - Status: ${newStatus}`,
        cardId: card.id,
        forUser: member.id,
      });
    });
  };

  const handleFileAdd = (files: FileList) => {
    if (!card || !columnId) return;

    const newFiles: FileAttachment[] = Array.from(files).map(file => ({
      id: generateId(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: teamMembers[0], // Using first team member as current user
      uploadedAt: new Date().toISOString(),
      path: `${card.campaignName || 'Default'}/Phase${card.phase.current}/${card.id}/${file.name}`
    }));

    const updatedCard = {
      ...card,
      files: [...(card.files || []), ...newFiles]
    };

    updateModalCard(updatedCard);
    updateBoardCard(columnId, updatedCard);
  };

  const handleFileDelete = (fileId: string) => {
    if (!card || !columnId) return;

    const updatedCard = {
      ...card,
      files: card.files?.filter(f => f.id !== fileId) || []
    };

    updateModalCard(updatedCard);
    updateBoardCard(columnId, updatedCard);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {card.id}
              </span>
              <h2 className="text-xl font-bold text-gray-900">{card.title}</h2>
            </div>
            <div className="flex gap-2">
              <select
                value={card.status}
                onChange={(e) => handleStatusChange(e.target.value as Status)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="TESTING">Testing</option>
                <option value="WINNING">Winning</option>
                <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
                <option value="COMPLETE">Complete</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => closeModal()}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Team Members</h3>
            <div className="flex items-center gap-3">
              {card.assignedTo.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Subtasks</h3>
            <div className="space-y-2">
              {card.subtasks.map((subtask) => (
                <label
                  key={subtask.id}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleSubtaskToggle(subtask.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className={subtask.completed ? 'line-through text-gray-400' : ''}>
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Files</h3>
            <FileUpload
              files={card.files || []}
              onFileAdd={handleFileAdd}
              onFileDelete={handleFileDelete}
              campaignName={card.campaignName || 'Default Campaign'}
              phase={card.phase.current}
              cardId={card.id}
              currentUser={teamMembers[0]} // Using first team member as current user
            />
          </div>

          <div>
            {showMetricsForm ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Update Metrics</h3>
                  <button
                    onClick={() => setShowMetricsForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                <MetricsForm
                  metrics={card.metrics}
                  onSave={handleMetricsSave}
                  currentUser={teamMembers[0]} // Using first team member as current user
                />
              </div>
            ) : (
              card.metrics ? (
                <MetricsDisplay
                  metrics={card.metrics}
                  onEdit={() => setShowMetricsForm(true)}
                  showEditButton={true}
                />
              ) : (
                <div className="text-center py-6">
                  <button
                    onClick={() => setShowMetricsForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Metrics
                  </button>
                </div>
              )
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
            <span>Created: {format(new Date(card.createdAt), 'MMM d, yyyy')}</span>
            <span>Phase {card.phase.current}</span>
          </div>
        </div>
      </div>
    </div>
  );
};