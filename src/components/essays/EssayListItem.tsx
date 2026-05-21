import React from 'react';
import { Essay } from '../../services/essayService';

interface EssayListItemProps {
  essay: Essay;
  onClick?: () => void;
}

export const EssayListItem: React.FC<EssayListItemProps> = ({ essay, onClick }) => {
  const getEmojiForType = (type: string) => {
    switch (type) {
      case 'Argumentative': return '📰';
      case 'Expository': return '🌿';
      case 'Analytical': return '🏙️';
      case 'Narrative': return '📘';
      default: return '📄';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffTime = Math.abs(Date.now() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        return 'Today';
      } else if (diffDays === 2) {
        return '1 day ago';
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="essay-list-item" onClick={onClick}>
      <div className="essay-thumb">{getEmojiForType(essay.type)}</div>
      <div className="essay-info">
        <div className="essay-title">{essay.title}</div>
        <div className="essay-meta">
          {essay.type} · {essay.wordCount?.toLocaleString() || 0} words · {formatDate(essay.updatedAt)}
        </div>
      </div>
      <div className="essay-score">{essay.score || '--'}</div>
    </div>
  );
};

export default EssayListItem;
