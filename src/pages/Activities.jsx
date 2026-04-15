import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Activity } from 'lucide-react';
import Card from '../components/Card';
import './Activities.css';

const MOCK_ACTIVITIES = [
  { id: 1, name: "Scuba Diving", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800", rating: 4.9, duration: "3 hours", type: "Water", aiRecommended: true },
  { id: 2, name: "Mountain Hiking", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800", rating: 4.8, duration: "5 hours", type: "Nature", aiRecommended: true },
  { id: 3, name: "City Food Tour", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", rating: 4.7, duration: "2 hours", type: "Urban", aiRecommended: false },
  { id: 4, name: "Desert Safari", image: "https://images.unsplash.com/photo-1544390558-75276c125d02?auto=format&fit=crop&q=80&w=800", rating: 4.6, duration: "4 hours", type: "Nature", aiRecommended: false },
  { id: 5, name: "Museum Visit", image: "https://images.unsplash.com/photo-1518998053401-b15318ca029c?auto=format&fit=crop&q=80&w=800", rating: 4.5, duration: "3 hours", type: "Culture", aiRecommended: false },
];

export default function Activities() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Water', 'Nature', 'Urban', 'Culture'];

  return (
    <div className="activities-container page-content glass">
      <div className="activities-header">
        <h2>Local Activities</h2>
        <div className="activities-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search activities..." />
          </div>
          <button className="filter-btn glass">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="filter-pills">
        {filters.map(f => (
          <button 
            key={f} 
            className={`pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="activities-grid">
        {MOCK_ACTIVITIES.filter(a => activeFilter === 'All' || a.type === activeFilter).map(act => (
          <Card key={act.id} hoverable className="activity-card">
            <div className="act-image-wrapper">
              <img src={act.image} alt={act.name} className="act-image" loading="lazy" />
              {act.aiRecommended && (
                <div className="ai-badge">
                  <Star size={12} fill="currentColor" /> AI Top Pick
                </div>
              )}
            </div>
            <div className="act-info">
              <div className="act-title-row">
                <h3 className="act-name">{act.name}</h3>
                <span className="act-rating"><Star size={14} className="star-icon" fill="currentColor" /> {act.rating}</span>
              </div>
              <div className="act-details-row">
                <span className="act-duration"><Clock size={14} /> {act.duration}</span>
                <span className="act-type"><Activity size={14} /> {act.type}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
