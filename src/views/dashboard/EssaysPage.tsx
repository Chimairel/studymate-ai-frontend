"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEssay } from '../../hooks/useEssay';
import EssayCard from '../../components/essays/EssayCard';
import Link from 'next/link';

export const EssaysPage: React.FC = () => {
  const router = useRouter();
  const { essays, setCurrentEssay, deleteEssay, isLoading } = useEssay();
  const [filterType, setFilterType] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('studymate_favorite_essays');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const toggleFavorite = (essayId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds(prev => {
      const isAlreadyFav = prev.includes(essayId);
      if (!isAlreadyFav && prev.length >= 3) {
        alert('You can only have a maximum of 3 favorite essays. Please unfavorite another essay first.');
        return prev;
      }
      const next = isAlreadyFav ? prev.filter(id => id !== essayId) : [...prev, essayId];
      localStorage.setItem('studymate_favorite_essays', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteEssay = async (essayId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this essay? This action cannot be undone.')) {
      const success = await deleteEssay(essayId);
      if (success) {
        setFavoriteIds(prev => {
          const next = prev.filter(id => id !== essayId);
          localStorage.setItem('studymate_favorite_essays', JSON.stringify(next));
          return next;
        });
      } else {
        alert('Failed to delete the essay. Please try again.');
      }
    }
  };

  const handleEssayClick = (essay: any) => {
    setCurrentEssay(essay);
    router.push(`/dashboard/editor?id=${essay.id}`);
  };

  const handleCreateNew = () => {
    setCurrentEssay(null);
    router.push('/dashboard/editor');
  };

  if (isLoading) {
    return (
      <div>
        <div className="content-header">
          <div>
            <div className="skeleton" style={{ height: '32px', width: '180px', marginBottom: '8px' }}></div>
            <div className="skeleton" style={{ height: '18px', width: '220px' }}></div>
          </div>
          <div className="flex-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div className="skeleton" style={{ height: '38px', width: '200px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ height: '38px', width: '160px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ height: '38px', width: '120px', borderRadius: '8px' }}></div>
          </div>
        </div>

        <div className="content-body">
          <div className="essays-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: '180px', width: '100%', borderRadius: '12px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter & Search Logic
  const filteredEssays = essays.filter((essay) => {
    const matchesType = 
      filterType === 'All Types' 
        ? true 
        : filterType === 'Favorites'
          ? favoriteIds.includes(essay.id)
          : essay.type === filterType;
          
    const matchesSearch = essay.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          essay.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort so that favorited essays appear first at the top of the list
  const sortedFilteredEssays = [...filteredEssays].sort((a, b) => {
    const aFav = favoriteIds.includes(a.id);
    const bFav = favoriteIds.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">My Essays</h1>
          <p className="page-subtitle">{essays.length} essays across all types</p>
        </div>
        <div className="flex-row" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Search essays..." 
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '200px', padding: '8px 12px', fontSize: '13px' }}
          />
          <select 
            className="form-input" 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '160px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer' }}
          >
            <option value="All Types">All Types</option>
            <option value="Favorites">Favorites</option>
            <option value="Argumentative">Argumentative</option>
            <option value="Expository">Expository</option>
            <option value="Analytical">Analytical</option>
            <option value="Narrative">Narrative</option>
          </select>
          <button onClick={handleCreateNew} className="btn btn-primary">
            + New Essay
          </button>
        </div>
      </div>

      <div className="content-body">
        <div className="essays-grid">
          {sortedFilteredEssays.map((essay) => (
            <EssayCard 
              key={essay.id} 
              essay={essay} 
              isFavorite={favoriteIds.includes(essay.id)}
              onFavoriteToggle={(e) => toggleFavorite(essay.id, e)}
              onDeleteToggle={(e) => handleDeleteEssay(essay.id, e)}
              onClick={() => handleEssayClick(essay)} 
            />
          ))}

          {/* Dotted Create Card */}
          <div 
            className="card essay-card"
            style={{
              background: 'var(--cream)',
              border: '1.5px dashed var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              cursor: 'pointer',
              minHeight: '180px',
              textAlign: 'center'
            }}
            onClick={handleCreateNew}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px', color: 'var(--accent)', fontWeight: '300' }}>+</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Start a New Essay</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Get AI coaching instantly</div>
          </div>
        </div>

        {filteredEssays.length === 0 && searchQuery !== '' && (
          <div style={{ textAlign: 'center', padding: '48px 12px', color: 'var(--muted)' }}>
            <p style={{ fontSize: '14px' }}>No essays found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssaysPage;
