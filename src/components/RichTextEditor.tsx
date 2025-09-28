import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, plainText: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('16');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const executeCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      updateContent();
    }
  };

  const handleListCommand = (listType: 'insertUnorderedList' | 'insertOrderedList') => {
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Get current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // If no selection, place cursor at end
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      // Execute the list command
      document.execCommand(listType, false);
      updateContent();
    }
  };

  const updateContent = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      const plainText = editorRef.current.textContent || '';
      onChange(htmlContent, plainText);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    executeCommand('fontSize', '7');
    // Apply custom font size through CSS
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      try {
        range.surroundContents(span);
      } catch {
        // If can't surround, just set the font size
        executeCommand('fontSize', size);
      }
    }
    updateContent();
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 hover:bg-violet-100 hover:scale-105 ${
        isActive ? 'bg-violet-200 text-violet-700' : 'text-gray-600 hover:text-violet-700'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-wrap transition-colors duration-200">
        <ToolbarButton
          onClick={() => executeCommand('bold')}
          icon={<Bold size={18} />}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => executeCommand('italic')}
          icon={<Italic size={18} />}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => executeCommand('underline')}
          icon={<Underline size={18} />}
          title="Underline (Ctrl+U)"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <ToolbarButton
          onClick={() => executeCommand('justifyLeft')}
          icon={<AlignLeft size={18} />}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => executeCommand('justifyCenter')}
          icon={<AlignCenter size={18} />}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => executeCommand('justifyRight')}
          icon={<AlignRight size={18} />}
          title="Align Right"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <div className="flex items-center gap-2">
          <Type size={18} className="text-gray-600" />
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          >
            <option value="12">12px</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
            <option value="32">32px</option>
          </select>
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={() => handleListCommand('insertUnorderedList')}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-violet-100 hover:scale-105 text-gray-600 hover:text-violet-700"
          title="Bullet List"
        >
          •
        </button>
        
        <button
          onClick={() => handleListCommand('insertOrderedList')}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-violet-100 hover:scale-105 text-gray-600 hover:text-violet-700"
          title="Numbered List"
        >
          1.
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onBlur={updateContent}
        onKeyDown={(e) => {
          // Handle Enter key in lists
          if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const listItem = range.startContainer.parentElement?.closest('li');
              if (listItem && listItem.textContent?.trim() === '') {
                // If empty list item, exit the list
                e.preventDefault();
                document.execCommand('outdent');
                updateContent();
              }
            }
          }
        }}
        className="p-4 min-h-[300px] focus:outline-none text-gray-800 dark:text-gray-200 leading-relaxed bg-white dark:bg-gray-800 transition-colors duration-200"
        style={{ fontSize: `${fontSize}px` }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      <style>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] li {
          margin: 0.5em 0;
          list-style-position: outside;
        }
        
        [contenteditable] ul li {
          list-style-type: disc;
        }
        
        [contenteditable] ol li {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
};