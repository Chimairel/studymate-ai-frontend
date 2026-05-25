import api from './api';

export interface SubScores {
  structure: number;
  argument: number;
  clarity: number;
  grammar: number;
  evidence: number;
}

export interface FeedbackSuggestion {
  id: string;
  type: 'structure' | 'clarity' | 'grammar' | 'style';
  message: string;
  original?: string;
  suggestion?: string;
  accepted?: boolean;
}

export interface Essay {
  id: string;
  title: string;
  content: string;
  type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative';
  score: number;
  wordCount: number;
  charCount: number;
  createdAt: string;
  updatedAt: string;
  subScores?: SubScores;
  feedback?: FeedbackSuggestion[];
  isFavorite?: boolean;
}

export const essayService = {
  getEssays: async (filters?: any): Promise<Essay[]> => {
    try {
      const response = await api.get('/essays', { params: filters });
      return response.data.data || [];
    } catch (e) {
      console.error('Failed to get essays from API', e);
      return [];
    }
  },

  getEssayById: async (id: string): Promise<Essay | null> => {
    try {
      const response = await api.get(`/essays/${id}`);
      return response.data.data || null;
    } catch (e) {
      console.error(`Failed to get essay ${id} from API`, e);
      return null;
    }
  },

  createEssay: async (essay: Omit<Essay, 'id' | 'createdAt' | 'updatedAt'>): Promise<Essay> => {
    const response = await api.post('/essays', essay);
    return response.data.data;
  },

  updateEssay: async (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>): Promise<Essay | null> => {
    const response = await api.put(`/essays/${id}`, updates);
    return response.data.data || null;
  },

  deleteEssay: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/essays/${id}`);
    return response.data.success || false;
  },

  updateFeedbackItem: async (essayId: string, feedbackId: string, accepted: boolean): Promise<Essay | null> => {
    const response = await api.patch(`/essays/${essayId}/feedback/${feedbackId}`, { accepted });
    return response.data.data || null;
  },

  getChatMessages: async (essayId: string): Promise<any[]> => {
    const response = await api.get(`/essays/${essayId}/chat`);
    return response.data.data || [];
  },

  saveChatMessage: async (essayId: string, sender: 'coach' | 'user', text: string): Promise<any> => {
    const response = await api.post(`/essays/${essayId}/chat`, { sender, text });
    return response.data.data;
  },

  clearChatHistory: async (essayId: string): Promise<boolean> => {
    const response = await api.delete(`/essays/${essayId}/chat`);
    return response.data.success || false;
  }
};
