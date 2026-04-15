import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to dashboard on successful auth
        navigate('/dashboard');
    };

    return (
        <main className="flex min-h-screen bg-surface">
            {/* Left Side: Hero Brand Experience (Hidden on Mobile) */}
            <section className="hidden lg:flex lg:w-1/2 relative p-8">
                <div className="relative w-full h-full overflow-hidden rounded-3xl">
                    <img 
                        alt="Cinematic background" 
                        className="absolute inset-0 w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_6t4Idr7Yoxwt6kBKOpOcUgvlbKc8ggCykLJTriR-bZMjqDeu4whaIBwEal5nIxx-iHqb7HzUcRrcaNNrqVLFhjHMtR83LbaECM6Lsan-sCfOGYOBAgsfl6pGN8efbdtrpKICTR0rYz5D2TrvBErQufVYmBFCoIkbozkzOpdcUXpxgtq9k41FxVRGX57MSOFk2wNrqtP6_WDQhC65A67olXsom0a074Ak_CTSYyFkhEZDSz3Kd6KY4_OkonNgAFAVG8ZX_r_QC9U"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-stone-900/40"></div>
                    
                    {/* Brand Layer */}
                    <div className="absolute inset-0 flex flex-col justify-between p-16">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="SafarAI Logo" className="w-10 h-10 object-contain drop-shadow-lg" />
                            <span className="text-3xl font-extrabold text-white tracking-tight font-headline">SafarAI</span>
                        </div>
                        
                        <div className="max-w-md">
                            <span className="inline-block px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] uppercase tracking-[0.1em] font-medium border border-white/20">
                                The Digital Concierge
                            </span>
                            <h2 className="text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight font-headline drop-shadow-sm">
                                Journey into the <br/>unseen.
                            </h2>
                            <p className="text-white/90 text-lg leading-relaxed font-light drop-shadow-sm">
                                "Travel is not just seeing the sights; it is a change that goes on, deep and permanent, in the ideas of living."
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-white/40"></div>
                                <span className="text-white/60 text-sm tracking-widest uppercase font-semibold">Miriam Beard</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Right Side: Clean Form */}
            <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
                {/* Back to Home Button (Mobile/Desktop helper) */}
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="w-full max-w-md space-y-10">
                    {/* Header & Intro */}
                    <div className="space-y-3">
                        <div className="lg:hidden mb-8 flex items-center gap-3">
                            <img src="/logo.png" alt="SafarAI Logo" className="w-10 h-10 object-contain" />
                            <span className="text-2xl font-extrabold text-teal-800 tracking-tight font-headline">SafarAI</span>
                        </div>
                        <h1 className="text-4xl font-bold text-on-surface tracking-tight font-headline">
                            {isLogin ? "Welcome back" : "Join SafarAI"}
                        </h1>
                        <p className="text-stone-500 text-base">
                            {isLogin ? "Your next adventure is just a click away." : "Unlock the world's most intelligent travel assistant."}
                        </p>
                    </div>

                    {/* Social Login Cluster */}
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl text-sm font-medium text-on-surface border border-outline-variant/30">
                            <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVPOxzRhGE50XEtJoZJqA9SLG_iMH8-u76m0ztMI7tGNPTWoCb38r_HTZbvnE8OiQtqOD_bcc9KHhBR9NpM6ZMGjrvJfGJuqypd0jxpFJ9N4smcXuGekzD49ExG_MIs6RoDgIlcR_s6H_8YKmQ0V0i3J6e5ZHCNfWpMsgrTxWHuXyrFWMPb6IDF-U9Ief5R0t2Bdcuu3Bi9mPSSQYJZf7L6Fxa6DZmkf0onGfJPPFTGgpE-B0n5XfQAbSKDQaGUjpcnE1mmNl7vY0"/>
                            <span>Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl text-sm font-medium text-on-surface border border-outline-variant/30">
                            <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>ios</span>
                            <span>Apple</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                        <span className="flex-shrink mx-4 text-xs font-bold text-stone-400 uppercase tracking-widest">or continue with email</span>
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                    </div>

                    {/* Auth Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1" htmlFor="name">Full Name</label>
                                    <input 
                                        className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-on-surface placeholder:text-stone-400" 
                                        id="name" 
                                        placeholder="John Doe" 
                                        type="text" 
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-1" htmlFor="email">Email address</label>
                                <input 
                                    className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-on-surface placeholder:text-stone-400" 
                                    id="email" 
                                    placeholder="name@example.com" 
                                    type="email" 
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider" htmlFor="password">Password</label>
                                    {isLogin && <a className="text-xs font-bold text-primary hover:text-teal-600 transition-colors" href="#">Forgot?</a>}
                                </div>
                                <div className="relative">
                                    <input 
                                        className="w-full px-6 py-4 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-on-surface placeholder:text-stone-400" 
                                        id="password" 
                                        placeholder="••••••••" 
                                        type="password" 
                                        required
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-primary transition-colors" type="button">
                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className="w-full py-4 mt-2 bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold rounded-full shadow-lg shadow-teal-900/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" 
                            type="submit"
                        >
                            {isLogin ? "Log In" : "Create Account"}
                            <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                        </button>
                    </form>

                    {/* Footer Toggle */}
                    <p className="text-center text-sm text-stone-500">
                        {isLogin ? "New to SafarAI? " : "Already have an account? "}
                        <button 
                            type="button" 
                            className="text-teal-700 font-bold hover:underline underline-offset-4 ml-1 transition-all" 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Create an account" : "Log in instead"}
                        </button>
                    </p>

                    {/* Legal / Policy */}
                    <div className="pt-8 flex justify-center gap-6">
                        <a className="text-[10px] text-stone-400 uppercase tracking-tighter hover:text-stone-600 transition-colors font-semibold" href="#">Privacy Policy</a>
                        <a className="text-[10px] text-stone-400 uppercase tracking-tighter hover:text-stone-600 transition-colors font-semibold" href="#">Terms of Service</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
