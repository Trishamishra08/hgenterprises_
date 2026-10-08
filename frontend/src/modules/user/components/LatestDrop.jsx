import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const LatestDrop = () => {
    const { homepageSections, products } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['latest-drop'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    // Gather products to fill the carousel
    const configuredProductIds = displayItems.map(item => item.productId);
    const extraProducts = products.filter(p => !configuredProductIds.includes(p.id)).slice(0, 8);
    
    const carouselItems = [
        ...displayItems.map(item => {
            const p = products.find(prod => prod.id === item.productId);
            return {
                id: item.id || p?.id || Math.random().toString(),
                name: p ? (p.name || item.name) : item.name,
                image: p ? (p.image || item.image) : item.image,
                price: p ? `₹${p.price?.toLocaleString() || ''}` : item.price,
                path: p ? `/product/${p.id}` : item.path
            };
        }),
        ...extraProducts.map(p => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: `₹${p.price?.toLocaleString()}`,
            path: `/product/${p.id}`
        }))
    ];

    // Ensure unique items
    const uniqueItems = Array.from(new Map(carouselItems.map(item => [item.id, item])).values());
    
    // Slicing up to 8 items for optimal sliding rhythm
    const finalItems = uniqueItems.slice(0, 8);

    if (finalItems.length === 0) return null;

    return (
        <section className="pt-6 pb-12 md:pt-10 md:pb-20 bg-gradient-to-b from-[#1a0507] via-[#0d0203] to-[#150405] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-6 md:mb-10">
                    <h2 className="luxury-heading text-white mb-3">
                        {sectionData?.label || "Latest Drops"}
                    </h2>
                    <div className="h-[1px] w-12 bg-white/40 mx-auto mt-2"></div>
                </div>

                {/* 3D Curved Carousel Track */}
                <div className="carousel-3d-container">
                    <div className="carousel-3d-track">
                        {finalItems.map((item, index) => {
                            const angle = index * (360 / finalItems.length);
                            // Adjust radius based on screen size for optimal curvature
                            const radius = window.innerWidth < 768 ? 200 : 350;
                            
                            return (
                                <div
                                    key={item.id}
                                    className="carousel-3d-item"
                                    style={{ 
                                        transform: `rotateY(${angle}deg) translateZ(${radius}px)` 
                                    }}
                                >
                                    <Link to={item.path} className="block w-full h-full">
                                        <div className="relative w-full h-full rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-2xl group border border-white/10 bg-black/50 backdrop-blur-sm hover:border-[#8B4356]/40 hover:scale-[1.05] transition-all duration-500">
                                            
                                            {/* Background Image */}
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="absolute inset-0 w-full h-full object-cover transform duration-1000 group-hover:scale-110"
                                            />

                                            {/* Luxury Dark Gradient Overlay - Lighter for visibility */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

                                            {/* Content Centered at Bottom */}
                                            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 pb-4 md:pb-6 flex flex-col items-center justify-end text-center z-10">
                                                
                                                {/* Product Title */}
                                                <h3 className="font-serif text-white text-[9px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.15em] font-medium leading-relaxed line-clamp-2 px-1">
                                                    {item.name}
                                                </h3>

                                                {/* Price Tag */}
                                                <span className="text-[10px] md:text-sm text-white/80 font-serif tracking-widest mt-1 block">
                                                    {item.price}
                                                </span>

                                                {/* Explore CTA with elegant side lines */}
                                                <div className="flex items-center justify-center gap-2.5 mt-3.5 w-full">
                                                    <span className="w-5 md:w-8 h-[0.5px] bg-white/30"></span>
                                                    <span className="text-[8px] md:text-[10px] font-bold text-[#FDF1F2] tracking-[0.25em] uppercase font-serif">Explore</span>
                                                    <span className="w-5 md:w-8 h-[0.5px] bg-white/30"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Explore Button (Bottom) */}
                <div className="mt-8 flex justify-center">
                    <Link
                        to="/shop?sort=newest"
                        className="inline-flex items-center gap-2 text-white font-serif italic tracking-wider border-b border-white/50 pb-0.5 text-sm md:text-base group"
                    >
                        <span className="font-serif italic font-normal text-xs md:text-sm tracking-wider">Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default LatestDrop;
