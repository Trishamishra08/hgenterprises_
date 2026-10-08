import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, MapPin, Building2, Store, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreLocator = () => {
    const [pincode, setPincode] = useState("");
    const navigate = useNavigate();

    const cities = [
        { name: "Mumbai", count: 26, icon: Building2 },
        { name: "Delhi", count: 37, icon: Building2 },
        { name: "Bangalore", count: 18, icon: Building2 },
        { name: "Hyderabad", count: 14, icon: Building2 },
        { name: "Pune", count: 12, icon: MapPin },
        { name: "Ahmedabad", count: 9, icon: Store },
        { name: "Chennai", count: 11, icon: Building2 },
        { name: "Kolkata", count: 7, icon: Map }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* ULTRA COMPACT HERO */}
            <section className="relative py-8 md:py-12 bg-[#FFF5F6] border-b border-pink-100/50">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A1015 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="font-serif text-xl md:text-3xl text-dark mb-1 tracking-tight">Find a store near you</h1>
                    <p className="text-zinc-500 font-serif italic text-[10px] md:text-xs mb-6 max-w-md mx-auto opacity-70 leading-tight">
                        Find a Harshad Gauri store in your locality
                    </p>

                    {/* Minimalist Search Bar */}
                    <div className="max-w-sm mx-auto relative group">
                        <div className="flex items-center bg-white border border-pink-100 rounded-lg shadow-sm px-3 h-10">
                            <Target className="w-3.5 h-3.5 text-primary opacity-40" />
                            <input 
                                type="text" 
                                placeholder="Enter Pincode or City"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium px-2 text-zinc-700 placeholder:text-zinc-300"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <button className="text-[9px] font-black tracking-widest text-primary uppercase border-l border-pink-50 pl-3 hover:text-dark transition-colors shrink-0">
                                LOCATE ME
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ULTRA COMPACT CITY GRID */}
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {cities.map((city, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                viewport={{ once: true }}
                                className="group cursor-default"
                            >
                                <div className="bg-[#FFF5F6] border border-pink-100/50 rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/5 transition-colors border border-zinc-100/50">
                                        <city.icon strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6 text-dark/50 group-hover:text-primary transition-colors" />
                                    </div>

                                    <h3 className="text-xs md:text-sm font-serif text-dark mb-0.5">{city.name}</h3>
                                    <p className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-black text-zinc-400 group-hover:text-primary transition-colors">
                                        {city.count} Stores
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Coming Soon Message */}
                    <div className="mt-8 text-center">
                        <p className="text-[10px] md:text-xs font-serif italic text-zinc-400 tracking-wide">
                            Many more cities coming soon to your locality...
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StoreLocator;
