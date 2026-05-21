"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEssay } from '../../hooks/useEssay';
import EssayCard from '../../components/essays/EssayCard';
import Link from 'next/link';

export const EssaysPage: React.FC = () => {
  const router = useRouter();
  const { essays, setCurrentEssay } = useEssay();
  const [filterType, setFilterType] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleEssayClick = (essay: any) => {
    setCurrentEssay(essay);
    router.push('/dashboard/editor');
  };

  const handleCreateNew = () => {
    setCurrentEssay(null);
    router.push('/dashboard/editor');
  };

  // Filter & Search Logic
  const filteredEssays = essays.filter((essay) => {
    const matchesType = filterType === 'All Types' || essay.type === filterType;
    const matchesSearch = essay.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          essay.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
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
          {filteredEssays.map((essay) => (
            <EssayCard 
              key={essay.id} 
              essay={essay} 
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
