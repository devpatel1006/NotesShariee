import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { LocalStorageService } from '../lib/local-storage';
import { MOCK_NOTES } from '../lib/supabase';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load notes on component mount
  useEffect(() => {
    const loadNotes = () => {
      const localNotes = LocalStorageService.getNotes();
      if (localNotes.length === 0) {
        // Initialize with mock data if no notes exist
        LocalStorageService.saveNotes(MOCK_NOTES);
        setNotes(MOCK_NOTES);
      } else {
        setNotes(localNotes);
      }
      setLoading(false);
    };

    loadNotes();
  }, []);

  const addNote = useCallback((note: Note) => {
    setNotes(prev => {
      const updated = [note, ...prev];
      LocalStorageService.saveNotes(updated);
      return updated;
    });
  }, []);

  const updateNote = useCallback((updatedNote: Note) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      LocalStorageService.saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => {
      const updated = prev.filter(note => note.id !== noteId);
      LocalStorageService.saveNotes(updated);
      return updated;
    });
  }, []);

  const togglePin = useCallback((noteId: string) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === noteId 
          ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
          : note
      );
      LocalStorageService.saveNotes(updated);
      return updated;
    });
  }, []);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.plainText.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by update time
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return {
    notes: filteredNotes,
    allNotes: notes,
    loading,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin
  };
};