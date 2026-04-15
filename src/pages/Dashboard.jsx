import React from 'react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Hero Greeting Section */}
        <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="inline-block px-4 py-1.5 bg-tertiary-container/20 text-tertiary font-bold text-[10px] tracking-widest uppercase rounded-full mb-4">MEMBER SINCE 2022</span>
                    <h2 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-2 font-headline">Welcome back, Alex!</h2>
                    <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">Your next adventure is waiting. AI has curated some breathtaking vistas for your upcoming September break.</p>
                </div>
                
                {/* Weather Widget */}
                <div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-6 min-w-[300px]">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Current Location</span>
                        <span className="text-xl font-bold text-teal-900 font-headline">London, UK</span>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <span className="material-symbols-outlined text-4xl text-tertiary">partly_cloudy_day</span>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-on-surface font-headline">21°C</span>
                            <span className="text-xs text-stone-500">Scattered clouds</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Bento Quick Actions Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="md:col-span-2 bg-primary text-white p-8 rounded-xl relative overflow-hidden group cursor-pointer shadow-lg active:scale-[0.98] transition-all">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <h3 className="text-3xl font-bold mb-2 font-headline">Plan Trip</h3>
                        <p className="text-primary-fixed/80 max-w-[200px]">Let SafarAI build your custom itinerary in seconds.</p>
                    </div>
                    <span className="material-symbols-outlined text-5xl opacity-50 self-end">auto_awesome</span>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full -mr-10 -mt-10 blur-3xl opacity-50"></div>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10 group cursor-pointer hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-teal-600 mb-6 block text-3xl">explore</span>
                <h4 className="font-bold text-lg mb-1 font-headline">Explore</h4>
                <p className="text-stone-500 text-sm">Discover hidden gems and local favorites.</p>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10 group cursor-pointer hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-tertiary mb-6 block text-3xl">bookmark</span>
                <h4 className="font-bold text-lg mb-1 font-headline">Saved</h4>
                <p className="text-stone-500 text-sm">Review your curated bucket list.</p>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Concierge Picks */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold tracking-tight font-headline">Concierge Picks</h3>
                    <a className="text-teal-700 text-sm font-semibold hover:underline" href="#">View All Recommendations</a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group cursor-pointer">
                        <div className="relative overflow-hidden asymmetric-border aspect-[4/5] mb-6 shadow-xl">
                            <img 
                                alt="Amalfi Coast View" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL1ct7I5wbM_B3O1cPE3K-jfCZHlvIgyi1de8D3ydeHbxEw4b5S5rQGueVS4xGLIVNyp7gs4ga-tYGrcvAbv-2HgXYHUjKqRu0ojSfTABpZbnNDpeitl4kKK5E8JWMDpr0w8sdFrfkfwKGm1446T9P-1rPvVAEmG9I0X1s54_m6baZu2jiM7x2oiiFmrjZF-l1YEnu8DAn0GsU817ahua02bjUGn62oD7U9H9fMo9ulyFUJK6GP_caShGlBXB1BRL7WrehfSe_uSM"
                            />
                            <div className="absolute top-4 right-4 bg-tertiary-container/90 backdrop-blur text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                AI SUGGESTION
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-1 font-headline">Coastal Retreats in Amalfi</h4>
                        <p className="text-stone-500 text-sm italic mb-4">"Perfect for your search for serenity and local cuisine."</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-teal-800 tracking-wider uppercase">
                            <span>7 DAYS</span>
                            <span className="h-1 w-1 bg-stone-300 rounded-full"></span>
                            <span>ITALY</span>
                        </div>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-6 shadow-xl" style={{ borderBottomLeftRadius: '4rem' }}>
                            <img 
                                alt="Kyoto Zen Garden" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_4iY2RFKFJ0v0xPYMyXcNAw-MVj4Pec4jGciGLkBiWeyqZjTKibFA4RVsLEvO9DblN8O3XmBq2nLEbXezGiJn6q82Lq316tWHK_JSIGi1ktHC5EZlysYrmg9RWGL6X-RiEXHmWhyuNx_edHjlcdFuuH-tHwHvElASMgy2nyV3apAfQSRajnFbxOo5Nmnw_t5c12-fALIKvMwgS3hBGeZ8hzUBr-iR4zqBKkmrQe29qU_IhqQxCzcspqmiLm0-h_6ub6igjHEKcFY"
                            />
                            <div className="absolute top-4 right-4 bg-tertiary-container/90 backdrop-blur text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                AI SUGGESTION
                            </div>
                        </div>
                        <h4 className="text-xl font-bold mb-1 font-headline">Zen Traditions in Kyoto</h4>
                        <p className="text-stone-500 text-sm italic mb-4">"Matches your interest in architecture and tea rituals."</p>
                        <div className="flex items-center gap-4 text-xs font-bold text-teal-800 tracking-wider uppercase">
                            <span>12 DAYS</span>
                            <span className="h-1 w-1 bg-stone-300 rounded-full"></span>
                            <span>JAPAN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="lg:col-span-1">
                <div className="bg-surface-container-low p-8 rounded-lg min-h-full">
                    <h3 className="text-xl font-bold mb-8 font-headline">Recent Activity</h3>
                    <div className="relative">
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-outline-variant/20"></div>
                        <div className="space-y-10">
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-surface-container-low bg-tertiary z-10"></div>
                                <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-widest">Today, 10:24 AM</span>
                                <p className="text-sm font-semibold text-on-surface">Saved "Hotel de la Ville" to Amalfi trip</p>
                                <p className="text-xs text-stone-500 mt-1">Luxury category recommendation.</p>
                            </div>
                            
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-surface-container-low bg-primary z-10"></div>
                                <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-widest">Yesterday</span>
                                <p className="text-sm font-semibold text-on-surface">AI generated 3-day Kyoto itinerary</p>
                                <p className="text-xs text-stone-500 mt-1">Focus on Gion District and Arashiyama.</p>
                            </div>
                            
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-surface-container-low bg-stone-300 z-10"></div>
                                <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-widest">Aug 24, 2024</span>
                                <p className="text-sm font-semibold text-on-surface">Booked flights to London (LHR)</p>
                                <p className="text-xs text-stone-500 mt-1">Confirmation #SA-9921-X</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mini Map Preview */}
                    <div className="mt-12 rounded-xl overflow-hidden aspect-square shadow-inner bg-surface-container-high relative">
                        <div className="absolute inset-0 flex items-center justify-center opacity-40">
                            <span className="material-symbols-outlined text-6xl">map</span>
                        </div>
                        <div className="absolute inset-0 bg-teal-900/5"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm">pin_drop</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-stone-500 uppercase leading-none">UPCOMING DESTINATION</p>
                                <p className="text-sm font-bold text-on-surface">Positano, Italy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
