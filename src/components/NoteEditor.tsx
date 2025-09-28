import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { AIService } from '../lib/ai-service';
import { EncryptionService } from '../lib/encryption';
import { 
  Save, 
  ArrowLeft, 
  Pin, 
  Lock, 
  Unlock, 
  Sparkles, 
  Tags, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [plainText, setPlainText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [aiLoading, setAiLoading] = useState<{
    summary: boolean;
    tags: boolean;
    glossary: boolean;
    grammar: boolean;
  }>({
    summary: false,
    tags: false,
    glossary: false,
    grammar: false
  });
  const [summary, setSummary] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  // Initialize form with note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setPlainText(note.plainText);
      setTags(note.tags || []);
      setIsPinned(note.isPinned);
      setIsEncrypted(note.isEncrypted);
      setSummary(note.summary || '');
      
      // If note is encrypted, we need password to decrypt
      if (note.isEncrypted && !content) {
        setShowPasswordInput(true);
      }
    } else {
      // Reset for new note
      setTitle('');
      setContent('');
      setPlainText('');
      setTags([]);
      setIsPinned(false);
      setIsEncrypted(false);
      setEncryptionPassword('');
      setShowPasswordInput(false);
      setSummary('');
      setSuggestedTags([]);
    }
  }, [note]);

  const handleSave = () => {
    if (!title.trim() && !plainText.trim()) return;

    let finalContent = content;
    if (isEncrypted && encryptionPassword) {
      finalContent = EncryptionService.encrypt(content, encryptionPassword);
    }

    const savedNote: Note = {
      id: note?.id || Date.now().toString(),
      title: title || 'Untitled Note',
      content: finalContent,
      plainText,
      isPinned,
      isEncrypted,
      tags,
      summary,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedNote);
  };

  const handleDecrypt = () => {
    if (!note || !encryptionPassword) return;
    
    try {
      const decryptedContent = EncryptionService.decrypt(note.content, encryptionPassword);
      setContent(decryptedContent);
      setPlainText(decryptedContent.replace(/<[^>]*>/g, ''));
      setShowPasswordInput(false);
    } catch (error) {
      alert('Invalid password. Please try again.');
    }
  };

  const generateSummary = async () => {
    if (!plainText.trim()) return;
    
    setAiLoading(prev => ({ ...prev, summary: true }));
    try {
      const generatedSummary = await AIService.generateSummary(content);
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const generateTagSuggestions = async () => {
    if (!plainText.trim()) return;
    
    setAiLoading(prev => ({ ...prev, tags: true }));
    try {
      const suggestions = await AIService.suggestTags(plainText);
      setSuggestedTags(suggestions);
    } catch (error) {
      console.error('Failed to generate tag suggestions:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, tags: false }));
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Show password input for encrypted notes
  if (note && note.isEncrypted && showPasswordInput) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="mx-auto mb-4 text-amber-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Protected Note</h2>
            <p className="text-gray-600">This note is encrypted. Enter the password to view it.</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={encryptionPassword}
              onChange={(e) => setEncryptionPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={handleDecrypt}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Unlock size={18} />
                Decrypt
              </button>
              <button
                onClick={onBack}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            title="Back to notes"
          >
            <ArrowLeft size={20} />
          </button>
          
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isPinned 
                ? 'text-violet-600 bg-violet-100' 
                : 'text-gray-600 hover:text-violet-600 hover:bg-violet-50'
            }`}
            title={isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={18} />
          </button>

          <button
            onClick={() => setIsEncrypted(!isEncrypted)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isEncrypted 
                ? 'text-amber-600 bg-amber-100' 
                : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
            title={isEncrypted ? 'Remove encryption' : 'Encrypt note'}
          >
            {isEncrypted ? <Lock size={18} /> : <Unlock size={18} />}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-6">
          {isEncrypted && (
            <div className="mb-4">
              <input
                type="password"
                placeholder="Encryption password..."
                value={encryptionPassword}
                onChange={(e) => setEncryptionPassword(e.target.value)}
                className="w-full px-4 py-2 border border-amber-300 dark:border-amber-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50 dark:bg-amber-900/20 text-gray-800 dark:text-gray-200 transition-colors duration-200"
              />
            </div>
          )}

          <div className="flex-1">
            <RichTextEditor
              content={content}
              onChange={(html, text) => {
                setContent(html);
                setPlainText(text);
              }}
              placeholder="Start writing your note..."
            />
          </div>

          {/* Tags Input */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Tags size={18} className="text-gray-600" />
              <span className="font-medium text-gray-800">Tags</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-emerald-500 hover:text-emerald-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(newTag);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm transition-colors duration-200"
              />
              <button
                onClick={() => addTag(newTag)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-auto transition-colors duration-200">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-6">
            <Sparkles className="text-violet-600" size={20} />
            AI Assistant
          </h3>

          <div className="space-y-6">
            {/* AI Summary */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  Summary
                </h4>
                <button
                  onClick={generateSummary}
                  disabled={aiLoading.summary || !plainText.trim()}
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
                >
                  {aiLoading.summary ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
              {summary ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-300 dark:border-blue-500">
                  {summary}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Generate an AI summary of your note
                </p>
              )}
            </div>

            {/* Tag Suggestions */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Tags size={16} className="text-green-600" />
                  Tag Suggestions
                </h4>
                <button
                  onClick={generateTagSuggestions}
                  disabled={aiLoading.tags || !plainText.trim()}
                  className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
                >
                  {aiLoading.tags ? (
                    <Loader size={14} className="animate-spin" />
                  ) : (
                    'Suggest'
                  )}
                </button>
              </div>
              {suggestedTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors duration-200 border border-green-200"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Get AI-powered tag suggestions for your note
                </p>
              )}
            </div>

            {/* Grammar Check Status */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm transition-colors duration-200">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                Writing Assistant
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span className="text-gray-600">Grammar check: Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle size={14} className="text-amber-600" />
                  <span className="text-gray-600">Glossary terms: Highlighted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};