export interface Note {
  id: string;
  title: string;
  content: string;
  plainText: string;
  isPinned: boolean;
  isEncrypted: boolean;
  tags: string[];
  summary?: string;
  glossaryTerms?: GlossaryTerm[];
  grammarIssues?: GrammarIssue[];
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  startIndex: number;
  endIndex: number;
}

export interface GrammarIssue {
  text: string;
  suggestion: string;
  startIndex: number;
  endIndex: number;
  type: 'spelling' | 'grammar' | 'style';
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface EncryptedNote extends Omit<Note, 'content' | 'plainText'> {
  encryptedContent: string;
  contentPreview: string;
}