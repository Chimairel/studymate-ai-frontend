"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useEssay } from '../../hooks/useEssay';
import { useCoach } from '../../hooks/useCoach';
import { useAuth } from '../../hooks/useAuth';
import EditorPane from '../../components/editor/EditorPane';
import CoachPane from '../../components/editor/CoachPane';
import { useSearchParams, useRouter } from 'next/navigation';

type EssayType = 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative';

export const EditorPage: React.FC = () => {
  const { essays, currentEssay, setCurrentEssay, addEssay, updateEssay, isLoading } = useEssay();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get('id');
  
  // Local editor state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<EssayType>('Argumentative');
  const [activeTab, setActiveTab] = useState<'feedback' | 'chat' | 'score'>('feedback');
  const [isLocalAnalyzing, setIsLocalAnalyzing] = useState(false);
  
  // Hook for coach interactions bound to currentEssay?.id
  const { 
    chatHistory, 
    isAnalyzing, 
    isTyping, 
    analyze, 
    sendMessage,
    summarize
  } = useCoach(currentEssay?.id);
  const loading = isAnalyzing || isLocalAnalyzing;
  
  // Ref to track if we need to sync when currentEssay loads
  const currentEssayIdRef = useRef<string | undefined>(undefined);

  // Sync URL query 'id' with currentEssay
  useEffect(() => {
    if (isLoading || loading) return;

    if (queryId) {
      if (!currentEssay || currentEssay.id !== queryId) {
        const matched = essays.find(e => e.id === queryId);
        if (matched) {
          setCurrentEssay(matched);
        }
      }
    } else {
      if (currentEssay) {
        setCurrentEssay(null);
      }
    }
  }, [queryId, essays, isLoading, loading, currentEssay, setCurrentEssay]);

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
      // ONLY clear local editor state if we are NOT on a queryId URL route.
      // If a queryId is present, we are retrieving/editing an essay, so preserve whatever is in local state until loaded!
      if (!queryId && currentEssayIdRef.current !== undefined) {
        setTitle('');
        setContent('');
        setType('Argumentative');
        currentEssayIdRef.current = undefined;
      }
    }
  }, [currentEssay, queryId]);

  // Recover unsaved draft on mount (only when creating a new essay)
  useEffect(() => {
    if (!queryId && !currentEssay) {
      const savedTitle = localStorage.getItem('studymate_draft_title');
      const savedContent = localStorage.getItem('studymate_draft_content');
      const savedType = localStorage.getItem('studymate_draft_type');
      
      if (savedTitle || savedContent) {
        setTitle(savedTitle || '');
        setContent(savedContent || '');
        if (savedType) setType(savedType as EssayType);
      }
    }
  }, [queryId, currentEssay]);

  // Save unsaved draft changes to localStorage (only when creating a new essay)
  useEffect(() => {
    if (!currentEssay && !queryId) {
      if (title || content) {
        localStorage.setItem('studymate_draft_title', title);
        localStorage.setItem('studymate_draft_content', content);
        localStorage.setItem('studymate_draft_type', type);
      } else {
        localStorage.removeItem('studymate_draft_title');
        localStorage.removeItem('studymate_draft_content');
        localStorage.removeItem('studymate_draft_type');
      }
    }
  }, [title, content, type, currentEssay, queryId]);

  // Hook for coach interactions bound to currentEssay?.id

  if (isLoading && queryId) {
    return (
      <div className="main-content" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
        <div className="flex-center" style={{ height: '100%', flexDirection: 'column', background: 'var(--paper)', gap: '16px' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--accent)' }}></div>
          <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '22px', color: 'var(--ink)' }}>
            Loading your essay...
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Retrieving your coach feedback and active drafts ✍️
          </div>
        </div>
      </div>
    );
  }

  // Utility to strip HTML tags for accurate word/character count
  const getPlainText = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const plainText = getPlainText(content);
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;

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
      setIsLocalAnalyzing(true);
      try {
        // 1. Create the essay first if it doesn't exist
        const created = await addEssay(title, content, type);
        if (!created) {
          alert('Failed to save your new essay. Please check your connection and click "Save & Analyze" again.');
          setIsLocalAnalyzing(false);
          return;
        }
        
        // Clear unsaved draft from localStorage
        localStorage.removeItem('studymate_draft_title');
        localStorage.removeItem('studymate_draft_content');
        localStorage.removeItem('studymate_draft_type');
        
        // Update URL to match the newly created essay ID
        router.replace(`/dashboard/editor?id=${created.id}`);
        
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
        alert('AI Coach analysis failed or was interrupted. Please click "Save & Analyze" again to retry.');
      } finally {
        setIsLocalAnalyzing(false);
      }
    } else {
      // 2. Already exists, run standard analyze hook
      await analyze(title, content, type);
      setActiveTab('feedback');
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      alert('Please write some content first to summarize.');
      return;
    }

    let activeEssay = currentEssay;

    if (!activeEssay) {
      if (!title.trim()) {
        alert('Please enter a title for your essay first.');
        return;
      }
      
      // Auto-save the essay first
      activeEssay = await addEssay(title, content, type);
      if (!activeEssay) {
        alert('Failed to save your new essay.');
        return;
      }
    }

    setActiveTab('chat');
    await summarize(content, type, activeEssay.id);
  };

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
          onSummarize={handleSummarize}
          feedback={currentEssay?.feedback || []}
          highlightEnabled={user?.preferences?.grammarHighlights !== false}
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
