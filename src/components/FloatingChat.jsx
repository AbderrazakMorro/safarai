import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini';

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'ai',
            text: "Welcome back! I'm your SafarAI concierge. Where shall we venture next? I've been curating some spring escapes that match your preferences.",
            time: 'Just now'
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const suggestions = [
        '🏔️ Things to do in Ifrane',
        '🕌 Explore Fes Medina',
        '🌅 Best beaches near Essaouira'
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (text) => {
        const messageText = text || input;
        if (!messageText.trim() || isLoading) return;

        // Add user message
        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getGeminiResponse(messageText);
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: aiResponse.text || `I've put together some thoughts on ${aiResponse.destination || 'your request'}.`,
                data: aiResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                text: `I'm sorry, I'm having a bit of trouble connecting to my travel databases. Reference: ${error.message}`,
                error: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const renderWeather = (weather) => {
        if (!weather || !weather.condition) return null;
        return (
            <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100/50 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-teal-600">partly_cloudy_day</span>
                </div>
                <div>
                    <span className="block text-[10px] font-bold text-teal-800 uppercase tracking-wide">Weather Check</span>
                    <span className="text-xs text-stone-600 font-medium">{weather.condition} • {weather.temperature}</span>
                </div>
            </div>
        );
    };

    const renderMonuments = (monuments) => {
        if (!monuments || monuments.length === 0) return null;
        return (
            <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-teal-600">church</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Must-See Landmarks</span>
                </div>
                <div className="grid gap-2">
                    {monuments.map((monument, idx) => (
                        <div key={idx} className="bg-white border border-stone-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                            <h5 className="text-xs font-bold text-teal-900 mb-1">{monument.name}</h5>
                            <p className="text-[10px] text-stone-500 leading-relaxed">{monument.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderItinerary = (itinerary) => {
        if (!itinerary || itinerary.length === 0) return null;
        return (
            <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-teal-600">calendar_today</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">Planned Itinerary</span>
                </div>
                <div className="grid gap-2">
                    {itinerary.map((day, idx) => (
                        <div key={idx} className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 hover:bg-white transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-teal-700 uppercase">Day {day.day}</span>
                                {day.estimated_cost && <span className="text-[9px] font-medium text-stone-500 bg-stone-200/50 px-1.5 py-0.5 rounded">{day.estimated_cost}</span>}
                            </div>
                            <ul className="space-y-1">
                                {day.activities.map((act, i) => (
                                    <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                                        {act}
                                    </li>
                                ))}
                            </ul>
                            {day.notes && <p className="text-[10px] text-stone-400 mt-2 italic">{day.notes}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSuggestions = (suggestions) => {
        if (!suggestions || suggestions.length === 0) return null;
        return (
            <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 px-1">Top Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                        <span key={i} className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100 px-2 py-1 rounded-md font-medium">
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Overlay for mobile to close when clicking outside */}
            <div 
                className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[59] md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-200'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Chat Panel */}
            <div className={`fixed z-[60] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-[120%] md:translate-y-8 md:scale-95 pointer-events-none'} 
                bottom-0 right-0 w-full h-[90vh] md:h-[650px]
                md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 md:w-[420px] md:max-h-[85vh]`}>
                <div className="w-full h-full bg-white/90 backdrop-blur-2xl rounded-t-[32px] md:rounded-3xl shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.1)] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border-t border-white/40 md:border md:border-white/60 flex flex-col overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-primary to-primary-container relative overflow-hidden flex-shrink-0 border-b border-primary-container/20">
                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-10 -mb-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        
                        <div className="relative flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/40 shadow-inner">
                                    <img src="/avatar.png" alt="SafarAI" className="w-full h-full object-cover bg-primary/20" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold font-headline text-base tracking-wide shadow-sm">SafarAI Concierge</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-fixed"></span>
                                        </span>
                                        <span className="text-white/90 text-xs font-medium tracking-wide">Premium Agent</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-white/80 hover:text-white transition-all transform hover:scale-110 hover:rotate-90 p-1.5 rounded-full hover:bg-white/20 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-6 space-y-6 bg-gradient-to-b from-stone-50/40 to-stone-100/40">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-white text-[15px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                    </div>
                                )}
                                <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-5 py-3.5 text-[14px] leading-relaxed shadow-sm transition-all duration-300 group-hover:shadow-md ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl rounded-tr-[4px]' 
                                            : msg.error 
                                                ? 'bg-error-container/50 text-error rounded-2xl rounded-tl-[4px] border border-error/20'
                                                : 'bg-white/90 backdrop-blur-sm text-stone-800 rounded-2xl rounded-tl-[4px] border border-white/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]'
                                    }`}>
                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                        {msg.data && renderWeather(msg.data.weather)}
                                        {msg.data && renderMonuments(msg.data.monuments)}
                                        {msg.data && renderItinerary(msg.data.itinerary)}
                                        {msg.data && renderSuggestions(msg.data.suggestions)}
                                    </div>
                                    <span className={`text-[10px] text-stone-400 font-medium mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-stone-200/80 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-stone-400 text-[15px] animate-spin-slow">autorenew</span>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-white/60 rounded-2xl rounded-tl-[4px] px-5 py-4 flex gap-1.5 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        )}

                        {/* Suggestion Chips */}
                        {messages.length === 1 && !isLoading && (
                            <div className="flex flex-wrap gap-2 ml-11 animate-fade-in-up" style={{animationDelay: '300ms', animationFillMode: 'both'}}>
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(s)}
                                        className="px-4 py-2.5 bg-white/80 backdrop-blur-sm text-primary rounded-full text-[13px] font-semibold border border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} className="h-2" />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/90 backdrop-blur-lg border-t border-stone-200/50 flex-shrink-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] pb-[max(1rem,env(safe-area-inset-bottom))]">
                        <div className="bg-stone-100/80 hover:bg-stone-100 rounded-full px-2 py-1.5 flex items-center gap-2 border border-transparent focus-within:bg-white focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300 shadow-inner">
                            <button className="p-2 text-stone-400 hover:text-primary transition-colors flex-shrink-0 rounded-full hover:bg-white">
                                <span className="material-symbols-outlined text-[22px]">add_circle</span>
                            </button>
                            <input 
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-stone-800 placeholder-stone-400 font-medium text-[15px] py-2" 
                                placeholder="Message SafarAI..." 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button 
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:bg-primary-container disabled:opacity-40 disabled:hover:shadow-none transition-all duration-300 active:scale-90 flex-shrink-0 transform"
                            >
                                <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>arrow_upward</span>
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-stone-400 mt-2.5 font-medium tracking-wide">SafarAI can make mistakes. Verify important info.</p>
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-[61] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    bottom-6 right-4 md:bottom-8 md:right-8
                    ${isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0 hover:-translate-y-1'}`}
            >
                <div className="relative group">
                    <div className="w-[60px] h-[60px] md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-[0_8px_30px_rgba(0,104,94,0.3)] flex items-center justify-center overflow-hidden border-2 border-white transition-all duration-300 group-hover:shadow-[0_12px_40px_rgba(0,104,94,0.4)] group-active:scale-95">
                        <img src="/avatar.png" alt="AI Chat" className="w-full h-full object-cover scale-110" />
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{animationDuration: '3s'}}></div>
                    
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-error text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[12px] font-bold">sparkles</span>
                    </span>
                </div>
            </button>
        </>
    );
};

export default FloatingChat;
