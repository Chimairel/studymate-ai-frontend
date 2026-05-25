import React from 'react';
import { Essay } from '../../services/essayService';
import Badge from '../ui/Badge';

interface EssayCardProps {
  essay: Essay;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onDeleteToggle?: (e: React.MouseEvent) => void;
}

export const EssayCard: React.FC<EssayCardProps> = ({ 
  essay, 
  onClick,
  isFavorite = false,
  onFavoriteToggle,
  onDeleteToggle
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    <div 
      className={`card essay-card ${isFavorite ? 'favorited-card' : ''}`} 
      onClick={onClick}
      style={isFavorite ? {
        border: '1.5px solid var(--accent)',
        boxShadow: '0 4px 20px rgba(200, 75, 49, 0.08)',
        background: 'white',
        position: 'relative'
      } : {
        position: 'relative'
      }}
    >
      <div className="essay-card-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="essay-card-icon">{getEmojiForType(essay.type)}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isFavorite && (
            <div title="Favorited" style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)', marginRight: '2px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          )}
          <div className="essay-card-score">{essay.score || '--'}</div>
          
          {/* Kebab Options Dropdown Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(prev => !prev);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: isMenuOpen ? 'var(--ink)' : 'var(--muted)',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background 0.15s, color 0.15s',
                outline: 'none',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = isMenuOpen ? 'var(--ink)' : 'var(--muted)';
              }}
              title="Options"
            >
              ⋮
            </button>
            
            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  zIndex: 10,
                  minWidth: '120px',
                  marginTop: '4px',
                  overflow: 'hidden'
                }}
              >
                {onFavoriteToggle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onFavoriteToggle(e);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12.5px',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--cream)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    {isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                )}
                {onDeleteToggle && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDeleteToggle(e);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12.5px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                      borderTop: '1px solid var(--border)',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
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
