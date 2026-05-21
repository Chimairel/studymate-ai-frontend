import React from 'react';
import { Essay } from '../../services/essayService';
import Badge from '../ui/Badge';

interface EssayCardProps {
  essay: Essay;
  onClick?: () => void;
}

export const EssayCard: React.FC<EssayCardProps> = ({ essay, onClick }) => {
  const getEmojiForType = (type: string) => {
    switch (type) {
      case 'Argumentative': return '📰';
      case 'Expository': return '🌿';
      case 'Analytical': return '🏙️';
      case 'Narrative': return '📘';
      default: return '📄';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Argumentative': return 'blue';
      case 'Expository': return 'green';
      case 'Analytical': return 'muted';
      case 'Narrative': return 'gold';
      default: return 'muted';
    }
  };

  const getContentPreview = (content: string) => {
    const plainText = content.replace(/[#*`_]/g, ''); // strip markdown-like chars
    if (plainText.length <= 110) return plainText;
    return plainText.substring(0, 110).trim() + '...';
  };

  return (
    <div className="card essay-card" onClick={onClick}>
      <div className="essay-card-header">
        <div className="essay-card-icon">{getEmojiForType(essay.type)}</div>
        <div className="essay-card-score">{essay.score || '--'}</div>
      </div>
      <div className="essay-card-title">{essay.title || 'Untitled Essay'}</div>
      <div className="essay-card-preview">{getContentPreview(essay.content || '')}</div>
      <div className="essay-card-footer">
        <Badge variant={getBadgeVariant(essay.type)}>{essay.type}</Badge>
        <div className="essay-card-meta">{essay.wordCount?.toLocaleString() || 0} words</div>
      </div>
    </div>
  );
};

export default EssayCard;
