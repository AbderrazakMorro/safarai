import React from 'react';
import DiscoverySection from '../components/DiscoverySection';
import './Activities.css';

export default function Activities() {
  return (
    <div className="activities-container page-content glass min-h-screen pb-32 md:pb-8">
      {/* ── Hero Header ───────────────────────────────────────────────── */}
      <div className="discovery-hero animate-fade-in-up pt-4 md:pt-0 mb-8 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-[#1d1c16] tracking-tighter mb-2 leading-tight">
            Discover <span className="text-[#004e46]">Adventures</span>
          </h1>
          <p className="text-[#3e4947] text-base md:text-lg font-medium leading-relaxed">
            Tours, landmarks & outdoor experiences — powered by Foursquare.
          </p>
        </div>
      </div>

      {/* ── Discovery Section Component ───────────────────────────────── */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <DiscoverySection />
      </div>
    </div>
  );
}
