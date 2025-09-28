import React from 'react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { Search, Plus, StickyNote } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoteSelect: (note: Note) => void;
  onNotePin: (noteId: string) => void;
  onNewNote: () => void;
  loading?: boolean;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  searchQuery,
  onSearchChange,
  onNoteSelect,
  onNotePin,
  onNewNote,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <StickyNote className="text-violet-600" size={28} />
            My Notes
          </h2>
          <button
            onClick={onNewNote}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-auto p-6">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={onNewNote}
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
              >
                <Plus size={20} />
                Create First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => onNoteSelect(note)}
                onPin={() => onNotePin(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};