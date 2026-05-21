"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useEssay } from '../../hooks/useEssay';
import { useCoach } from '../../hooks/useCoach';
import EditorPane from '../../components/editor/EditorPane';
import CoachPane from '../../components/editor/CoachPane';

type EssayType = 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative';

export const EditorPage: React.FC = () => {
  const { currentEssay, addEssay, updateEssay } = useEssay();
  
  // Local editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<EssayType>('Argumentative');
  const [activeTab, setActiveTab] = useState<'feedback' | 'chat' | 'score'>('feedback');
  
  // Ref to track if we need to sync when currentEssay loads
  const currentEssayIdRef = useRef<string | undefined>(undefined);

  // Sync with currentEssay when it changes
  useEffect(() => {
    if (currentEssay) {
      if (currentEssayIdRef.current !== currentEssay.id) {
        setTitle(currentEssay.title || '');
        setContent(currentEssay.content || '');
        setType(currentEssay.type || 'Argumentative');
        currentEssayIdRef.current = currentEssay.id;
      }
    } else {
      if (currentEssayIdRef.current !== undefined) {
        setTitle('');
        setContent('');
        setType('Argumentative');
        currentEssayIdRef.current = undefined;
      }
    }
  }, [currentEssay]);

  // Hook for coach interactions bound to currentEssay?.id
  const { 
    chatHistory, 
    isAnalyzing, 
    isTyping, 
    analyze, 
    sendMessage 
  } = useCoach(currentEssay?.id);

  // Character and Word counters
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const handleAnalyze = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your essay.');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content for your essay.');
      return;
    }

    if (!currentEssay) {
      // 1. Create the essay first if it doesn't exist
      const created = await addEssay(title, content, type);
      if (!created) {
        alert('Failed to save your new essay.');
        return;
      }
      
      // Wait for React to process state updates, then analyze
      setIsLocalAnalyzing(true);
      try {
        const { coachService } = await import('../../services/coachService');
        const res = await coachService.analyzeEssay(title, content, type, created.id);
        await updateEssay(created.id, {
          title,
          content,
          type,
          score: res.score,
          subScores: res.subScores,
          feedback: res.feedback,
          wordCount,
          charCount
        });
        setActiveTab('feedback');
      } catch (e) {
        console.error('Initial analysis failed', e);
      } finally {
        setIsLocalAnalyzing(false);
      }
    } else {
      // 2. Already exists, run standard analyze hook
      await analyze(title, content, type);
      setActiveTab('feedback');
    }
  };

  // State to support analysis loading when creating a new essay
  const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);
  const loading = isAnalyzing || isLocalAnalyzing;

  // Handle applying a suggested correction
  const handleApplySuggestion = async (original: string, suggestion: string) => {
    if (!original || !suggestion) return;
    
    // Find the first occurrence of the original text and replace it
    const index = content.indexOf(original);
    if (index === -1) {
      alert('Could not find the original text in your draft. It might have been modified.');
      return;
    }

    const updatedContent = content.substring(0, index) + suggestion + content.substring(index + original.length);
    setContent(updatedContent);

    // Update in context if essay exists
    if (currentEssay) {
      const updatedWords = updatedContent.trim().split(/\s+/).filter(Boolean).length;
      const updatedChars = updatedContent.length;

      // Filter out this feedback item since it has been applied
      const updatedFeedback = (currentEssay.feedback || []).filter(
        item => item.original !== original
      );

      await updateEssay(currentEssay.id, {
        content: updatedContent,
        wordCount: updatedWords,
        charCount: updatedChars,
        feedback: updatedFeedback
      });
    }
  };

  const handleSendMessage = (text: string) => {
    if (!currentEssay) {
      alert('Please write and analyze your essay first to start a chat with the Coach.');
      return;
    }
    sendMessage(text);
  };

  return (
    <div className="main-content" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
      <div className="editor-shell" style={{ height: '100%' }}>
        {/* Left pane: text entry */}
        <EditorPane 
          title={title}
          content={content}
          type={type}
          score={currentEssay?.score || 0}
          wordCount={wordCount}
          charCount={charCount}
          isAnalyzing={loading}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onTypeChange={setType}
          onAnalyze={handleAnalyze}
        />

        {/* Right pane: coach recommendations & chat */}
        <CoachPane 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          feedback={currentEssay?.feedback || []}
          onApplySuggestion={handleApplySuggestion}
          messages={chatHistory}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          score={currentEssay?.score || 0}
          subScores={currentEssay?.subScores}
          isAnalyzing={loading}
        />
      </div>
    </div>
  );
};

export default EditorPage;
