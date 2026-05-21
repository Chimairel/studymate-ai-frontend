"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Essay, essayService } from '../services/essayService';

interface EssayContextType {
  essays: Essay[];
  currentEssay: Essay | null;
  isLoading: boolean;
  loadEssays: () => void;
  getEssay: (id: string) => Essay | null;
  addEssay: (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative') => Essay;
  updateEssay: (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>) => Essay | null;
  deleteEssay: (id: string) => boolean;
  setCurrentEssay: (essay: Essay | null) => void;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export function EssayProvider({ children }: { children: ReactNode }) {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [currentEssay, setCurrentEssayState] = useState<Essay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEssays = () => {
    setIsLoading(true);
    try {
      const data = essayService.getEssays();
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
    loadEssays();
  }, []);

  const getEssay = (id: string): Essay | null => {
    return essayService.getEssayById(id);
  };

  const addEssay = (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative'): Essay => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const charCount = content.length;
    
    const newEssay = essayService.createEssay({
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

    loadEssays();
    setCurrentEssayState(newEssay);
    return newEssay;
  };

  const updateEssay = (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>): Essay | null => {
    const updated = essayService.updateEssay(id, updates);
    loadEssays();
    return updated;
  };

  const deleteEssay = (id: string): boolean => {
    const success = essayService.deleteEssay(id);
    if (success) {
      if (currentEssay?.id === id) {
        setCurrentEssayState(null);
      }
      loadEssays();
    }
    return success;
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
