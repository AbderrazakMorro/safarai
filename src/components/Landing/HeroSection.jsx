import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] sm:min-h-screen flex items-center pt-24 sm:pt-20 pb-12 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img 
                    className="w-full h-full object-cover brightness-[0.80] sm:brightness-[0.85]" 
                    alt="Cinematic aerial view of mountains at sunrise" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRGXAc4G0IKkSVYdlQSKrl0eFthcCKDzHh4sMlOt5AFItOJCyjtE6-mCAmQTwz9wtxhpYi7KepShJp1HP_rbTWJPD476hNPKxFXlpIoeUKc_-ODEkXLEQhLVs6JCpsD_gVoyrCL_fOJlsZ9z0qxG6WFzuIcTBkOG_4-5mqs4UjvZaXA1DDau4GHExd8Dcfn6EPv_CxPPwNJ3wIYLKasEB9sMXjPldikZbKa6zNzLoOEVUoDGXLa7_ISuiOeP2rlW8_zX96k1y9M40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 sm:from-stone-900/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
                <div className="max-w-2xl">
                    <span className="inline-block bg-tertiary-container/90 text-on-tertiary-container px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest mb-4 sm:mb-6 font-label uppercase">
                        AI-Powered Concierge
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white font-headline tracking-tight leading-[1.1] mb-5 sm:mb-8">
                        Travel Smarter, <br/>Not Harder
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-8 sm:mb-10 max-w-lg">
                        Elevate your global exploration with SafarAI. Experience predictive itineraries and intelligent discovery designed for the modern voyager.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                        <Link 
                            to="/login" 
                            className="bg-gradient-to-br from-primary to-primary-container text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-lg shadow-teal-900/20 hover:scale-105 active:scale-95 transition-all font-headline text-center"
                        >
                            Get Started
                        </Link>
                        <button className="text-white flex items-center justify-center sm:justify-start gap-2 font-semibold hover:opacity-80 transition-opacity font-headline py-2">
                            <span className="material-symbols-outlined">play_circle</span>
                            Watch the Journey
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Weather Card */}
            <div className="absolute bottom-12 right-12 hidden lg:block">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-xl border border-white/20 text-white w-64 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold font-headline">Zermatt, CH</span>
                        <span className="material-symbols-outlined text-tertiary-container" style={{fontVariationSettings: "'FILL' 1"}}>sunny</span>
                    </div>
                    <div className="text-4xl font-bold mb-2 font-headline">12°C</div>
                    <div className="text-sm opacity-80">Perfect conditions for Alpine hiking.</div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
