import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Search, Navigation, AlertCircle } from 'lucide-react';
import { UilSetting, UilMapMarker, UilSun, UilImage } from '@iconscout/react-unicons';
import { getActivities } from '../services/foursquare';
import ActivityImage from './ActivityImage';

const FEATURED_CITIES = [
  { name: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { name: 'Merzouga', lat: 31.0970, lng: -4.0116 },
  { name: 'Agadir', lat: 30.4278, lng: -9.5981 },
];

const getPlaceholderIcon = (act) => {
  const text = (act.name + ' ' + (act.categories?.map(c => c.name).join(' ') || '')).toLowerCase();
  
  if (text.includes('quad')) return UilSetting;
  if (text.includes('camel') || text.includes('tour')) return UilMapMarker;
  if (text.includes('desert') || text.includes('sahara')) return UilSun;
  
  return UilImage;
};

export default function DiscoverySection() {
  const [selectedCity, setSelectedCity] = useState(FEATURED_CITIES[0]);
  const [customCity, setCustomCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchTimeout = useRef(null);

  // Debounce the activity search query
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // If custom city is typed, use that. Otherwise use selected featured city coordinates.
    const params = {
      activityQuery: debouncedQuery,
      ...(customCity ? { city: customCity } : { coordinates: { lat: selectedCity.lat, lng: selectedCity.lng } })
    };

    const { results, error: apiError } = await getActivities(params);

    if (apiError) {
      setError(apiError);
      setActivities([]);
    } else {
      setActivities(results || []);
    }

    setIsLoading(false);
  }, [selectedCity, customCity, debouncedQuery]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleCitySelect = (city) => {
    setCustomCity(''); // Clear custom city when selecting a featured one
    setSelectedCity(city);
  };

  const handleCustomCityChange = (e) => {
    setCustomCity(e.target.value);
    if (e.target.value === '') {
      // Revert back to selected featured city if cleared
      setSelectedCity(FEATURED_CITIES[0]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-[#fef9ee]/80 backdrop-blur-xl border border-[#d4cfc4] rounded-[2rem] shadow-sm relative overflow-hidden">
        {/* Subtle Moroccan geometric background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#c89c5e 1px, transparent 1px), radial-gradient(#c89c5e 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
        
        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c89c5e]" size={18} />
              <input
                type="text"
                placeholder="Custom City (e.g. Fes)..."
                value={customCity}
                onChange={handleCustomCityChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#e0dacd] focus:border-[#004e46] focus:ring-1 focus:ring-[#004e46] outline-none transition-all text-[#1d1c16]"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c89c5e]" size={18} />
              <input
                type="text"
                placeholder="Find an activity (e.g. Quad, Camel)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#e0dacd] focus:border-[#004e46] focus:ring-1 focus:ring-[#004e46] outline-none transition-all text-[#1d1c16]"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-[#6e7977] mr-2">Featured:</span>
            {FEATURED_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  !customCity && selectedCity.name === city.name
                    ? 'bg-[#004e46] text-white border-[#004e46] shadow-md shadow-[#004e46]/20'
                    : 'bg-white text-[#426464] border-[#e0dacd] hover:border-[#004e46]/30 hover:bg-[#f8f3e9]'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle size={20} />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading Skeletons with warm tones
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-[#e0dacd] animate-pulse shadow-sm h-64 flex flex-col justify-between">
              <div>
                <div className="h-40 bg-[#f8f3e9] rounded-2xl mb-4 w-full"></div>
                <div className="h-5 bg-[#f8f3e9] rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-[#f8f3e9] rounded-md w-1/2"></div>
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((act) => {
            // Extract best photo if available
            let fsqPhotoUrl = null;
            if (act.photos && act.photos.length > 0) {
              const p = act.photos[0];
              fsqPhotoUrl = `${p.prefix}original${p.suffix}`;
            }

            return (
              <div key={act.fsq_id} className="group bg-white rounded-3xl overflow-hidden border border-[#e0dacd] hover:border-[#c89c5e]/50 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative cursor-pointer">
                {/* Image Section */}
                <div className="relative h-48 w-full">
                  <ActivityImage 
                    activityName={act.name} 
                    foursquarePhotoUrl={fsqPhotoUrl} 
                    className="w-full h-full"
                  />
                  
                  {/* Rating Badge */}
                  {act.rating && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[#5a4100] shadow-sm z-10">
                      ★ {(act.rating / 2).toFixed(1)}
                    </div>
                  )}
                  
                  {/* Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-xl font-bold text-white mb-0 font-headline leading-tight line-clamp-2 drop-shadow-md">
                      {act.name}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
                  <div className="flex items-start gap-2 text-[#6e7977]">
                    <MapPin size={16} className="shrink-0 mt-0.5 text-[#004e46]/70" />
                    <p className="text-sm font-medium leading-relaxed line-clamp-2">
                      {act.location?.formatted_address || act.location?.address || 'Location unavailable'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !error && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-[#fef9ee]/50 rounded-3xl border border-dashed border-[#d4cfc4]">
              <Search className="text-[#c89c5e] mb-4 opacity-50" size={48} />
              <h3 className="text-xl font-bold text-[#1d1c16] mb-2 font-headline">No adventures found</h3>
              <p className="text-[#6e7977]">Try adjusting your search query or city.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
