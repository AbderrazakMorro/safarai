import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Star, Clock, Activity as ActivityIcon } from 'lucide-react';
import Card from '../components/Card';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
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
  const { isSaved, savePlace, removePlace } = useSavedPlaces();

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
            const fetchWikipediaImage = async (name) => {
                try {
                    const u = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name.split(' ')[0])}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
                    const r = await fetch(u);
                    const j = await r.json();
                    const pages = j.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== "-1" && pages[pageId].thumbnail) {
                        return pages[pageId].thumbnail.source;
                    }
                } catch(e) {
                    console.error("Wikipedia fetch failed:", e);
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
                    imageUrl = await fetchWikipediaImage(venue.name);
                }

                if (!imageUrl) {
                    const seed = (venue.id ? venue.id.charCodeAt(0) + venue.id.charCodeAt(venue.id.length-1) : i) % 10000;
                    const cleanCat = categoryName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
                    imageUrl = `https://loremflickr.com/800/600/morocco,${cleanCat}?lock=${seed}`;
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    isSaved(act.name) 
                      ? removePlace(act.name) 
                      : savePlace({ id: act.name, name: act.name, category: act.type, city: act.city, type: 'poi', description: `Recommended duration: ${act.duration}` });
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 hover:bg-black/60 transition-all z-20"
                  title={isSaved(act.name) ? "Remove from saved" : "Save this activity"}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: isSaved(act.name) ? "'FILL' 1" : "'FILL' 0", color: isSaved(act.name) ? '#ef4444' : 'white'}}>bookmark</span>
                </button>
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
