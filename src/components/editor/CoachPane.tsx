"use client";

import React from 'react';
import FeedbackTab from './FeedbackTab';
import ChatTab from './ChatTab';
import ScoreTab from './ScoreTab';
import { FeedbackSuggestion, SubScores } from '../../services/essayService';
import { ChatMessage } from '../../services/coachService';

interface CoachPaneProps {
  activeTab: 'feedback' | 'chat' | 'score';
  onTabChange: (tab: 'feedback' | 'chat' | 'score') => void;
  feedback: FeedbackSuggestion[];
  onApplySuggestion?: (original: string, suggestion: string) => void;
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  score: number;
  subScores?: SubScores;
  isAnalyzing: boolean;
}

export const CoachPane: React.FC<CoachPaneProps> = ({
  activeTab,
  onTabChange,
  feedback,
  onApplySuggestion,
  messages,
  isTyping,
  onSendMessage,
  score,
  subScores,
  isAnalyzing
}) => {
  return (
    <div className="coach-panel">
      {/* Coach Header */}
      <div className="coach-panel-header">
        <div className="coach-identity">
          <div className="coach-avatar">✦</div>
          <div>
            <div className="coach-name">Essay Coach</div>
            <div className="coach-status" style={{ color: isAnalyzing ? 'var(--accent)' : 'var(--green)' }}>
              {isAnalyzing ? '● Analyzing draft' : '● Ready to help'}
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" type="button" style={{ padding: '4px' }}>
          ⚙
        </button>
      </div>

      {/* Tabs list */}
      <div className="coach-tabs">
        <div 
          className={`coach-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => onTabChange('feedback')}
        >
          Feedback
        </div>
        <div 
          className={`coach-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => onTabChange('chat')}
        >
          Chat
        </div>
        <div 
          className={`coach-tab ${activeTab === 'score' ? 'active' : ''}`}
          onClick={() => onTabChange('score')}
        >
          Score
        </div>
      </div>

      {/* Active Tab View */}
      <div className="coach-body" style={{ display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'feedback' && (
          <FeedbackTab 
            feedback={feedback} 
            onApplySuggestion={onApplySuggestion} 
          />
        )}
        {activeTab === 'chat' && (
          <ChatTab 
            messages={messages} 
            isTyping={isTyping} 
            onSendMessage={onSendMessage} 
          />
        )}
        {activeTab === 'score' && (
          <ScoreTab 
            score={score} 
            subScores={subScores} 
          />
        )}
      </div>
    </div>
  );
};

export default CoachPane;
