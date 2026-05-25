"use client";

import { useState, useEffect, useCallback } from 'react';
import { coachService, ChatMessage } from '../services/coachService';
import { useEssay } from '../context/EssayContext';

const CHAT_STORAGE_PREFIX = 'studymate_chat_';

export function useCoach(essayId: string | undefined) {
  const { updateEssay, currentEssay } = useEssay();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history
  useEffect(() => {
    setTimeout(() => {
      if (!essayId) {
        setChatHistory([]);
        return;
      }

      const stored = localStorage.getItem(`${CHAT_STORAGE_PREFIX}${essayId}`);
      if (stored) {
        try {
          setChatHistory(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse chat history', e);
          setChatHistory([]);
        }
      } else {
        // Default welcome message
        const defaultWelcome: ChatMessage[] = [
          {
            id: 'welcome',
            sender: 'coach',
            text: `Hi there! I'm your AI Writing Coach. Click the "Save & Analyze" button at the top to generate detailed scores and revision tips, or ask me any question in the chat!`,
            timestamp: new Date().toISOString()
          }
        ];
        setChatHistory(defaultWelcome);
        localStorage.setItem(`${CHAT_STORAGE_PREFIX}${essayId}`, JSON.stringify(defaultWelcome));
      }
    }, 0);
  }, [essayId]);

  const analyze = useCallback(async (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative') => {
    if (!essayId) return null;

    setIsAnalyzing(true);
    try {
      const result = await coachService.analyzeEssay(title, content, type, essayId);

      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      const charCount = content.length;

      // Update the essay in our global context & service
      const updatedEssay = await updateEssay(essayId, {
        title,
        content,
        type,
        score: result.score,
        subScores: result.subScores,
        feedback: result.feedback,
        wordCount,
        charCount
      });

      // Also insert coach advisory in chat
      const alertMsg: ChatMessage = {
        id: `analysis-alert-${Date.now()}`,
        sender: 'coach',
        text: `Analysis complete! Your essay scored **${result.score}/100**. I've populated the **Feedback** and **Score** tabs with breakdown details. Let me know if you want to work on any specific suggestion!`,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => {
        const next = [...prev, alertMsg];
        localStorage.setItem(`${CHAT_STORAGE_PREFIX}${essayId}`, JSON.stringify(next));
        return next;
      });

      return updatedEssay;
    } catch (e) {
      console.error('Analysis failed', e);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [essayId, updateEssay]);

  const sendMessage = useCallback(async (text: string) => {
    if (!essayId || !text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    let updatedHistory: ChatMessage[] = [];
    setChatHistory(prev => {
      updatedHistory = [...prev, userMsg];
      localStorage.setItem(`${CHAT_STORAGE_PREFIX}${essayId}`, JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    const essayContent = currentEssay?.content || '';
    const essayType = currentEssay?.type || 'Argumentative';

    setIsTyping(true);
    try {
      const coachText = await coachService.getChatReply(text, updatedHistory, essayContent, essayType);
      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: coachText,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => {
        const next = [...prev, coachMsg];
        localStorage.setItem(`${CHAT_STORAGE_PREFIX}${essayId}`, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error('Failed to get coach reply', e);
    } finally {
      setIsTyping(false);
    }
  }, [essayId, currentEssay]);

  const clearChat = useCallback(() => {
    if (!essayId) return;
    const defaultWelcome: ChatMessage[] = [
      {
        id: 'welcome',
        sender: 'coach',
        text: `Hi there! I'm your AI Writing Coach. Ask me any question in the chat!`,
        timestamp: new Date().toISOString()
      }
    ];
    setChatHistory(defaultWelcome);
    localStorage.setItem(`${CHAT_STORAGE_PREFIX}${essayId}`, JSON.stringify(defaultWelcome));
  }, [essayId]);

  const summarize = useCallback(async (currentContent: string, currentType: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative', customId?: string) => {
    const activeId = customId || essayId;
    if (!activeId || !currentContent.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: 'Please summarize my essay.',
      timestamp: new Date().toISOString()
    };

    let updatedHistory: ChatMessage[] = [];
    setChatHistory(prev => {
      updatedHistory = [...prev, userMsg];
      localStorage.setItem(`${CHAT_STORAGE_PREFIX}${activeId}`, JSON.stringify(updatedHistory));
      return updatedHistory;
    });

    setIsTyping(true);
    try {
      const coachText = await coachService.getChatReply(
        "Please provide a concise and direct summary of this essay draft. Write the summary from the exact same perspective, voice, and tone as the essay itself (e.g., do not refer to the essay in the third-person like 'The essay argues...', 'The text discusses...', or 'The author writes...'). Do not include any conversational greeting, meta-feedback, coaching remarks, or conversational transitions. Provide ONLY the summary itself in one or two short paragraphs. Do not add any 'Key Elements' list, bullet points, or extra headings.",
        updatedHistory,
        currentContent,
        currentType
      );

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: coachText,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => {
        const next = [...prev, coachMsg];
        localStorage.setItem(`${CHAT_STORAGE_PREFIX}${activeId}`, JSON.stringify(next));
        return next;
      });
    } catch (e) {
      console.error('Failed to get essay summary', e);
    } finally {
      setIsTyping(false);
    }
  }, [essayId]);

  return {
    chatHistory,
    isAnalyzing,
    isTyping,
    analyze,
    sendMessage,
    clearChat,
    summarize
  };
}
