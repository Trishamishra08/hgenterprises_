import React from 'react';
import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Truck, Headset } from 'lucide-react'; 

const BrandPromises = () => {
    const promises = [
        {
            id: 1,
            icon: Gem,
            title: "Exquisite Gems",
            desc: "Sourced with Authenticity"
        },
        {
            id: 2,
            icon: ShieldCheck,
            title: "BIS Hallmarked",
            desc: "Purity You Can Trust"
        },
        {
            id: 3,
            icon: Truck,
            title: "Insured Shipping",
            desc: "Safe Delivery Worldwide"
        },
        {
            id: 4,
            icon: Headset,
            title: "Style Concierge",
            desc: "Talk to Our Experts"
        }
    ];

    return (
        <section className="pt-0 pb-4 md:pb-8 bg-white overflow-hidden">
            <div className="container mx-auto px-2 md:px-4">

                {/* Header - Matched to Shop by Recipient Style */}
                <div className="text-center mb-4 md:mb-6">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        OUR COMMITMENTS
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark mb-2 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Why Choose <span className="italic text-[#8c2a3e] font-normal">Us</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>

                <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 md:gap-12 lg:gap-8 pt-2 md:pt-4">
                    {promises.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative group flex flex-col items-center"
                        >
                            {/* Diamond Box - Compact for Mobile */}
                            <div className="w-16 h-16 md:w-52 md:h-52 bg-[#4A1015] rotate-45 rounded-md md:rounded-[2rem] flex items-center justify-center shadow-md md:shadow-[0_20px_40px_rgba(74,16,21,0.25)] relative z-10 border md:border-4 border-white cursor-pointer transition-colors duration-300 hover:bg-[#5C242B]">
                                {/* Content (Rotated back) */}
                                <div className="-rotate-45 flex flex-col items-center justify-center text-white p-1 md:p-4 text-center">
                                    <item.icon strokeWidth={1} className="w-4 h-4 md:w-10 md:h-10 mb-0.5 md:mb-3 text-[#EBCDD0]" />
                                    <h3 className="font-serif text-[6px] md:text-[15px] font-normal text-white mb-0 leading-tight uppercase tracking-tighter md:tracking-wider">
                                        {item.title.split(' ')[0]}
                                    </h3>
                                </div>
                            </div>

                            {/* Glow effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-48 md:h-48 bg-[#4A1015]/10 blur-xl md:blur-3xl rounded-full -z-10 group-hover:bg-[#4A1015]/20 transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandPromises;
