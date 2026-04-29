import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#f8f3e9] ${className}`} />
);

export default function ActivityImage({ activityName, foursquarePhotoUrl, className = '' }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setIsLoading(true);

      if (foursquarePhotoUrl) {
        if (isMounted) {
          setImgUrl(foursquarePhotoUrl);
          setIsLoading(false);
        }
        return;
      }

      try {
        const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (!pexelsKey) {
          throw new Error('Missing Pexels API Key');
        }

        const query = encodeURIComponent(`${activityName} Morocco`);
        const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
          headers: {
            Authorization: pexelsKey
          }
        });

        if (!res.ok) throw new Error('Pexels API failed');

        const data = await res.json();
        if (data.photos && data.photos.length > 0 && isMounted) {
          setImgUrl(data.photos[0].src.large);
        } else if (isMounted) {
          // Fallback to LoremFlickr if Pexels returns no results
          setImgUrl(`https://loremflickr.com/800/600/${encodeURIComponent(activityName)}`);
        }
      } catch (err) {
        console.warn('Image fetch failed, using fallback:', err);
        if (isMounted) {
          setImgUrl(`https://loremflickr.com/800/600/${encodeURIComponent(activityName)}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [activityName, foursquarePhotoUrl]);

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-md ${className}`}>
      {isLoading ? (
        <Skeleton className="w-full h-full absolute inset-0" />
      ) : (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={imgUrl}
          alt={activityName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      )}
      
      {/* Dark gradient overlay at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 pointer-events-none"></div>
    </div>
  );
}
