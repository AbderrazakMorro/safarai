import React, { useState } from 'react';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import Card from '../components/Card';
import './Destinations.css';

const MOCK_DESTINATIONS = [
  { id: 1, name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800", rating: 4.8, price: "$$$", climate: "Sunny", aiRecommended: true },
  { id: 2, name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800", rating: 4.9, price: "$$", climate: "Mild", aiRecommended: true },
  { id: 3, name: "Banff, Canada", image: "https://images.unsplash.com/photo-1544627054-072049e290f6?auto=format&fit=crop&q=80&w=800", rating: 4.7, price: "$$", climate: "Cold", aiRecommended: false },
  { id: 4, name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800", rating: 4.6, price: "$", climate: "Tropical", aiRecommended: false },
  { id: 5, name: "Swiss Alps, Switzerland", image: "https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&q=80&w=800", rating: 4.9, price: "$$$", climate: "Cold", aiRecommended: true },
  { id: 6, name: "Marrakech, Morocco", image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800", rating: 4.5, price: "$", climate: "Hot", aiRecommended: false }
];

export default function Destinations() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Sunny', 'Cold', 'Tropical', 'Mild'];

  return (
    <div className="destinations-container page-content glass">
      <div className="destinations-header">
        <h2>Explore Destinations</h2>
        <div className="destinations-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search places..." />
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

      <div className="destinations-grid">
        {MOCK_DESTINATIONS.filter(d => activeFilter === 'All' || d.climate === activeFilter).map(dest => (
          <Card key={dest.id} hoverable className="destination-card">
            <div className="dest-image-wrapper">
              <img src={dest.image} alt={dest.name} className="dest-image" loading="lazy" />
              {dest.aiRecommended && (
                <div className="ai-badge">
                  <Star size={12} fill="currentColor" /> AI Top Pick
                </div>
              )}
            </div>
            <div className="dest-info">
              <div className="dest-title-row">
                <h3 className="dest-name">{dest.name}</h3>
                <span className="dest-rating"><Star size={14} className="star-icon" fill="currentColor" /> {dest.rating}</span>
              </div>
              <div className="dest-details-row">
                <span className="dest-location"><MapPin size={14} /> View Map</span>
                <span className="dest-price">{dest.price}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
