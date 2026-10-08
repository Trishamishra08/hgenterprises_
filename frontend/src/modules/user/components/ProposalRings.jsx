import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import herImage from '../../../assets/download__18_-removebg-preview.png';
import himImage from '../../../assets/man_model.png';

const ProposalRings = () => {
    return (
        <section className="pt-0 pb-4 md:pb-12 bg-white overflow-visible">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-2 md:mb-4">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        GIFT THE EXCELLENCE
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-dark mb-2 tracking-wide">
                        Shop by <span className="italic text-[#8c2a3e] font-normal">Recipient</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>

                {/* Cards Container with perfect mobile vertical gap spacing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12 md:gap-y-28 max-w-6xl mx-auto mt-12 md:mt-36 pb-0">
                    
                    {/* For Him Card (Rounded Left, Sharp Right Corner) */}
                    <Link to="/category/men" className="block w-full h-[100px] md:h-[110px] relative">
                        <motion.div 
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute inset-0 bg-white rounded-l-3xl rounded-r-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-1.5 cursor-pointer"
                        >
                            {/* Inner Maroon Pill with Rounded-l and Sharp-r */}
                            <div className="w-full h-full bg-gradient-to-r from-[#6b1e2e] to-[#4a1015] rounded-l-2xl rounded-r-none flex items-center relative overflow-visible">
                                
                                {/* Text & Button Content (Tightened gap-2 to remove space before arrow) */}
                                <div className="z-20 pl-5 md:pl-10 lg:pl-12 flex items-center gap-2 md:gap-3">
                                    <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide whitespace-nowrap">For Him</h3>
                                    <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center text-[#6b1e2e] shadow-lg group shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5.5 md:w-5.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Model Image */}
                                <div className="absolute bottom-0 right-2 lg:right-6 w-[110px] md:w-[170px] h-[150px] md:h-[220px] pointer-events-none z-10">
                                    <img 
                                        src={himImage} 
                                        alt="For Him" 
                                        className="w-full h-full object-cover object-top drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    {/* For Her Card (Rounded Right, Sharp Left Corner) */}
                    <Link to="/category/women" className="block w-full h-[100px] md:h-[110px] relative">
                        <motion.div 
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute inset-0 bg-white rounded-r-3xl rounded-l-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-1.5 cursor-pointer"
                        >
                            {/* Inner Maroon Pill with Rounded-r and Sharp-l */}
                            <div className="w-full h-full bg-gradient-to-r from-[#4a1015] to-[#6b1e2e] rounded-r-2xl rounded-l-none flex items-center justify-end relative overflow-visible">
                                
                                {/* Model Image */}
                                <div className="absolute bottom-0 left-2 lg:left-6 w-[110px] md:w-[170px] h-[150px] md:h-[220px] pointer-events-none z-10">
                                    <img 
                                        src={herImage} 
                                        alt="For Her" 
                                        className="w-full h-full object-cover object-top drop-shadow-2xl"
                                        style={{ transform: 'scaleX(-1)' }}
                                    />
                                </div>

                                {/* Text & Button Content (Tightened gap-2 to remove space after arrow) */}
                                <div className="z-20 pr-5 md:pr-10 lg:pr-12 flex items-center gap-2 md:gap-3">
                                    <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide whitespace-nowrap">For Her</h3>
                                    <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center text-[#6b1e2e] shadow-lg group shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5.5 md:w-5.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default ProposalRings;
