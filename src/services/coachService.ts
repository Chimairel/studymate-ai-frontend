import { Essay, FeedbackSuggestion, SubScores } from './essayService';

export interface ChatMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  timestamp: string;
}

export const coachService = {
  analyzeEssay: async (title: string, content: string, type: 'Argumentative' | 'Expository' | 'Analytical' | 'Narrative'): Promise<{
    score: number;
    subScores: SubScores;
    feedback: FeedbackSuggestion[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Simple rule-based mock analysis
    let grammarScore = 85;
    let structureScore = 80;
    let clarityScore = 78;
    let argumentScore = 80;
    let evidenceScore = 75;

    const feedback: FeedbackSuggestion[] = [];

    // Analyze based on text features
    if (wordCount < 100) {
      grammarScore = Math.max(50, grammarScore - 20);
      structureScore = Math.max(40, structureScore - 30);
      clarityScore = Math.max(50, clarityScore - 15);
      feedback.push({
        id: `feed-${Date.now()}-1`,
        type: 'structure',
        message: 'Your essay is very short. A standard academic essay should be at least 300-500 words and contain a clear introduction, body paragraphs, and a conclusion.'
      });
    } else {
      // Check for introduction thesis preview
      const introParagraph = content.split('\n')[0] || '';
      if (!introParagraph.toLowerCase().includes('because') && !introParagraph.toLowerCase().includes('due to') && !introParagraph.toLowerCase().includes('therefore')) {
        structureScore -= 5;
        feedback.push({
          id: `feed-${Date.now()}-1`,
          type: 'structure',
          message: 'Your introduction is off to a decent start, but it lacks a clear thesis statement that previews your main arguments. Consider stating your position explicitly at the end of the first paragraph.'
        });
      } else {
        feedback.push({
          id: `feed-${Date.now()}-1`,
          type: 'clarity',
          message: 'Excellent job outlining your core claims in the introductory paragraph. The thesis statement is clear and sets a strong direction.'
        });
      }

      // Check for grammatical pointers
      const containsCommonErrors = /\b(says|its|their|there|they're)\b/i.test(content);
      if (containsCommonErrors) {
        grammarScore -= 8;
        feedback.push({
          id: `feed-${Date.now()}-2`,
          type: 'grammar',
          message: 'Found some minor word choice and agreement issues in your draft.',
          original: 'the weight of psychological research suggests...',
          suggestion: 'a growing body of psychological research confirms...'
        });
      }

      // Evidentiary checks
      const hasNumbers = /\b\d+\b/.test(content) || /study|percent|research|evidence|data/i.test(content);
      if (!hasNumbers) {
        evidenceScore -= 15;
        feedback.push({
          id: `feed-${Date.now()}-3`,
          type: 'style', // mapped to style/argument
          message: 'You make several assertions without citing concrete facts, studies, or statistics. Supporting your claims with evidence is essential to building a strong argument.'
        });
      } else {
        feedback.push({
          id: `feed-${Date.now()}-3`,
          type: 'style',
          message: 'Good work integrating research/study citations in your draft. This adds significant credibility to your essay.'
        });
      }
    }

    // Adjust sub-scores based on essay type
    if (type === 'Argumentative') {
      argumentScore = Math.min(100, argumentScore + 5);
    } else if (type === 'Analytical') {
      clarityScore = Math.min(100, clarityScore + 5);
    }

    // Round scores
    grammarScore = Math.round(Math.max(10, Math.min(100, grammarScore)));
    structureScore = Math.round(Math.max(10, Math.min(100, structureScore)));
    clarityScore = Math.round(Math.max(10, Math.min(100, clarityScore)));
    argumentScore = Math.round(Math.max(10, Math.min(100, argumentScore)));
    evidenceScore = Math.round(Math.max(10, Math.min(100, evidenceScore)));

    const averageScore = Math.round((grammarScore + structureScore + clarityScore + argumentScore + evidenceScore) / 5);

    return {
      score: averageScore,
      subScores: {
        structure: structureScore,
        argument: argumentScore,
        clarity: clarityScore,
        grammar: grammarScore,
        evidence: evidenceScore
      },
      feedback
    };
  },

  getMockChatReply: async (message: string, history: ChatMessage[]): Promise<string> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const msg = message.toLowerCase();

    if (msg.includes('thesis') || msg.includes('stronger')) {
      return `A strong thesis statement for an essay should do three things:
1. **Take a clear stance** on the topic.
2. **Preview your main supporting points** or evidence.
3. **Be specific** and debatable, rather than a general statement of fact.

For instance, instead of saying *"Social media is bad for teens,"* you could write: *"Social media platforms, particularly Instagram and TikTok, damage youth mental health through peer comparison, cyberbullying, and sleep disruption."* Which of your body paragraph points would you like to build into your thesis?`;
    }

    if (msg.includes('structure') || msg.includes('outline')) {
      return `For this type of essay, the classic 5-paragraph structure works beautifully:
1. **Introduction**: Hook, background context, and your thesis statement.
2. **Body Paragraph 1**: Your strongest point + supporting evidence.
3. **Body Paragraph 2**: Your second-strongest point + supporting evidence.
4. **Body Paragraph 3**: A counterargument and your refutation, OR a third supporting point.
5. **Conclusion**: Restate thesis in a new way, summarize key points, and leave the reader with a final thought.

Would you like me to help you outline one of these paragraphs?`;
    }

    if (msg.includes('grammar') || msg.includes('spell')) {
      return `I've highlighted a few grammar issues in the Feedback panel! Most notably, check subject-verb agreement (e.g., "scientists says" should be "scientists say") and possessive apostrophes (e.g., "its" vs "it's"). Let me know if you'd like to review a specific sentence together!`;
    }

    if (msg.includes('clarity') || msg.includes('improve')) {
      return `To improve clarity, focus on sentence length and active voice. Try to break up sentences that run longer than two lines, and replace passive phrasing (e.g., "the essay was written by me") with active phrasing (e.g., "I wrote the essay"). How does your current draft feel to read aloud?`;
    }

    return `I can help you build a stronger argument, clean up your structure, check your citation evidence, or polish your grammar. What part of this draft are you working on right now?`;
  }
};
