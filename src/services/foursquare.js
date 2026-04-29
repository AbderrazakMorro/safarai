export async function getActivities({ city, coordinates, activityQuery = "" }) {
  // Try to use v3 key if available
  const API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY || import.meta.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
  // Fallback to v2 keys
  const CLIENT_ID = import.meta.env.VITE_FOURSQUARE_CLIENT_ID;
  const CLIENT_SEC = import.meta.env.VITE_FOURSQUARE_CLIENT_SECRET;

  if (!API_KEY && (!CLIENT_ID || !CLIENT_SEC)) {
    console.error("Missing Foursquare API Credentials");
    return { error: "API Key not configured", results: [] };
  }

  // --- v3 IMPLEMENTATION ---
  if (API_KEY) {
    const params = new URLSearchParams({
      categories: '19024,18080,16000',
      sort: 'RELEVANCE',
      limit: '15',
      fields: 'fsq_id,name,location,categories,rating,description,photos'
    });

    if (coordinates && coordinates.lat && coordinates.lng) {
      params.append('ll', `${coordinates.lat},${coordinates.lng}`);
      params.append('radius', '15000');
    } else if (city) {
      params.append('near', `${city}, Morocco`);
    } else {
      return { error: "No location provided", results: [] };
    }

    if (activityQuery.trim()) {
      params.append('query', activityQuery.trim());
    }

    try {
      const response = await fetch(`https://api.foursquare.com/v3/places/search?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Authorization': API_KEY }
      });
      if (response.status === 400 || response.status === 401) {
        return { error: "City not recognized or unauthorized (v3)", results: [] };
      }
      if (!response.ok) return { error: `Foursquare error: ${response.status}`, results: [] };
      const data = await response.json();
      return { error: null, results: data.results || [] };
    } catch (err) {
      return { error: "Failed to fetch activities", results: [] };
    }
  }

  // --- v2 IMPLEMENTATION (Fallback) ---
  const params = new URLSearchParams({
    limit: '15',
    venuePhotos: '1',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SEC,
    v: '20231010'
  });

  if (coordinates && coordinates.lat && coordinates.lng) {
    params.append('ll', `${coordinates.lat},${coordinates.lng}`);
    params.append('radius', '15000');
  } else if (city) {
    params.append('near', `${city}, Morocco`);
  } else {
    return { error: "No location provided", results: [] };
  }

  if (activityQuery.trim()) {
    params.append('query', activityQuery.trim());
  } else {
    params.append('section', 'outdoors');
  }

  try {
    const response = await fetch(`https://api.foursquare.com/v2/venues/explore?${params.toString()}`);
    const data = await response.json();
    if (data?.meta?.code === 400 || data?.meta?.errorType === 'failed_geocode') {
      return { error: `City not recognized: "${city}"`, results: [] };
    }
    if (data?.meta?.code !== 200) {
      return { error: `Foursquare error ${data?.meta?.code || response.status}`, results: [] };
    }

    // Map v2 format to v3-like format for the UI
    const items = data?.response?.groups?.[0]?.items || [];
    const results = items.map(item => {
      const v = item.venue;
      
      // Extract photo from v2 response structure
      let photosArray = [];
      if (item.photo) {
        photosArray.push(item.photo);
      } else if (v.photos?.groups?.[0]?.items?.length > 0) {
        photosArray = v.photos.groups[0].items;
      }

      return {
        fsq_id: v.id,
        name: v.name,
        location: {
          formatted_address: v.location?.formattedAddress?.join(', ') || v.location?.address
        },
        rating: v.rating ? (v.rating / 2).toFixed(1) : null,
        photos: photosArray
      };
    });

    return { error: null, results };
  } catch (err) {
    return { error: "Network error fetching activities", results: [] };
  }
}
