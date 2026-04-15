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
            {/* Chat Panel */}
            <div className={`fixed bottom-28 md:bottom-8 right-4 md:right-8 z-[60] transition-all duration-500 ease-out ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className="w-[360px] md:w-[420px] h-[560px] bg-white rounded-3xl shadow-2xl border border-stone-200/50 flex flex-col overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-teal-700 to-teal-600 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden">
                                <img src="/avatar.png" alt="SafarAI" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold font-headline text-sm">SafarAI Concierge</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                                    <span className="text-white/70 text-[11px] font-medium">Online • Premium</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-stone-50/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined text-white text-sm" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                                    </div>
                                )}
                                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                                    <div className={`px-4 py-3 text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-primary text-white rounded-2xl rounded-br-md shadow-sm' 
                                            : msg.error 
                                                ? 'bg-red-50 text-red-600 rounded-2xl rounded-bl-md border border-red-100'
                                                : 'bg-white text-stone-700 rounded-2xl rounded-bl-md shadow-sm border border-stone-100'
                                    }`}>
                                        {msg.text}
                                        {msg.data && renderWeather(msg.data.weather)}
                                        {msg.data && renderMonuments(msg.data.monuments)}
                                        {msg.data && renderItinerary(msg.data.itinerary)}
                                        {msg.data && renderSuggestions(msg.data.suggestions)}
                                    </div>
                                    <span className={`text-[10px] text-stone-400 mt-1.5 block ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 justify-start animate-fade-in">
                                <div className="w-8 h-8 rounded-xl bg-stone-200 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-stone-400 text-sm animate-pulse">pending</span>
                                </div>
                                <div className="bg-white/50 border border-stone-100 rounded-2xl px-4 py-3 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        )}

                        {/* Suggestion Chips (show only when 1 message and not loading) */}
                        {messages.length === 1 && !isLoading && (
                            <div className="flex flex-wrap gap-2 ml-11">
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleSend(s)}
                                        className="px-4 py-2 bg-white text-stone-600 rounded-full text-xs font-semibold border border-stone-200 hover:border-primary/40 hover:text-primary transition-all shadow-sm"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="px-4 py-4 bg-white border-t border-stone-100 flex-shrink-0">
                        <div className="bg-stone-50 rounded-2xl px-2 py-1.5 flex items-center gap-2 border border-stone-200/60 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                            <button className="p-2 text-stone-400 hover:text-teal-600 transition-colors flex-shrink-0">
                                <span className="material-symbols-outlined text-xl">attach_file</span>
                            </button>
                            <input 
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-stone-800 placeholder-stone-400 font-medium text-sm py-2" 
                                placeholder="Tell me about your dream trip..." 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button 
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm hover:bg-primary-container disabled:opacity-40 disabled:hover:bg-primary transition-all active:scale-95 flex-shrink-0"
                            >
                                <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                            </button>
                        </div>
                        <p className="text-center text-[10px] text-stone-400 mt-2 tracking-tight font-medium">SafarAI may hallucinate details. Verify bookings independently.</p>
                    </div>
                </div>
            </div>

            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[61] transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <div className="relative group">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-xl shadow-teal-900/25 flex items-center justify-center overflow-hidden border-2 border-white hover:scale-110 active:scale-95 transition-all">
                        <img src="/avatar.png" alt="AI Chat" className="w-full h-full object-cover" />
                    </div>
                    {/* Pulse ring */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary-container rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[9px] font-bold text-on-tertiary-container">AI</span>
                    </span>
                </div>
            </button>
        </>
    );
};

export default FloatingChat;
