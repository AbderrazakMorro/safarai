import React, { useState } from 'react';
import { useConsent } from '../contexts/ConsentContext';

const REGION_OPTIONS = [
  { code: 'FR', label: 'France (EU/GDPR)' },
  { code: 'DE', label: 'Germany (EU/GDPR)' },
  { code: 'GB', label: 'United Kingdom (GDPR)' },
  { code: 'US-CA', label: 'California (CCPA)' },
  { code: 'US', label: 'United States (Standard)' },
  { code: 'MA', label: 'Morocco (Standard)' },
  { code: 'OTHER', label: 'Other (Standard)' },
];

export default function CookieConsent() {
  const {
    consent, region, bannerVisible, loading,
    updateConsent, acceptAll, rejectNonEssential, setRegionOverride
  } = useConsent();

  const [showSettings, setShowSettings] = useState(false);
  const [localAnalytics, setLocalAnalytics] = useState(consent.analytics);
  const [localPersonalization, setLocalPersonalization] = useState(consent.personalization);

  if (!bannerVisible || loading) return null;

  const regulationLabel =
    region.regulation === 'gdpr' ? 'GDPR (EU/UK)' :
    region.regulation === 'ccpa' ? 'CCPA (California)' : 'Standard';

  const handleSavePreferences = () => {
    updateConsent({ analytics: localAnalytics, personalization: localPersonalization });
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 md:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        {/* Zellige-inspired top border accent */}
        <div className="h-1.5 rounded-t-2xl bg-gradient-to-r from-teal-600 via-amber-500 to-teal-600"
          style={{
            backgroundSize: '24px 100%',
            backgroundImage: 'repeating-linear-gradient(90deg, #0d9488 0px, #0d9488 6px, #f59e0b 6px, #f59e0b 12px, #0d9488 12px, #0d9488 18px, #065f46 18px, #065f46 24px)'
          }}
        />

        <div className="bg-white dark:bg-stone-900 rounded-b-2xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
          {/* Main Banner */}
          <div className="p-5 md:p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-symbols-outlined text-2xl text-teal-600 mt-0.5">cookie</span>
              <div>
                <h3 className="text-base font-bold text-on-surface font-headline">We value your privacy</h3>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                  SafarAI uses cookies to enhance your travel experience. Essential cookies keep you logged in.
                  {region.regulation === 'gdpr' && ' Under GDPR, non-essential cookies require your explicit consent.'}
                  {region.regulation === 'ccpa' && ' Under CCPA, you have the right to opt out of data sharing.'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Region: {region.name || 'Detecting...'} • {regulationLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-700 to-teal-600 text-white text-sm font-bold rounded-full shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Accept All
              </button>
              <button
                onClick={rejectNonEssential}
                className="px-5 py-2.5 border border-stone-300 dark:border-stone-600 text-sm font-bold text-stone-600 dark:text-stone-300 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-5 py-2.5 text-sm font-bold text-teal-700 dark:text-teal-400 hover:underline underline-offset-4 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">tune</span>
                Manage Preferences
              </button>
            </div>
          </div>

          {/* Expandable Settings Panel */}
          {showSettings && (
            <div className="border-t border-stone-200 dark:border-stone-700 p-5 md:p-6 bg-stone-50 dark:bg-stone-800/50 space-y-4">

              {/* Essential */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface">Essential Cookies</p>
                  <p className="text-xs text-stone-500">JWT authentication, session management. Required for login.</p>
                </div>
                <div className="w-11 h-6 bg-teal-600 rounded-full relative cursor-not-allowed opacity-70">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface">Analytics Cookies</p>
                  <p className="text-xs text-stone-500">Usage tracking to improve SafarAI services.</p>
                </div>
                <button
                  onClick={() => setLocalAnalytics(!localAnalytics)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${localAnalytics ? 'bg-teal-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${localAnalytics ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Personalization */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-on-surface">Personalization Cookies</p>
                  <p className="text-xs text-stone-500">Location preferences, AI recommendations, saved itineraries.</p>
                </div>
                <button
                  onClick={() => setLocalPersonalization(!localPersonalization)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${localPersonalization ? 'bg-teal-600' : 'bg-stone-300 dark:bg-stone-600'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${localPersonalization ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              {/* Region Override */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Change Region</label>
                <select
                  onChange={(e) => setRegionOverride(e.target.value)}
                  defaultValue=""
                  className="w-full md:w-auto px-4 py-2 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none"
                >
                  <option value="" disabled>Select region...</option>
                  {REGION_OPTIONS.map(r => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Save */}
              <button
                onClick={handleSavePreferences}
                className="w-full py-2.5 bg-teal-700 text-white text-sm font-bold rounded-full hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* Footer links */}
          <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-700 flex gap-4">
            <a href="/privacy" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-teal-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-[10px] font-bold text-stone-400 uppercase tracking-widest hover:text-teal-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
