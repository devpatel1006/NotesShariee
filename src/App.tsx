import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { NotesList } from './components/NotesList';
import { NoteEditor } from './components/NoteEditor';
import { useNotes } from './hooks/useNotes';
import { LocalStorageService } from './lib/local-storage';
import { Note } from './types';

function App() {
  const [user, setUser] = useState(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  const {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin
  } = useNotes();

  // Check for existing user session
  useEffect(() => {
    const savedUser = LocalStorageService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication
    const user = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    setUser(user);
    LocalStorageService.setCurrentUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    LocalStorageService.clearUser();
    setSelectedNote(null);
    setShowEditor(false);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleNoteSave = (note: Note) => {
    if (selectedNote) {
      updateNote(note);
    } else {
      addNote(note);
    }
    setShowEditor(false);
    setSelectedNote(null);
  };

  const handleBackToList = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header user={user} onLogout={handleLogout} />
          
          <div className="flex-1 overflow-hidden">
            {showEditor ? (
              <NoteEditor
                note={selectedNote}
                onSave={handleNoteSave}
                onBack={handleBackToList}
              />
            ) : (
              <NotesList
                notes={notes}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNoteSelect={handleNoteSelect}
                onNotePin={togglePin}
                onNewNote={handleNewNote}
                loading={loading}
              />
            )}
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;