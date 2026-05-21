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
}

const STORAGE_KEY = 'essaymind_essays_store';

const initialEssays: Essay[] = [
  {
    id: 'essay-1',
    title: 'The Impact of Social Media on Youth Mental Health',
    content: `In the age of Instagram filters, TikTok trends, and Twitter discourse, the mental landscape of today's youth has shifted in ways that previous generations could not have anticipated. Social media platforms, once celebrated as tools of connection, have increasingly been linked to rising rates of anxiety, depression, and low self-esteem among teenagers and young adults. While proponents argue that social media fosters community and self-expression, the weight of psychological research suggests that its unchecked use poses a significant threat to youth mental health.

The first and perhaps most visible mechanism through which social media harms young people is social comparison. Platforms like Instagram are engineered to showcase curated highlights — the best moments, the most flattering angles, the most impressive achievements. For a developing adolescent brain, constant exposure to these idealized representations creates a distorted benchmark for self-worth. Studies from the Royal Society for Public Health found that Instagram ranked as the most harmful platform for young people's mental health, primarily due to its promotion of unrealistic body image and lifestyle expectations.`,
    type: 'Argumentative',
    score: 82,
    wordCount: 842,
    charCount: 4850,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    subScores: {
      structure: 85,
      argument: 80,
      clarity: 78,
      grammar: 90,
      evidence: 75
    },
    feedback: [
      {
        id: 'feed-1',
        type: 'structure',
        message: 'Your introduction is strong, but consider adding a thesis statement that clearly previews your 3 main arguments.'
      },
      {
        id: 'feed-2',
        type: 'clarity',
        message: 'The second paragraph is excellent. The social comparison mechanism is explained with good evidence. Nice work citing the RSPH study.'
      },
      {
        id: 'feed-3',
        type: 'grammar',
        message: 'The phrase "weight of psychological research" is a bit vague.',
        original: 'the weight of psychological research suggests...',
        suggestion: 'a growing body of psychological research confirms...'
      }
    ]
  },
  {
    id: 'essay-2',
    title: 'Climate Change Policy in Southeast Asia',
    content: `Southeast Asia is one of the world's regions most vulnerable to climate change. With extensive coastlines, heavily populated low-lying areas, and a strong reliance on agriculture, countries like Vietnam, Indonesia, and the Philippines face severe threats from rising sea levels, intense typhoons, and changing weather patterns. In response, ASEAN member states have developed a range of national policies aimed at reducing carbon emissions and enhancing climate resilience. However, the effectiveness of these policies varies widely due to governance challenges, economic priorities, and enforcement gaps...`,
    type: 'Expository',
    score: 74,
    wordCount: 1204,
    charCount: 7840,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    subScores: {
      structure: 72,
      argument: 70,
      clarity: 75,
      grammar: 80,
      evidence: 73
    },
    feedback: []
  },
  {
    id: 'essay-3',
    title: 'Urbanization and the Loss of Cultural Identity',
    content: `As cities expand rapidly across the globe, local cultures and historical identities are increasingly overshadowed by a generic globalized landscape. Modern urbanization processes prioritize economic efficiency and standardization, often leading to the displacement of traditional communities and the erasure of local architectural styles. In the context of developing nations, this transition is particularly rapid, causing indigenous traditions and local dialects to face increasing erasure as younger generations migrate to cities and adopt urban lifestyles...`,
    type: 'Analytical',
    score: 79,
    wordCount: 967,
    charCount: 6200,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    subScores: {
      structure: 80,
      argument: 76,
      clarity: 82,
      grammar: 85,
      evidence: 72
    },
    feedback: []
  },
  {
    id: 'essay-4',
    title: 'Should Higher Education Be Free?',
    content: `The debate surrounding free higher education has intensified in recent years, especially in developing countries where financial barriers prevent talented students from accessing university. Proponents of free tuition argue that education is a human right and a powerful engine for social mobility. Opponents, on the other hand, voice concerns about the quality of education under free models, the strain on public finances, and the potential regressive nature of subsidies where wealthier families benefit disproportionately...`,
    type: 'Argumentative',
    score: 68,
    wordCount: 755,
    charCount: 4900,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    subScores: {
      structure: 65,
      argument: 60,
      clarity: 68,
      grammar: 75,
      evidence: 72
    },
    feedback: []
  },
  {
    id: 'essay-5',
    title: 'AI in the Workforce: Threat or Opportunity?',
    content: `Artificial intelligence is fundamentally reshaping the global labor market, prompting both excitement and anxiety across industries. While automation has the capacity to displace workers in routine administrative and manual jobs, history suggests that technological revolutions also create new roles and enhance productivity. The crucial challenge for policymakers lies in managing this transition: upskilling the workforce, updating education systems, and ensuring safety nets for those temporarily left behind in the shift to an AI-driven economy...`,
    type: 'Argumentative',
    score: 85,
    wordCount: 1103,
    charCount: 7120,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    subScores: {
      structure: 88,
      argument: 84,
      clarity: 80,
      grammar: 92,
      evidence: 81
    },
    feedback: []
  }
];

export const essayService = {
  getEssays: (): Essay[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEssays));
      return initialEssays;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialEssays;
    }
  },

  getEssayById: (id: string): Essay | null => {
    const essays = essayService.getEssays();
    return essays.find(e => e.id === id) || null;
  },

  createEssay: (essay: Omit<Essay, 'id' | 'createdAt' | 'updatedAt'>): Essay => {
    const essays = essayService.getEssays();
    const newEssay: Essay = {
      ...essay,
      id: `essay-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newEssay, ...essays];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEssay;
  },

  updateEssay: (id: string, updates: Partial<Omit<Essay, 'id' | 'createdAt'>>): Essay | null => {
    const essays = essayService.getEssays();
    const index = essays.findIndex(e => e.id === id);
    if (index === -1) return null;

    const updatedEssay = {
      ...essays[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    essays[index] = updatedEssay;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(essays));
    return updatedEssay;
  },

  deleteEssay: (id: string): boolean => {
    const essays = essayService.getEssays();
    const filtered = essays.filter(e => e.id !== id);
    if (filtered.length === essays.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
