import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data for development
export const MOCK_NOTES = [
  {
    id: '1',
    title: 'Project Planning Meeting Notes',
    content: '<p><strong>Meeting Date:</strong> Today</p><p>Discussed the new <em>Shareable Notes</em> application project. Key points:</p><ul><li>Implement custom rich text editor</li><li>Add AI-powered features</li><li>Ensure data security with encryption</li></ul>',
    plainText: 'Meeting Date: Today\n\nDiscussed the new Shareable Notes application project. Key points:\n- Implement custom rich text editor\n- Add AI-powered features\n- Ensure data security with encryption',
    isPinned: true,
    isEncrypted: false,
    tags: ['meeting', 'project', 'planning'],
    summary: 'Meeting notes about the new Shareable Notes application project covering key implementation points.',
    glossaryTerms: [
      {
        term: 'rich text editor',
        definition: 'A text editor that allows formatting of text content beyond plain text.',
        startIndex: 89,
        endIndex: 106
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Shopping List',
    content: '<p>Groceries needed:</p><ul><li>Apples</li><li>Bread</li><li>Milk</li><li>Cheese</li></ul><p><u>Don\'t forget</u> to check expiration dates!</p>',
    plainText: 'Groceries needed:\n- Apples\n- Bread\n- Milk\n- Cheese\n\nDon\'t forget to check expiration dates!',
    isPinned: false,
    isEncrypted: false,
    tags: ['shopping', 'groceries', 'personal'],
    summary: 'Simple grocery shopping list with reminder to check expiration dates.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];