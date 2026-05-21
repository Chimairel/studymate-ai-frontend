"use client";

import React, { useRef } from 'react';
import Badge from '../ui/Badge';

interface EditorPaneProps {
  title: string;
  content: string;
  type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative';
  score: number;
  wordCount: number;
  charCount: number;
  isAnalyzing: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTypeChange: (type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative') => void;
  onAnalyze: () => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  title,
  content,
  type,
  score,
  wordCount,
  charCount,
  isAnalyzing,
  onTitleChange,
  onContentChange,
  onTypeChange,
  onAnalyze,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = before + (selected || 'text') + after;

    onContentChange(
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end)
    );

    // Focus back and restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 50);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        insertText('', text);
      }
    } catch (e) {
      console.warn('Clipboard read access denied.');
    }
  };

  return (
    <div className="editor-main">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('**', '**')} 
          title="Bold"
          type="button"
        >
          <strong>B</strong>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('*', '*')} 
          title="Italic"
          type="button"
        >
          <em>I</em>
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('<u>', '</u>')} 
          title="Underline"
          type="button"
        >
          <u>U</u>
        </button>
        <div className="toolbar-sep"></div>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('# ', '\n')} 
          title="Header 1"
          type="button"
        >
          H1
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('## ', '\n')} 
          title="Header 2"
          type="button"
        >
          H2
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('\n\n')} 
          title="Paragraph Break"
          type="button"
        >
          ¶
        </button>
        <div className="toolbar-sep"></div>
        <button 
          className="toolbar-btn" 
          onClick={() => insertText('[', '](url)')} 
          title="Insert Link"
          type="button"
        >
          🔗
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handlePaste} 
          title="Paste from Clipboard"
          type="button"
        >
          📋 Paste
        </button>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="gold" className="score-badge">
            Score: {score > 0 ? `${score}/100` : '--/100'}
          </Badge>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onAnalyze}
            disabled={isAnalyzing}
            type="button"
          >
            {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}
          </button>
        </div>
      </div>

      {/* Editor Title Bar */}
      <div className="editor-title-bar" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={type} 
            onChange={(e) => onTypeChange(e.target.value as any)}
            className="essay-type-tag"
            style={{ border: 'none', background: 'var(--blue-light)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Argumentative">📝 Argumentative Essay</option>
            <option value="Expository">🌿 Expository Essay</option>
            <option value="Analytical">🏙️ Analytical Essay</option>
            <option value="Narrative">📘 Narrative Essay</option>
          </select>
        </div>
        <input 
          className="essay-title-input" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Essay title..."
        />
      </div>

      {/* Textarea Area */}
      <div className="editor-area">
        <textarea 
          ref={textareaRef}
          className="editor-textarea"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Begin writing your essay here. Your AI coach will provide feedback as you write..."
        />
      </div>

      {/* Footer Word Count Bar */}
      <div className="word-count-bar">
        <span>Words: <span className="wc-num">{wordCount}</span></span>
        <span>·</span>
        <span>Characters: <span className="wc-num">{charCount}</span></span>
        <span>·</span>
        <span>Target: <span className="wc-num">800–1,000</span> words</span>
        <span style={{ marginLeft: 'auto' }}>
          {isAnalyzing ? 'Analyzing draft...' : 'Auto-saved ✓'}
        </span>
      </div>
    </div>
  );
};

export default EditorPane;
