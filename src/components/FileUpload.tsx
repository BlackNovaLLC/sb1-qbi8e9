import React, { useCallback } from 'react';
import { FileAttachment, TeamMember } from '../types';
import { format } from 'date-fns';
import { DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  files: FileAttachment[];
  onFileAdd: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
  campaignName: string;
  phase: number;
  cardId: string;
  currentUser: TeamMember;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFileAdd,
  onFileDelete,
  campaignName,
  phase,
  cardId,
  currentUser
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      onFileAdd(droppedFiles);
    }
  }, [onFileAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const getFilePath = (fileName: string) => {
    const fileType = fileName.split('.').pop()?.toLowerCase() || 'unknown';
    let category = 'other';
    
    if (['doc', 'docx', 'txt', 'pdf'].includes(fileType)) {
      category = 'scripts';
    } else if (['mp4', 'mov', 'avi', 'webm'].includes(fileType)) {
      category = 'videos';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
      category = 'images';
    } else if (['xls', 'xlsx', 'csv'].includes(fileType)) {
      category = 'results';
    }

    return `${campaignName}/Phase${phase}/${cardId}/${category}/${fileName}`;
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onFileAdd(e.target.files)}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium text-gray-600">
            Drop files here or click to upload
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {file.uploadedBy.name} on {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{file.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onFileDelete(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};