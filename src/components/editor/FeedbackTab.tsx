import React from 'react';
import { FeedbackSuggestion } from '../../services/essayService';

interface FeedbackTabProps {
  feedback: FeedbackSuggestion[];
  onApplySuggestion?: (original: string, suggestion: string) => void;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({
  feedback,
  onApplySuggestion
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'structure': return '📐 Structure';
      case 'clarity': return '✨ Clarity';
      case 'grammar': return '📝 Word Choice';
      case 'style': return '💬 Style';
      default: return '💡 Tip';
    }
  };

  if (feedback.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--muted)' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
        <p style={{ fontSize: '13px' }}>No suggestions yet. Write some content and click "Save & Analyze" to get coach feedback.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
        {feedback.length} {feedback.length === 1 ? 'suggestion' : 'suggestions'} for this draft
      </p>
      {feedback.map((item) => (
        <div key={item.id} className="feedback-item">
          <div className={`feedback-type ${item.type}`}>
            {getTypeLabel(item.type)}
          </div>
          <p dangerouslySetInnerHTML={{ __html: item.message }} />
          {item.original && item.suggestion && (
            <>
              <div className="original">"{item.original}"</div>
              <div className="suggestion">Try: "{item.suggestion}"</div>
              {onApplySuggestion && (
                <button 
                  className="apply-btn"
                  onClick={() => onApplySuggestion(item.original!, item.suggestion!)}
                  type="button"
                >
                  Apply suggestion →
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FeedbackTab;
