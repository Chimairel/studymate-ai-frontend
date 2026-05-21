import api from './api';
import { Essay, FeedbackSuggestion, SubScores } from './essayService';

export interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
}

export const coachService = {
  analyzeEssay: async (
    title: string,
    content: string,
    type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative',
    essayId?: string
  ): Promise<{
    score: number;
    subScores: SubScores;
    feedback: FeedbackSuggestion[];
  }> => {
    const response = await api.post('/coach/analyze', {
      content,
      essayType: type,
      essayId,
    });
    
    const result = response.data.data;
    const scores = result.scores || {};
    
    const subScores: SubScores = {
      structure: typeof scores.structure === 'number' ? scores.structure : 0,
      argument: typeof scores.argument === 'number' ? scores.argument : 0,
      clarity: typeof scores.clarity === 'number' ? scores.clarity : (typeof scores.style === 'number' ? scores.style : 0),
      grammar: typeof scores.grammar === 'number' ? scores.grammar : 0,
      evidence: typeof scores.evidence === 'number' ? scores.evidence : (typeof scores.vocabulary === 'number' ? scores.vocabulary : 0),
    };
    
    const feedbackList = Array.isArray(result.feedback) ? result.feedback : [];
    const feedback: FeedbackSuggestion[] = feedbackList.map((item: any) => {
      let itemType = String(item.type || 'style').toLowerCase();
      if (itemType === 'clarity') itemType = 'clarity';
      else if (itemType === 'structure') itemType = 'structure';
      else if (itemType === 'grammar') itemType = 'grammar';
      else itemType = 'style';
      
      return {
        id: item.id || String(Math.random()),
        type: itemType as any,
        message: item.message || item.issue || '',
        original: item.original || undefined,
        suggestion: item.suggestion || undefined,
        accepted: typeof item.accepted === 'boolean' ? item.accepted : false,
      };
    });
    
    return {
      score: typeof scores.overall === 'number' ? scores.overall : 0,
      subScores,
      feedback,
    };
  },

  getChatReply: async (
    message: string,
    history: ChatMessage[],
    essayContent: string,
    essayType: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative'
  ): Promise<string> => {
    // Format history for the Gemini chatbot schema requirements
    const chatHistory = history.map((msg) => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      content: msg.text,
    }));
    
    const response = await api.post('/coach/chat', {
      message,
      essayContent,
      chatHistory,
      essayType,
    });
    
    return response.data.data.reply || 'Sorry, I encountered an issue generating a response.';
  },
  
  // Maintain getMockChatReply as a backward-compatible alias of getChatReply
  getMockChatReply: async (
    message: string,
    history: ChatMessage[],
    essayContent: string = '',
    essayType: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative' = 'Argumentative'
  ): Promise<string> => {
    return coachService.getChatReply(message, history, essayContent, essayType);
  }
};
