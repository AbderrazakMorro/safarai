import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import Card from '../components/Card';
import './Destinations.css';
import MOCK_CITIES from '../data/cities.json';

const DestinationCard = ({ dest }) => {
  const [imageUrl, setImageUrl] = useState(dest.fallbackImage);
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to fetch Pexels imagery to provide maximum diversity
    let isMounted = true;
    const fetchPexelsImage = async () => {
      try {
        const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (!apiKey) {
            console.warn("No Pexels API Key found");
            return;
        }
        const search = encodeURIComponent(`${dest.cityName} morocco city skyline`);
        const u = `https://api.pexels.com/v1/search?query=${search}&per_page=1&orientation=landscape`;
        const r = await fetch(u, {
            headers: {
                Authorization: apiKey
            }
        });
        const j = await r.json();
        if (j.photos && j.photos.length > 0 && isMounted) {
            setImageUrl(j.photos[0].src.large2x || j.photos[0].src.large);
        }
      } catch(e) {
          console.error("Pexels fetch failed:", e);
      }
    };

    // Slight random delay to prevent API bottleneck
    const timeoutId = setTimeout(() => {
      fetchPexelsImage();
    }, Math.random() * 800);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [dest.cityName]);

  return (
    <Card hoverable className="destination-card" onClick={() => navigate(`/activities?city=${encodeURIComponent(dest.cityName)}`)}>
      <div className="dest-image-wrapper">
        <img src={imageUrl} alt={dest.name} className="dest-image" loading="lazy" />
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
  );
};

export default function Destinations() {
  const location = useLocation();
  const initQuery = new URLSearchParams(location.search).get('search') || '';

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initQuery);
  const [destinations, setDestinations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    // Cities loading synchronously from local JSON avoids API downtime
    const photos = [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b",
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70",
      "https://images.unsplash.com/photo-1544390558-75276c125d02",
      "https://images.unsplash.com/photo-1552086202-ce44bd7426f8",
      "https://images.unsplash.com/photo-1582293041079-7814c2f12063",
      "https://images.unsplash.com/photo-1530053969600-caedc5a19eca",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1489745028170-e4d6eb230a10",
      "https://images.unsplash.com/photo-1548661710-7f540c9f56d6",
      "https://images.unsplash.com/photo-1533008988647-73d09a5ec9cf"
    ];

    const mapped = MOCK_CITIES.map((city, index) => {
      let climate = 'Sunny';
      if (['Ifrane', 'Azrou', 'Midelt', 'Azilal', 'Khenifra'].includes(city)) climate = 'Cold';
      else if (['Agadir', 'Dakhla', 'Essaouira', 'Taghazout'].includes(city)) climate = 'Tropical';
      else if (['Tangier', 'Tetouan', 'Rabat', 'Casablanca', 'Kenitra'].includes(city)) climate = 'Mild';
      else climate = 'Sunny';

      const price = index % 5 === 0 ? "$$$" : index % 2 === 0 ? "$$" : "$";

      return {
        id: index,
        cityName: city,
        name: city + ", Morocco",
        fallbackImage: photos[index % photos.length] + "?auto=format&fit=crop&q=80&w=800",
        rating: (Math.random() * 0.8 + 4.2).toFixed(1),
        price,
        climate,
        aiRecommended: index < 6
      };
    });

    setDestinations(mapped);
  }, []);

  const filters = ['All', 'Sunny', 'Cold', 'Tropical', 'Mild'];

  const filteredDestinations = destinations.filter(d => {
    const matchesCategory = activeFilter === 'All' || d.climate === activeFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="destinations-container page-content glass">
      <div className="destinations-header">
        <h2>Explore Destinations</h2>
        <div className="destinations-controls">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search places..."
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

      <div className="destinations-grid">
        {filteredDestinations.slice(0, visibleCount).map(dest => (
          <DestinationCard key={dest.id} dest={dest} />
        ))}
      </div>

      {visibleCount < filteredDestinations.length && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="bg-surface-container-high hover:bg-surface-container-highest text-stone-600 px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm border border-outline-variant/20"
          >
            Load More Places
          </button>
        </div>
      )}
    </div>
  );
}