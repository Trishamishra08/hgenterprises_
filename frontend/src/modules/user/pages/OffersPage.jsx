import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, ArrowRight, Sparkles, Percent, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import { DEFAULT_BANNER_OFFERS, getOfferLink } from '../data/offerLandingData';

const CountdownTimer = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        if (!expiryDate) return;
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(expiryDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (!expiryDate) return null;

    return (
        <div className="flex gap-2 text-white font-serif">
            <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] uppercase tracking-widest opacity-60">Hrs</span>
            </div>
            <span className="text-xl md:text-2xl pt-0.5">:</span>
            <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] uppercase tracking-widest opacity-60">Min</span>
            </div>
            <span className="text-xl md:text-2xl pt-0.5">:</span>
            <div className="flex flex-col items-center">
                <span className="text-xl md:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] uppercase tracking-widest opacity-60">Sec</span>
            </div>
        </div>
    );
};

const OffersPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const res = await api.get('/offers');
                setDeals(res.data);
            } catch (err) {
                console.error("Error fetching offers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    const filteredDeals = activeTab === 'all' ? deals : deals.filter(d => d.category === activeTab);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section - Compact */}
            <div className="bg-black py-10 md:py-16 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold font-serif tracking-[0.3em] uppercase text-[10px] mb-2 block"
                    >
                        Exclusive Privileges
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white font-serif text-3xl md:text-5xl font-normal tracking-tight mb-4"
                    >
                        Trending <span className="italic text-gold">Offers</span>
                    </motion.h1>
                    <div className="h-[1px] w-12 bg-gold/30 mx-auto"></div>
                </div>
            </div>

            {/* Filter Tabs - Ultra Compact */}
            <div className="container mx-auto px-4 -mt-5 relative z-20">
                <div className="flex justify-center gap-2 bg-white p-1 rounded-full shadow-lg border border-gray-100 w-fit mx-auto">
                    {['all', 'trending', 'limited'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full font-serif text-[9px] tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured offer banners */}
            <div className="container mx-auto px-4 py-8 md:py-10">
                <h2 className="font-serif text-xl md:text-2xl text-[#1e3a5f] text-center mb-6">
                    Featured Offers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {DEFAULT_BANNER_OFFERS.map((banner) => (
                        <Link
                            key={banner.id}
                            id={`offer-card-${banner.id}`}
                            to={getOfferLink(banner.id)}
                            className="group block rounded-[18px] overflow-hidden border border-[#e8e0d5] shadow-sm hover:shadow-lg transition-shadow bg-white"
                        >
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="w-full h-36 md:h-40 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="p-3 text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#1e3a5f]/60 font-bold">
                                    View Offer Details
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Offers Grid - Compact Cards */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <AnimatePresence mode="popLayout">
                    {filteredDeals.length > 0 ? (
                        <div key="offers-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredDeals.map((deal, idx) => (
                                <motion.div
                                    key={deal._id || deal.id || `deal-${idx}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="h-full"
                                >
                                    <Link
                                        to={deal.path}
                                        className={`relative rounded-[1.5rem] overflow-hidden ${deal.color} p-4 shadow-lg border border-white/5 flex flex-col h-full group hover:shadow-2xl transition-all duration-500`}
                                    >
                                        {/* Subtle Gradient Glow */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[40px] rounded-full group-hover:bg-gold/10 transition-all duration-700"></div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className={`text-[7px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 bg-white/10 rounded-full border border-white/10 ${deal.accent}`}>
                                                    {deal.tag}
                                                </span>
                                                <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                                    {(() => {
                                                        const IconComp = { Zap, Sparkles, Gift, Tag, Percent }[deal.icon] || Tag;
                                                        return <IconComp className="w-3 h-3" />;
                                                    })()}
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-grow">
                                                    <h2 className="text-base md:text-lg font-serif text-white mb-0.5 tracking-tight leading-tight group-hover:text-gold transition-colors">
                                                        {deal.title}
                                                    </h2>

                                                    <div className={`text-xl md:text-2xl font-black mb-2 tracking-tighter italic ${deal.accent}`}>
                                                        {deal.discount}
                                                    </div>

                                                    <p className="text-white/30 font-serif text-[10px] mb-4 line-clamp-2 leading-relaxed">
                                                        {deal.description}
                                                    </p>
                                                </div>

                                                {deal.image && (
                                                    <div className="w-20 h-28 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/10 p-2 group-hover:bg-white/10 transition-all duration-500">
                                                        <img src={deal.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                )}
                                            </div>


                                            {deal.expiry && (
                                                <div className="mt-auto p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <Clock className="w-2.5 h-2.5 text-gold/60" />
                                                        <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-black">Ends Soon</span>
                                                    </div>
                                                    <CountdownTimer expiryDate={deal.expiry} />
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            key="offers-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 px-6 border border-zinc-50 rounded-[3rem] bg-zinc-50/30"
                        >
                            <Sparkles className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                            <h3 className="text-xl font-serif text-zinc-800 mb-2">Exclusive Deals Coming</h3>
                            <p className="text-zinc-400 text-sm font-serif italic">This tier currently has no active flash events.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Trust Bar - Premium Quality Assurance */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-zinc-100 italic font-serif">
                    {[
                        { label: "Insured Shipping", sub: "Global Discrete" },
                        { label: "Authenticity", sub: "Lifetime Gaurantee" },
                        { label: "Elite Packaging", sub: "Boutique Experience" },
                        { label: "Private Concierge", sub: "Ready to Assist" }
                    ].map((item, idx) => (
                        <div key={idx} className="text-center">
                            <p className="text-[10px] uppercase tracking-widest font-black text-black mb-1">{item.label}</p>
                            <p className="text-[9px] text-zinc-400">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter Section - Polished */}
            <div className="container mx-auto px-4 pb-20">
                <div className="bg-zinc-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(211,154,159,0.1),transparent)]"></div>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <Tag className="w-8 h-8 text-gold/40 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Elite <span className="italic text-gold">Access</span></h2>
                        <p className="text-zinc-500 font-serif text-xs md:text-sm mb-10 leading-relaxed uppercase tracking-[0.2em] font-black">
                            Join the inner circle for private offers.
                        </p>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Your elite email"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-all font-serif"
                            />
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-serif font-black uppercase tracking-widest text-[10px] hover:bg-gold transition-all shadow-xl">
                                Secure Invite
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
