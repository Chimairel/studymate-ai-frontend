import api from './api';

export interface DashboardStats {
  totalEssays: number;
  avgScore: number;
  streak: number;
  totalWords: number;
  recentEssays: any[];
}

export interface ProgressStats {
  weeklyWords: { week: string; words: number }[];
  scoreTrend: { date: string; score: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
}

export const statsService = {
  getDashboard: async (): Promise<DashboardStats | null> => {
    try {
      const response = await api.get('/stats/dashboard');
      return response.data.data || null;
    } catch (e) {
      console.error('Failed to get dashboard stats', e);
      return null;
    }
  },

  getProgress: async (): Promise<ProgressStats | null> => {
    try {
      const response = await api.get('/stats/progress');
      return response.data.data || null;
    } catch (e) {
      console.error('Failed to get progress stats', e);
      return null;
    }
  },

  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const response = await api.get('/stats/achievements');
      return response.data.data || [];
    } catch (e) {
      console.error('Failed to get achievements', e);
      return [];
    }
  },
};
