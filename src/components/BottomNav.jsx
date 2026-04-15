import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    
    // Helper function for active state logic
    const getLinkClasses = (path) => {
        const isActive = location.pathname === path;
        return isActive 
            ? "flex flex-col items-center justify-center bg-primary/10 text-primary rounded-xl p-2 w-16 transition-all duration-300 ease-out" 
            : "flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 p-2 transition-all duration-300 ease-out";
    };

    return (
        <nav className="md:hidden fixed bottom-0 w-full z-50 bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-xl shadow-[0_-12px_32px_rgba(25,28,28,0.06)] flex justify-around items-center px-4 pb-4 pt-3 rounded-t-[2rem]">
            <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
                <span className="text-[10px] font-headline font-semibold tracking-wide mt-1">Home</span>
            </Link>
            
            <Link to="/destinations" className={getLinkClasses('/destinations')}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/destinations' || location.pathname === '/activities' ? "'FILL' 1" : "'FILL' 0"}}>explore</span>
                <span className="text-[10px] font-headline font-semibold tracking-wide mt-1">Explore</span>
            </Link>
            
            <Link to="/backpack" className={getLinkClasses('/backpack')}>
                 <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/backpack' ? "'FILL' 1" : "'FILL' 0"}}>map</span>
                <span className="text-[10px] font-headline font-semibold tracking-wide mt-1">Trips</span>
            </Link>
            
            <button className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 p-2 transition-all duration-300 ease-out">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-[10px] font-headline font-semibold tracking-wide mt-1">Settings</span>
            </button>
        </nav>
    );
};

export default BottomNav;
