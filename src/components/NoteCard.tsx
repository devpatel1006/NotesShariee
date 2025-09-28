import React from 'react';
import { Note } from '../types';
import { Pin, Lock, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onPin: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onPin }) => {
  const previewText = note.plainText.length > 150 
    ? note.plainText.substring(0, 150) + '...'
    : note.plainText;

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-400 transition-all duration-200 cursor-pointer ${
        note.isPinned ? 'ring-2 ring-violet-200 dark:ring-violet-400 bg-violet-50 dark:bg-violet-900/20' : ''
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-semibold text-lg line-clamp-2 ${
          note.isPinned ? 'text-violet-900 dark:text-violet-300' : 'text-gray-800 dark:text-gray-200'
        }`}>
          {note.title || 'Untitled Note'}
        </h3>
        
        <div className="flex items-center gap-2 ml-2">
          {note.isEncrypted && (
            <Lock size={16} className="text-amber-600 flex-shrink-0" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className={`p-1 rounded-full transition-all duration-200 ${
              note.isPinned
                ? 'text-violet-600 bg-violet-100'
                : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'
            } opacity-0 group-hover:opacity-100`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
        {previewText}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Summary */}
      {note.summary && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-300 dark:border-blue-500">
          <p className="text-blue-800 dark:text-blue-300 text-xs font-medium">AI Summary</p>
          <p className="text-blue-700 dark:text-blue-400 text-sm">{note.summary}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-auto">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
        </div>
        
        {note.isPinned && (
          <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium">
            <Pin size={12} />
            Pinned
          </span>
        )}
      </div>
    </div>
  );
};