import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
    const { banners } = useShop();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!banners || banners.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    const nextSlide = () => banners && banners.length > 0 && setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => banners && banners.length > 0 && setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    if (!banners || banners.length === 0) return null;

    return (
        <div className="relative h-[500px] md:h-[750px] overflow-hidden bg-dark group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={banners[current].image}
                        alt={banners[current].title}
                        fetchPriority={current === 0 ? "high" : "auto"}
                        loading={current === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-2xl text-white space-y-8">
                        <motion.div
                            key={`text-${current}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >

                            <h1 className="text-5xl md:text-8xl font-serif font-normal leading-tight mb-8">
                                {banners[current].title}
                            </h1>
                            <Link
                                to="/shop"
                                className="inline-flex items-center space-x-3 bg-secondary text-white px-10 py-4 rounded-none font-medium hover:bg-white hover:text-dark transition-all transform hover:-translate-y-1 shadow-2xl"
                            >
                                <span className="uppercase tracking-widest text-sm">Discover Collection</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-3 border border-white/30 text-white hover:bg-white hover:text-dark transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-3 border border-white/30 text-white hover:bg-white hover:text-dark transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1 transition-all ${idx === current ? 'w-12 bg-secondary' : 'w-4 bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
