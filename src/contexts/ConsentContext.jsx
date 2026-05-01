import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// EU/EEA + UK country codes for GDPR
const GDPR_COUNTRIES = new Set([
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','GB','IS','LI','NO'
]);

const STORAGE_KEY = 'safarai-consent';
const COOKIE_NAME = 'consent-status';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

// ── Helpers ──────────────────────────────────────────────────────────────────

const setCookie = (name, value, maxAge) => {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredConsent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const persistConsent = (consent) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  setCookie(COOKIE_NAME, JSON.stringify(consent), COOKIE_MAX_AGE);
};

// ── Context ──────────────────────────────────────────────────────────────────

const ConsentContext = createContext(null);

export const useConsent = () => {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
};

/** Check if a specific consent category is granted */
export const hasConsent = (category) => {
  const stored = getStoredConsent();
  if (!stored) return category === 'essential'; // essential always true
  return !!stored[category];
};

// ── Provider ─────────────────────────────────────────────────────────────────

export const ConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(() => {
    const stored = getStoredConsent();
    return stored || { essential: true, analytics: false, personalization: false };
  });

  const [region, setRegion] = useState({ code: null, name: null, regulation: 'standard' });
  const [regionOverride, setRegionOverride] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(!getStoredConsent());
  const [loading, setLoading] = useState(true);

  // Detect region on mount (async, non-blocking)
  useEffect(() => {
    const detect = async () => {
      try {
        const res = await fetch('http://ip-api.com/json/?fields=countryCode,country,regionName,region');
        if (!res.ok) throw new Error('Geo API failed');
        const data = await res.json();

        const cc = data.countryCode || '';
        let regulation = 'standard';

        if (GDPR_COUNTRIES.has(cc)) {
          regulation = 'gdpr';
        } else if (cc === 'US' && data.region === 'CA') {
          regulation = 'ccpa';
        }

        setRegion({ code: cc, name: data.country || cc, regulation });

        // Apply defaults ONLY if no stored consent yet
        if (!getStoredConsent()) {
          if (regulation === 'gdpr') {
            setConsent({ essential: true, analytics: false, personalization: false });
          } else if (regulation === 'ccpa' || regulation === 'standard') {
            setConsent({ essential: true, analytics: true, personalization: true });
          }
        }
      } catch (err) {
        console.warn('[Consent] Geo detection failed, using standard defaults:', err.message);
        setRegion({ code: 'UNKNOWN', name: 'Unknown', regulation: 'standard' });
      } finally {
        setLoading(false);
      }
    };

    detect();
  }, []);

  // Handle manual region override
  useEffect(() => {
    if (!regionOverride) return;
    let regulation = 'standard';
    if (GDPR_COUNTRIES.has(regionOverride)) regulation = 'gdpr';
    else if (regionOverride === 'US-CA') regulation = 'ccpa';

    setRegion(prev => ({ ...prev, code: regionOverride, regulation }));
  }, [regionOverride]);

  const updateConsent = useCallback((updates) => {
    setConsent(prev => {
      const next = { ...prev, ...updates, essential: true }; // essential always true
      persistConsent(next);
      return next;
    });
    setBannerVisible(false);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, personalization: true });
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent({ analytics: false, personalization: false });
  }, [updateConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCookie(COOKIE_NAME, '', 0);
    setConsent({ essential: true, analytics: false, personalization: false });
    setBannerVisible(true);
  }, []);

  return (
    <ConsentContext.Provider value={{
      consent,
      region,
      loading,
      bannerVisible,
      updateConsent,
      acceptAll,
      rejectNonEssential,
      resetConsent,
      setRegionOverride,
      setBannerVisible
    }}>
      {children}
    </ConsentContext.Provider>
  );
};

export default ConsentContext;
