import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Star, Clock, Activity as ActivityIcon } from 'lucide-react';
import Card from '../components/Card';
import './Activities.css';

export default function Activities() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initQuery = searchParams.get('search') || '';
  const cityQuery = searchParams.get('city') || '';

  const [activeFilter, setActiveFilter] = useState('All');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initQuery);
  const [activeCity, setActiveCity] = useState(cityQuery);

  const filters = ['All', 'Cultural', 'Nature', 'Historic', 'Architecture'];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const clientId = import.meta.env.VITE_FOURSQUARE_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_FOURSQUARE_CLIENT_SECRET;
        const limit = 50; // Use all available places in the API (Foursquare search scales better)
        
        const targetLocation = activeCity ? `${activeCity}, Morocco` : 'Morocco';
        const url = `https://api.foursquare.com/v2/venues/explore?near=${encodeURIComponent(targetLocation)}&section=outdoors&limit=${limit}&venuePhotos=1&client_id=${clientId}&client_secret=${clientSecret}&v=20231010`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.response && data.response.groups && data.response.groups.length > 0) {
            const fetchPexelsImage = async (name) => {
                try {
                    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
                    if (!apiKey) return null;
                    const search = encodeURIComponent(`${name} morocco`);
                    const u = `https://api.pexels.com/v1/search?query=${search}&per_page=1&orientation=landscape`;
                    const r = await fetch(u, {
                        headers: { Authorization: apiKey }
                    });
                    const j = await r.json();
                    if (j.photos && j.photos.length > 0) {
                        return j.photos[0].src.large2x || j.photos[0].src.large;
                    }
                } catch(e) {
                    console.error("Pexels fetch failed:", e);
                }
                return null;
            };

            const items = data.response.groups[0].items;
            const mapped = await Promise.all(items.map(async (item, i) => {
                const venue = item.venue;
                let categoryName = venue.categories.length > 0 ? venue.categories[0].name : 'Cultural';
                
                let type = 'Cultural';
                if (categoryName.includes('Park') || categoryName.includes('Beach') || categoryName.includes('Mountain') || categoryName.includes('Camp')) type = 'Nature';
                else if (categoryName.includes('Museum') || categoryName.includes('Historic') || categoryName.includes('Ruins')) type = 'Historic';
                else if (categoryName.includes('Mosque') || categoryName.includes('Palace')) type = 'Architecture';

                let imageUrl = null;
                try {
                    const venuePhoto = venue.photos?.groups?.[0]?.items?.[0];
                    if (venuePhoto) {
                        let suffix = venuePhoto.suffix;
                        if (!suffix.startsWith('/')) suffix = '/' + suffix;
                        imageUrl = `${venuePhoto.prefix}original${suffix}`;
                    }
                } catch(e) {}

                if (!imageUrl) {
                    imageUrl = await fetchPexelsImage(venue.name);
                }

                if (!imageUrl) {
                    const fallbacks = [
                        "https://images.unsplash.com/photo-1544390558-75276c125d02?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1552086202-ce44bd7426f8?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1530053969600-caedc5a19eca?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800"
                    ];
                    imageUrl = fallbacks[i % fallbacks.length];
                }

                return {
                    id: venue.id,
                    name: venue.name,
                    image: imageUrl,
                    city: venue.location.city || venue.location.state || 'Morocco',
                    rating: (Math.random() * 0.8 + 4.2).toFixed(1),
                    duration: `${Math.floor(Math.random() * 3) + 1} hours`,
                    type: type,
                    aiRecommended: i < 3
                };
            }));
            setActivities(mapped);
        }
      } catch (error) {
        console.error("Foursquare Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [activeCity]);

  return (
    <div className="activities-container page-content glass">
      <div className="activities-header">
        <h2>{activeCity ? `Activities in ${activeCity}` : 'Local Activities'}</h2>
        <div className="activities-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
        {loading ? (
          <div className="text-center py-12 text-white w-full" style={{ gridColumn: '1 / -1' }}>Fetching real Morocco activities...</div>
        ) : activities.length > 0 ? (
          activities.filter(a => {
            const matchesCategory = activeFilter === 'All' || a.type === activeFilter;
            const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  a.city.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          }).map(act => (
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
                <div className="act-details-row text-xs text-stone-500 flex gap-3 mt-1">
                  <span className="act-duration flex items-center gap-1"><Clock size={12} /> {act.duration}</span>
                  <span className="act-city flex items-center gap-1"><ActivityIcon size={12} /> {act.city}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-white w-full" style={{ gridColumn: '1 / -1' }}>Aucune activité trouvée.</div>
        )}
      </div>
    </div>
  );
}
