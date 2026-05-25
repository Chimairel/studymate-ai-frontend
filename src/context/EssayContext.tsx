"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Essay, essayService } from '../services/essayService';
import { useAuth } from './AuthContext';

interface EssayContextType {
  essays: Essay[];
  currentEssay: Essay | null;
  isLoading: boolean;
  loadEssays: () => Promise<void>;
  getEssay: (id: string) => Promise<Essay | null>;
  addEssay: (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative') => Promise<Essay | null>;
  updateEssay: (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>) => Promise<Essay | null>;
  deleteEssay: (id: string) => Promise<boolean>;
  setCurrentEssay: (essay: Essay | null) => void;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export function EssayProvider({ children }: { children: ReactNode }) {
  const { token, isLoading: authLoading } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssayState] = useState<Essay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEssays = async () => {
    if (authLoading) return;
    if (!token) {
      setEssays([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await essayService.getEssays();
      setEssays(data);
      
      // Keep currentEssay in sync with updated list if it is set
      if (currentEssay) {
        const updated = data.find(e => e.id === currentEssay.id);
        if (updated) {
          setCurrentEssayState(updated);
        } else {
          setCurrentEssayState(null);
        }
      }
    } catch (e) {
      console.error('Failed to load essays', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => {
        loadEssays();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  const getEssay = async (id: string): Promise<Essay | null> => {
    return await essayService.getEssayById(id);
  };

  const addEssay = async (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative'): Promise<Essay | null> => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = content.length;
    
    try {
      const newEssay = await essayService.createEssay({
        title,
        content,
        type,
        score: 0,
        wordCount,
        charCount,
        subScores: {
          structure: 0,
          argument: 0,
          clarity: 0,
          grammar: 0,
          evidence: 0
        },
        feedback: []
      });

      await loadEssays();
      setCurrentEssayState(newEssay);
      return newEssay;
    } catch (e) {
      console.error('Failed to add essay', e);
      return null;
    }
  };

  const updateEssay = async (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>): Promise<Essay | null> => {
    try {
      const updated = await essayService.updateEssay(id, updates);
      await loadEssays();
      return updated;
    } catch (e) {
      console.error('Failed to update essay', e);
      return null;
    }
  };

  const deleteEssay = async (id: string): Promise<boolean> => {
    try {
      const success = await essayService.deleteEssay(id);
      if (success) {
        if (currentEssay?.id === id) {
          setCurrentEssayState(null);
        }
        await loadEssays();
      }
      return success;
    } catch (e) {
      console.error('Failed to delete essay', e);
      return false;
    }
  };

  const setCurrentEssay = (essay: Essay | null) => {
    setCurrentEssayState(essay);
  };

  return (
    <EssayContext.Provider value={{
      essays,
      currentEssay,
      isLoading,
      loadEssays,
      getEssay,
      addEssay,
      updateEssay,
      deleteEssay,
      setCurrentEssay
    }}>
      {children}
    </EssayContext.Provider>
  );
}

export function useEssay() {
  const context = useContext(EssayContext);
  if (context === undefined) {
    throw new Error('useEssay must be used within an EssayProvider');
  }
  return context;
}
