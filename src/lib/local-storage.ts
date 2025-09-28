import { Note } from '../types';

const NOTES_KEY = 'shareable-notes';
const USER_KEY = 'current-user';

export class LocalStorageService {
  static getNotes(): Note[] {
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch {
      return [];
    }
  }

  static saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to localStorage:', error);
    }
  }

  static addNote(note: Note): void {
    const notes = this.getNotes();
    notes.push(note);
    this.saveNotes(notes);
  }

  static updateNote(updatedNote: Note): void {
    const notes = this.getNotes();
    const index = notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = updatedNote;
      this.saveNotes(notes);
    }
  }

  static deleteNote(noteId: string): void {
    const notes = this.getNotes().filter(note => note.id !== noteId);
    this.saveNotes(notes);
  }

  static getCurrentUser() {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: any): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }

  static clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }
}