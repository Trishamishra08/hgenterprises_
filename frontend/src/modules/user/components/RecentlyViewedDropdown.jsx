import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

const RecentlyViewedDropdown = () => {
    const { getRecentlyViewed } = useShop();
    const [open, setOpen] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const wrapRef = useRef(null);
    const scrollRef = useRef(null);

    const items = getRecentlyViewed();

    useEffect(() => {
        const onOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onOutside);
        return () => document.removeEventListener('mousedown', onOutside);
    }, []);

    const handleClick = () => setOpen((prev) => !prev);

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * 180, behavior: 'smooth' });
    };

    return (
        <div
            ref={wrapRef}
            className="relative"
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
        >
            <button
                type="button"
                onClick={handleClick}
                aria-label="Recently viewed products"
                aria-expanded={open}
                className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 group transition-colors"
            >
                <Eye className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-[#EBCDD0] transition-colors" strokeWidth={1.75} />
            </button>

            <AnimatePresence>
                {showLabel && !open && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="recent-view-tooltip"
                    >
                        Recent
                    </motion.span>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="recent-view-panel"
                    >
                        <div className="recent-view-panel-header">
                            <h3 className="recent-view-panel-title">Recently Viewed</h3>
                            {items.length > 0 && (
                                <div className="recent-view-panel-nav">
                                    <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll left">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll right">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <p className="recent-view-empty">Browse products to see them here.</p>
                        ) : (
                            <div ref={scrollRef} className="recent-view-track scrollbar-hide">
                                {items.map((item) => {
                                    const img = item.image || item.images?.[0];
                                    const price = item.price || item.variants?.[0]?.price || 0;
                                    return (
                                        <Link
                                            key={item.id || item._id}
                                            to={`/product/${item.id || item._id}`}
                                            className="recent-view-card"
                                            onClick={() => setOpen(false)}
                                        >
                                            <div className="recent-view-card-img-wrap">
                                                <img src={img} alt={item.name} className="recent-view-card-img" />
                                            </div>
                                            <p className="recent-view-card-price">₹ {price.toLocaleString('en-IN')}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecentlyViewedDropdown;
