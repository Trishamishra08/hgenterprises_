
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, ShoppingBag, ChevronDown, MoveRight, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryShowcase from '../components/CategoryShowcase';
import OfferBannerCarousel from '../components/OfferBannerCarousel';
import HandpickedForYou from '../components/HandpickedForYou';
import RecommendedForYou from '../components/RecommendedForYou';
import GoldMinePlanBanner from '../components/GoldMinePlanBanner';
import PriceRangeShowcase from '../components/PriceRangeShowcase';
import PerfectGift from '../components/PerfectGift';
import NewLaunchSection from '../components/NewLaunchSection';
import LatestDrop from '../components/LatestDrop';
import MostGifted from '../components/MostGifted';
import CuratedForYou from '../components/CuratedForYou';
import ProposalRings from '../components/ProposalRings';
import EditorialSection from '../components/EditorialSection';
import StyleItYourWay from '../components/StyleItYourWay';
import AllProducts from '../components/AllProducts';
import BrandPromises from '../components/BrandPromises';
import HGPromise from '../components/HGPromise';
import FAQSection from '../components/FAQSection';
import ChitChatSection from '../components/ChitChatSection';
import TestimonialSection from '../components/TestimonialSection';
import HGAdvantageSection from '../components/HGAdvantageSection';
import ServicesSection from '../components/ServicesSection';

import spotlightMain from '../assets/spotlight_silver_main.png';
import spotlightHover from '../assets/spotlight_silver_hover.png';

import trendingHeritage from '../assets/trending_heritage.png';
import trendingModern from '../assets/trending_modern.png';

const Home = () => {
    const { products, banners, loading } = useShop();
    const featuredProducts = products.slice(0, 3);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [activeFaq, setActiveFaq] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTrendingIndex, setActiveTrendingIndex] = useState(0);

    const trendingSlides = [
        {
            id: 1,
            subtitle: "Heritage Collection",
            title: "Timeless",
            titleItalic: "Elegance",
            desc: "No longer search for \"authentic silver jewelry\". You've found it.",
            image: trendingHeritage
        },
        {
            id: 2,
            subtitle: "Modern Statement",
            title: "Empowering",
            titleItalic: "Style",
            desc: "From bold statements to subtle whispers, find pieces that celebrate you.",
            image: trendingModern
        }
    ];

    // Dynamic Hero Slides from Database
    const heroSlides = banners.map(b => ({
        id: b._id,
        image: b.image,
        video: b.video, // Use dynamic video field from database
        title: b.title,
        titleItalic: b.badge || 'collection',
        description: b.description || 'Luxury Crafted with Precision.',
        btnText: b.btnText || "Explore Selection",
        link: b.link || '/shop'
    }));

    // Slide timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    // Animation Variants
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="bg-white font-body text-black relative selection:bg-primary selection:text-white">


            {/* Hero Section - Video Banners like Bluestone */}
            <section className="relative overflow-hidden bg-white">
                <div className="relative h-[300px] md:h-[calc(100vh-130px)] overflow-hidden">
                    {heroSlides.length > 0 ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {/* Video Background - key forces re-mount on slide change */}
                                {heroSlides[currentSlide]?.video ? (
                                    <video
                                        key={`video-${currentSlide}`}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover"
                                    >
                                        <source src={heroSlides[currentSlide].video} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={heroSlides[currentSlide]?.image}
                                        alt={heroSlides[currentSlide]?.title}
                                        className="absolute inset-0 w-full h-full object-cover transform scale-100 animate-slow-zoom"
                                    />
                                )}
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                    <div className="container mx-auto px-4">
                                        <div className="flex flex-col items-center justify-center text-white text-center">

                                            {/* Premium Compact Typography */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentSlide}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.8 }}
                                                    className="relative flex flex-col items-center"
                                                >
                                                    {/* Removed redundant brand badge */}
                                                    <h1 className="font-serif uppercase leading-none mb-2 px-4">
                                                        {/* Mobile Split Title */}
                                                        <span className="md:hidden block">
                                                            <span className="block text-2xl font-normal tracking-[0.2em] mb-2">HARSHAD</span>
                                                            <span className="block text-2xl font-normal tracking-[0.2em] mb-3">GAURI</span>
                                                        </span>
                                                        {/* Desktop Single Line Title */}
                                                        <span className="hidden md:block text-5xl font-normal drop-shadow-2xl text-white tracking-[0.3em]">
                                                            {heroSlides[currentSlide].title}
                                                        </span>

                                                        {/* Enlarged Italic Subtitle for Mobile */}
                                                        <span className="block font-serif italic lowercase font-normal text-2xl md:text-3xl text-gold-light mt-1 tracking-normal">
                                                            {heroSlides[currentSlide].titleItalic}
                                                        </span>
                                                    </h1>

                                                    {/* Minimalist Centered Divider - Extra Thin */}
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '60px' }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-[1px] bg-secondary/50 mt-4 mb-4"
                                                    />


                                                    {/* Elegant CTA - Close to main text */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.8, delay: 0.8 }}
                                                    >
                                                        <Link to={heroSlides[currentSlide].link} className="group flex flex-col items-center">
                                                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/70 group-hover:text-white transition-all">
                                                                Explore Selection
                                                            </span>
                                                        </Link>
                                                    </motion.div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                            <span className="text-gray-400 font-serif italic uppercase tracking-widest text-[10px]">HG Enterprises Loading Cinematic...</span>
                        </div>
                    )}


                    {/* Pagination Dots - Larger on mobile for better visibility */}
                    {/* Pagination Dots - Only show if multiple slides */}
                    {heroSlides.length > 1 && (
                        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                            {heroSlides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-2 md:h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 md:w-10 bg-white' : 'w-2 md:w-1.5 bg-white/50 md:bg-white/40 active:bg-white/70 md:hover:bg-white/60'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}


                </div>
            </section>

            {/* CATEGORY SHOWCASE - Replaces Mobile Stories */}
            <CategoryShowcase />

            {/* OFFER BANNERS - BlueStone-style carousel */}
            <OfferBannerCarousel />

            {/* PRICE RANGE SHOWCASE - Luxury Within Reach */}
            <PriceRangeShowcase />

            {/* NEW LAUNCH / LIMITED EDITION SECTION */}
            <NewLaunchSection />

            {/* HANDPICKED FOR YOU - BlueStone product grid with category tabs */}
            <HandpickedForYou />

            {/* RECOMMENDED FOR YOU - BlueStone horizontal product row */}
            <RecommendedForYou />

            {/* GOLD MINE 10+1 MONTHLY PLAN BANNER */}
            <GoldMinePlanBanner />

            {/* PERFECT GIFT SECTION */}
            <PerfectGift />

            {/* CURATED FOR YOU - Occasions */}
            <CuratedForYou />

            {/* PROPOSAL RINGS BANNER */}
            <ProposalRings />

            {/* LATEST DROP SECTION */}
            <LatestDrop />

            {/* MOST GIFTED ITEMS */}
            <MostGifted />

            {/* EDITORIAL SECTION */}
            <EditorialSection />



            {/* STYLE IT YOUR WAY SECTION */}
            <StyleItYourWay />


            {/* ALL PRODUCTS SECTION */}
            <AllProducts />

            {/* SERVICES — Machine & Jewelry */}
            <ServicesSection />

            {/* THE HG ADVANTAGE — compact BlueStone-style mosaic grid */}
            <HGAdvantageSection />

            {/* BRAND PROMISES SECTION (Why Choose Us) */}
            <BrandPromises />

            {/* CUSTOMER STORIES - BlueStone #HGAndMe clothesline */}
            <TestimonialSection />

            {/* HG PROMISE SECTION */}
            <HGPromise />

            {/* CHIT CHAT SECTION */}
            <ChitChatSection />

            {/* FAQ SECTION */}
            <FAQSection />

        </div>
    );
};

export default Home;
