import { useState, useEffect } from 'react';

const SAVED_PLACES_KEY = 'safarai_saved_places_v1';
const SAVED_TRIPS_KEY = 'safarai_trips_v1';

export function useSavedPlaces() {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    try {
      const storedPlaces = localStorage.getItem(SAVED_PLACES_KEY);
      if (storedPlaces) setSavedPlaces(JSON.parse(storedPlaces));
      
      const storedTrips = localStorage.getItem(SAVED_TRIPS_KEY);
      if (storedTrips) setSavedTrips(JSON.parse(storedTrips));
    } catch (e) {
      console.error('Failed to load travel data', e);
    }
  }, []);

  const savePlace = (placeData) => {
    // placeData should contain: id (or name), name, category, description, city, etc.
    const newPlace = {
      ...placeData,
      savedAt: new Date().toISOString(),
      id: placeData.id || placeData.name || placeData.stopName 
    };

    setSavedPlaces((prev) => {
      // Check if already saved
      if (prev.some(p => p.id === newPlace.id)) return prev;
      
      const newSaved = [newPlace, ...prev];
      try {
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(newSaved));
      } catch (e) {
        console.error('Failed to save place', e);
      }
      return newSaved;
    });
  };

  const removePlace = (id) => {
    setSavedPlaces((prev) => {
      const newSaved = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(newSaved));
      } catch (e) {
        console.error('Failed to remove place', e);
      }
      return newSaved;
    });
  };

  const isSaved = (id) => {
    return savedPlaces.some(p => p.id === id);
  };

  const saveTrip = (tripData) => {
    // tripData: { id, title, origin, destination, days, itinerary, type: 'roadtrip'|'explore' }
    const newTrip = {
      ...tripData,
      id: tripData.id || `trip-${Date.now()}`,
      savedAt: new Date().toISOString()
    };

    setSavedTrips((prev) => {
      if (prev.some(t => t.id === newTrip.id)) return prev;
      const newSaved = [newTrip, ...prev];
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const removeTrip = (id) => {
    setSavedTrips((prev) => {
      const newSaved = prev.filter(t => t.id !== id);
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  return { savedPlaces, savePlace, removePlace, isSaved, savedTrips, saveTrip, removeTrip };
}
