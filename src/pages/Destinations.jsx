import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Trash2, Calendar, Map as MapIcon } from 'lucide-react';
import Card from '../components/Card';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import './Destinations.css';

const TripCard = ({ trip, onRemove }) => {
  const navigate = useNavigate();
  return (
    <Card hoverable className="trip-card group overflow-hidden border border-outline-variant/20 bg-surface-container-low shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.image || `https://loremflickr.com/800/600/morocco,travel?lock=${trip.id}`} 
          alt={trip.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${trip.type === 'roadtrip' ? 'bg-primary text-white' : 'bg-amber-500 text-white'}`}>
               {trip.type}
             </span>
             <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
               <Calendar size={10} /> {new Date(trip.savedAt).toLocaleDateString()}
             </span>
          </div>
          <h4 className="text-xl font-bold font-headline leading-tight">{trip.title}</h4>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(trip.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
          title="Delete journey"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          <span className="flex items-center gap-1"><MapIcon size={12} /> {trip.itinerary?.length || 0} stops</span>
          {trip.days && <span>{trip.days} Days Plan</span>}
        </div>
        <p className="text-sm text-stone-500 line-clamp-2 italic">
          {trip.type === 'roadtrip' 
            ? `Your custom route from ${trip.origin} to ${trip.destination}.` 
            : `Exploring local secrets in ${trip.city}.`}
        </p>
        <button 
          onClick={() => navigate('/trips')}
          className="w-full py-2.5 bg-surface-container-high rounded-xl text-teal-800 font-bold text-xs hover:bg-primary hover:text-white transition-all border border-outline-variant/10"
        >
          View Full Details
        </button>
      </div>
    </Card>
  );
};

const DestinationCard = ({ dest }) => {
  const [imageUrl, setImageUrl] = useState(dest.fallbackImage);
  const navigate = useNavigate();
  const { isSaved, savePlace, removePlace } = useSavedPlaces();

    useEffect(() => {
    let isMounted = true;
    const fetchWikipediaImage = async () => {
      try {
        const search = encodeURIComponent(dest.cityName);
        const u = `https://en.wikipedia.org/w/api.php?action=query&titles=${search}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
        const r = await fetch(u);
        const j = await r.json();
        const pages = j.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].thumbnail && isMounted) {
            setImageUrl(pages[pageId].thumbnail.source);
        } else if (isMounted) {
            setImageUrl(`https://loremflickr.com/800/600/morocco,${search}?lock=${dest.id}`);
        }
      } catch(e) {
          if (isMounted) setImageUrl(`https://loremflickr.com/800/600/morocco,${encodeURIComponent(dest.cityName)}?lock=${dest.id}`);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchWikipediaImage();
    }, Math.random() * 800);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [dest.cityName, dest.id]);

  return (
    <Card hoverable className="destination-card" onClick={() => navigate(`/activities?city=${encodeURIComponent(dest.cityName)}`)}>
      <div className="dest-image-wrapper">
        <img src={imageUrl} alt={dest.name} className="dest-image" loading="lazy" />
        {dest.aiRecommended && (
          <div className="ai-badge">
            <Star size={12} fill="currentColor" /> AI Top Pick
          </div>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            isSaved(dest.cityName) 
              ? removePlace(dest.cityName) 
              : savePlace({ id: dest.cityName, name: dest.cityName, category: 'City', city: dest.cityName, description: `Climate: ${dest.climate}, Budget: ${dest.price}` });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 hover:bg-black/60 transition-all z-20"
          title={isSaved(dest.cityName) ? "Remove from saved" : "Save this place"}
        >
          <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: isSaved(dest.cityName) ? "'FILL' 1" : "'FILL' 0", color: isSaved(dest.cityName) ? '#ef4444' : 'white'}}>bookmark</span>
        </button>
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
  const navigate = useNavigate();
  const initQuery = new URLSearchParams(location.search).get("search") || "";

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initQuery);
  const [destinations, setDestinations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(100); // Display all cities by default

  const { savedTrips, removeTrip } = useSavedPlaces();

    useEffect(() => {
        let isMounted = true;
        const fetchCities = async () => {
            try {
                const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country: "Morocco" })
                });
                const data = await res.json();
                
                if (data && !data.error && data.data && isMounted) {
                    const mapped = data.data.map((city, index) => {
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
                            fallbackImage: `https://loremflickr.com/800/600/morocco,${encodeURIComponent(city.split(' ')[0])}?lock=${index}`,
                            rating: (Math.random() * 0.8 + 4.2).toFixed(1),
                            price,
                            climate,
                            aiRecommended: index < 6
                        };
                    });
                    setDestinations(mapped);
                }
            } catch (error) {
                console.error("Cities fetch failed", error);
            }
        };
        fetchCities();
        
        return () => { isMounted = false; };
    }, []);

  const filters = ['All', 'Sunny', 'Cold', 'Tropical', 'Mild'];

  const filteredDestinations = destinations.filter(d => {
    const matchesCategory = activeFilter === 'All' || d.climate === activeFilter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="destinations-container page-content glass min-h-screen pb-20">
      {/* My Journeys Section */}
      <div className="mb-12 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">My Journeys</h2>
             <p className="text-on-surface-variant text-sm font-medium">Revisit the trips you've curated or taken</p>
          </div>
          {savedTrips.length > 0 && (
             <button 
               onClick={() => navigate('/trips')}
               className="text-primary text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
             >
               Plan New <MapIcon size={12} />
             </button>
          )}
        </div>

        {savedTrips.length === 0 ? (
          <div className="bg-surface-container-low/50 border-2 border-dashed border-outline-variant/30 rounded-[2rem] p-10 text-center">
             <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-stone-300 text-3xl">add_location_alt</span>
             </div>
             <h3 className="text-lg font-bold text-on-surface font-headline mb-1">No saved trips yet</h3>
             <p className="text-sm text-on-surface-variant mb-6 max-w-xs mx-auto">Generate a custom roadtrip to see your adventures appear here.</p>
             <button 
               onClick={() => navigate('/trips')}
               className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
             >
               Go to Roadtrip Planner
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} onRemove={removeTrip} />
            ))}
          </div>
        )}
      </div>

      <div className="h-[1px] w-full bg-outline-variant/10 mb-12"></div>

      <div className="destinations-header">
        <div>
          <h2>Discover Destinations</h2>
          <p className="text-on-surface-variant text-sm font-medium">Find your next perfect stop in the Kingdom</p>
        </div>
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