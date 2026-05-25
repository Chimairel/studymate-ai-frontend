"use client";

import React, { useRef } from 'react';
import Badge from '../ui/Badge';
import { FeedbackSuggestion } from '../../services/essayService';

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
  onSummarize: () => void;
  feedback?: FeedbackSuggestion[];
  highlightEnabled?: boolean;
}

const cleanHtmlOfHighlights = (html: string): string => {
  if (!html) return '';
  return html.replace(/<span class="grammar-highlight"[^>]*>([\s\S]*?)<\/span>/g, '$1');
};

const applyHighlights = (html: string, feedbackList: FeedbackSuggestion[], enabled: boolean): string => {
  if (!html) return '';
  if (!enabled || !feedbackList || feedbackList.length === 0) return html;

  let highlightedHtml = html;
  const activeFeedback = feedbackList.filter(item => item.original && !item.accepted);

  for (const item of activeFeedback) {
    const original = item.original;
    if (!original) continue;

    try {
      const escaped = original.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Lookbehind & Lookahead to avoid replacing words inside tag configurations
      const regex = new RegExp(`(?<!<[^>]*)${escaped}(?![^<]*>)`, 'g');
      
      highlightedHtml = highlightedHtml.replace(regex, (match) => {
        return `<span class="grammar-highlight" style="border-bottom: 2.5px dotted var(--accent); padding-bottom: 1px; background: rgba(198, 75, 49, 0.05); font-weight: 500;" title="${item.message || 'Writing coach suggestion'}">${match}</span>`;
      });
    } catch (err) {
      console.warn('Failed to highlight word:', original, err);
    }
  }

  return highlightedHtml;
};

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
  onSummarize,
  feedback = [],
  highlightEnabled = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>(content);

  const [activeStyles, setActiveStyles] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Track cursor position styling states
  React.useEffect(() => {
    const handleSelectionChange = () => {
      setActiveStyles({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Sync content from prop ONLY when changed externally (i.e. not by user typing)
  React.useEffect(() => {
    if (editorRef.current) {
      const cleanEditorHtml = cleanHtmlOfHighlights(editorRef.current.innerHTML);
      const cleanPropHtml = cleanHtmlOfHighlights(content);

      if (cleanPropHtml !== cleanEditorHtml) {
        if (editorRef.current.innerHTML === '' || cleanPropHtml !== cleanHtmlOfHighlights(lastContentRef.current)) {
          const highlighted = applyHighlights(content, feedback, highlightEnabled);
          editorRef.current.innerHTML = highlighted;
          lastContentRef.current = content;
        }
      }
    }
  }, [content, feedback, highlightEnabled]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    const cleanHtml = cleanHtmlOfHighlights(newHtml);
    lastContentRef.current = cleanHtml;
    onContentChange(cleanHtml);
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      lastContentRef.current = newHtml;
      onContentChange(newHtml);
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handlePasteButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        executeCommand('insertText', text);
      }
    } catch (e) {
      console.warn('Clipboard read access denied.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Only .txt files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const formattedText = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\r?\n/g, '<br>');
        
        onContentChange(formattedText);
        if (editorRef.current) {
          editorRef.current.innerHTML = formattedText;
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="editor-main">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button 
          className={`toolbar-btn ${activeStyles.bold ? 'active' : ''}`} 
          onClick={() => executeCommand('bold')} 
          onMouseDown={(e) => e.preventDefault()}
          title="Bold"
          type="button"
        >
          <strong>B</strong>
        </button>
        <button 
          className={`toolbar-btn ${activeStyles.italic ? 'active' : ''}`} 
          onClick={() => executeCommand('italic')} 
          onMouseDown={(e) => e.preventDefault()}
          title="Italic"
          type="button"
        >
          <em>I</em>
        </button>
        <button 
          className={`toolbar-btn ${activeStyles.underline ? 'active' : ''}`} 
          onClick={() => executeCommand('underline')} 
          onMouseDown={(e) => e.preventDefault()}
          title="Underline"
          type="button"
        >
          <u>U</u>
        </button>
        
        <div className="toolbar-sep"></div>
        <button 
          className="toolbar-btn" 
          onClick={() => executeCommand('insertParagraph')} 
          onMouseDown={(e) => e.preventDefault()}
          title="Paragraph Break"
          type="button"
        >
          ¶
        </button>
        <div className="toolbar-sep"></div>
        <input 
          type="file" 
          accept=".txt" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
        <button 
          className="toolbar-btn" 
          onClick={() => fileInputRef.current?.click()} 
          onMouseDown={(e) => e.preventDefault()}
          title="Upload Text File (.txt)"
          type="button"
        >
          📤 Upload
        </button>
        <button 
          className="toolbar-btn" 
          onClick={handlePasteButton} 
          onMouseDown={(e) => e.preventDefault()}
          title="Paste from Clipboard"
          type="button"
        >
          📋 Paste
        </button>
        <button 
          className="toolbar-btn" 
          onClick={onSummarize} 
          onMouseDown={(e) => e.preventDefault()}
          title="Summarize Essay"
          type="button"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '600' }}
        >
          ✨ Summarize
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
        <div 
          ref={editorRef}
          className="editor-textarea"
          contentEditable
          onInput={handleInput}
          onPaste={handlePasteEvent}
          data-placeholder="Begin writing your essay here. Your AI coach will provide feedback as you write..."
          style={{ 
            minHeight: '400px', 
            outline: 'none', 
            overflowY: 'auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
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
