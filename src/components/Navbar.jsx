import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarSrc, setAvatarSrc] = useState('/avatar.png');
    const navigate = useNavigate();

    useEffect(() => {
        const loadAvatar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const url = user?.user_metadata?.avatar_url;
            if (url) setAvatarSrc(url);
        };
        loadAvatar();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const url = session?.user?.user_metadata?.avatar_url;
            if (url) setAvatarSrc(url);
            else setAvatarSrc('/avatar.png');
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/activities?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };
    return (
        <header className="hidden md:flex justify-between items-center px-8 h-20 w-full bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-8">
                <div className="hidden lg:flex gap-6">
                    <NavLink 
                        to="/dashboard"
                        className={({ isActive }) => `font-headline tracking-tight py-2 transition-colors ${isActive ? "text-teal-700 dark:text-teal-300 font-semibold border-b-2 border-teal-600" : "text-stone-500 dark:text-stone-400 hover:text-teal-600"}`}
                    >
                        Explore
                    </NavLink>
                    <NavLink 
                        to="/community"
                        className={({ isActive }) => `font-headline tracking-tight py-2 transition-colors ${isActive ? "text-teal-700 dark:text-teal-300 font-semibold border-b-2 border-teal-600" : "text-stone-500 dark:text-stone-400 hover:text-teal-600"}`}
                    >
                        Community
                    </NavLink>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative group hidden sm:block">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-stone-400 text-lg">search</span>
                    </div>
                    <input 
                        className="bg-surface-container border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-primary/20 transition-all font-body" 
                        placeholder="Search destinations..." 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-stone-500 cursor-pointer hover:text-teal-600">notifications</span>
                    <div 
                        onClick={() => navigate('/profile')}
                        className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer select-none hover:ring-2 hover:ring-primary/30 transition-all"
                    >
                        <img 
                            alt="User profile avatar" 
                            className="h-full w-full object-cover" 
                            src={avatarSrc}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
