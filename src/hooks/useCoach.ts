"use client";

import { useState, useEffect, useCallback } from 'react';
import { coachService, ChatMessage } from '../services/coachService';
import { essayService } from '../services/essayService';
import { useEssay } from '../context/EssayContext';

export function useCoach(essayId: string | undefined) {
  const { updateEssay, currentEssay } = useEssay();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history
  useEffect(() => {
    if (!essayId) {
      setChatHistory([]);
      return;
    }

    let isMounted = true;
    const loadChat = async () => {
      try {
        const messages = await essayService.getChatMessages(essayId);
        if (isMounted) {
          if (messages && messages.length > 0) {
            setChatHistory(messages);
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
            // Pre-populate welcome message on the server
            await essayService.saveChatMessage(essayId, 'coach', defaultWelcome[0].text);
          }
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
        if (isMounted) {
          setChatHistory([
            {
              id: 'welcome',
              sender: 'coach',
              text: `Hi there! I'm your AI Writing Coach. Click the "Save & Analyze" button at the top to generate detailed scores and revision tips, or ask me any question in the chat!`,
              timestamp: new Date().toISOString()
            }
          ]);
        }
      }
    };

    loadChat();

    return () => {
      isMounted = false;
    };
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
      const alertText = `Analysis complete! Your essay scored **${result.score}/100**. I've populated the **Feedback** and **Score** tabs with breakdown details. Let me know if you want to work on any specific suggestion!`;
      
      const savedMsg = await essayService.saveChatMessage(essayId, 'coach', alertText);
      setChatHistory(prev => [...prev, savedMsg]);

      return updatedEssay;
    } catch (e: any) {
      console.error('Analysis failed', e);
      const serverError = e.response?.data?.message;
      alert(serverError || 'AI Coach analysis failed or was interrupted. Please check your network or try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [essayId, updateEssay]);

  const sendMessage = useCallback(async (text: string) => {
    if (!essayId || !text.trim()) return;

    setIsTyping(true);
    try {
      const savedUserMsg = await essayService.saveChatMessage(essayId, 'user', text.trim());
      
      let updatedHistory: ChatMessage[] = [];
      setChatHistory(prev => {
        updatedHistory = [...prev, savedUserMsg];
        return updatedHistory;
      });

      const essayContent = currentEssay?.content || '';
      const essayType = currentEssay?.type || 'Argumentative';

      const coachText = await coachService.getChatReply(text, updatedHistory, essayContent, essayType);
      const savedCoachMsg = await essayService.saveChatMessage(essayId, 'coach', coachText);

      setChatHistory(prev => [...prev, savedCoachMsg]);
    } catch (e) {
      console.error('Failed to get coach reply or save message', e);
    } finally {
      setIsTyping(false);
    }
  }, [essayId, currentEssay]);

  const clearChat = useCallback(async () => {
    if (!essayId) return;
    try {
      await essayService.clearChatHistory(essayId);
      const defaultWelcome: ChatMessage[] = [
        {
          id: 'welcome',
          sender: 'coach',
          text: `Hi there! I'm your AI Writing Coach. Ask me any question in the chat!`,
          timestamp: new Date().toISOString()
        }
      ];
      setChatHistory(defaultWelcome);
      await essayService.saveChatMessage(essayId, 'coach', defaultWelcome[0].text);
    } catch (e) {
      console.error('Failed to clear chat history', e);
    }
  }, [essayId]);

  const summarize = useCallback(async (currentContent: string, currentType: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative', customId?: string) => {
    const activeId = customId || essayId;
    if (!activeId || !currentContent.trim()) return;

    setIsTyping(true);
    try {
      const savedUserMsg = await essayService.saveChatMessage(activeId, 'user', 'Please summarize my essay.');
      
      let updatedHistory: ChatMessage[] = [];
      setChatHistory(prev => {
        updatedHistory = [...prev, savedUserMsg];
        return updatedHistory;
      });

      const coachText = await coachService.getChatReply(
        "Please provide a concise and direct summary of this essay draft. Write the summary from the exact same perspective, voice, and tone as the essay itself (e.g., do not refer to the essay in the third-person like 'The essay argues...', 'The text discusses...', or 'The author writes...'). Do not include any conversational greeting, meta-feedback, coaching remarks, or conversational transitions. Provide ONLY the summary itself in one or two short paragraphs. Do not add any 'Key Elements' list, bullet points, or extra headings.",
        updatedHistory,
        currentContent,
        currentType
      );

      const savedCoachMsg = await essayService.saveChatMessage(activeId, 'coach', coachText);
      setChatHistory(prev => [...prev, savedCoachMsg]);
    } catch (e) {
      console.error('Failed to get essay summary or save message', e);
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
