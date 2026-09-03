import React, { useMemo, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import { buildHandpickedCategories } from '../data/handpickedCategoryData';
import { getProductDepartment } from '../data/popularSearchData';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

const CategoryCircleImage = ({ src, fallback, alt }) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="handpicked-circle-img"
            onError={() => {
                if (fallback && imgSrc !== fallback) setImgSrc(fallback);
            }}
        />
    );
};

const HandpickedForYou = () => {
    const { products, categories, loading } = useShop();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isSticky, setIsSticky] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const [headerOffset, setHeaderOffset] = useState(0);

    const sectionRef = useRef(null);
    const sentinelRef = useRef(null);
    const navRef = useRef(null);
    const scrollRef = useRef(null);

    const [fogEdges, setFogEdges] = useState({ left: false, right: true });

    const categoryItems = useMemo(
        () => buildHandpickedCategories(categories),
        [categories]
    );

    const displayProducts = useMemo(() => {
        if (!products?.length) return [];

        let list = products;
        if (activeFilter !== 'all') {
            const cat = categoryItems.find(
                (c) => c.id === activeFilter || c.slug === activeFilter || c.name === activeFilter
            );
            const matchKey = normalizeKey(cat?.name || cat?.slug || activeFilter);
            list = products.filter(
                (p) =>
                    normalizeKey(p.category) === matchKey ||
                    normalizeKey(p.subcategory) === matchKey ||
                    normalizeKey(p.category).includes(matchKey) ||
                    matchKey.includes(normalizeKey(p.category))
            );
        }

        if (activeFilter !== 'all') {
            return list.slice(0, 24);
        }

        const jewellery = [];
        const others = [];
        list.forEach((p) => {
            const dept = getProductDepartment(p.department || p.category || p.name || '');
            if (dept === 'jewellery') jewellery.push(p);
            else others.push(p);
        });

        const jewelleryCount = Math.min(jewellery.length, 18);
        const otherCount = Math.min(others.length, 24 - jewelleryCount);
        return [...jewellery.slice(0, jewelleryCount), ...others.slice(0, otherCount)];
    }, [products, activeFilter, categoryItems]);

    const measureHeaderOffset = useCallback(() => {
        const siteHeader = document.querySelector('[data-site-header]');
        const mobileNav = document.querySelector('nav.sticky');

        if (window.innerWidth < 768 && mobileNav) {
            setHeaderOffset(mobileNav.getBoundingClientRect().height);
        } else if (siteHeader) {
            const rect = siteHeader.getBoundingClientRect();
            setHeaderOffset(rect.bottom > 0 ? rect.bottom : 0);
        } else {
            setHeaderOffset(0);
        }
    }, []);

    useLayoutEffect(() => {
        measureHeaderOffset();
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight);
        }
    }, [measureHeaderOffset, categoryItems.length, isSticky]);

    useEffect(() => {
        window.addEventListener('resize', measureHeaderOffset);
        return () => window.removeEventListener('resize', measureHeaderOffset);
    }, [measureHeaderOffset]);

    useEffect(() => {
        const onScroll = () => {
            const section = sectionRef.current;
            const sentinel = sentinelRef.current;
            const nav = navRef.current;
            if (!section || !sentinel || !nav) return;

            measureHeaderOffset();

            const sentinelRect = sentinel.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const navH = nav.offsetHeight || navHeight || 88;
            const top = headerOffset;

            const pastNavPoint = sentinelRect.top <= top;
            const stillInSection = sectionRect.bottom > top + navH + 40;

            setIsSticky(pastNavPoint && stillInSection);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [headerOffset, navHeight, measureHeaderOffset]);

    const updateScrollFog = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;
        const maxScroll = scrollWidth - clientWidth;
        setFogEdges({
            left: scrollLeft > 4,
            right: maxScroll > 4 && scrollLeft < maxScroll - 4,
        });
    }, []);

    useEffect(() => {
        updateScrollFog();
        window.addEventListener('resize', updateScrollFog);

        const el = scrollRef.current;
        let ro;
        if (el && typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(updateScrollFog);
            ro.observe(el);
        }

        return () => {
            window.removeEventListener('resize', updateScrollFog);
            ro?.disconnect();
        };
    }, [updateScrollFog, categoryItems.length]);

    if (loading) {
        return (
            <section className="handpicked-section bg-white">
                <div className="container mx-auto px-4 pt-2 pb-6">
                    <Skeleton className="h-9 w-56 mx-auto mb-8" />
                    <div className="flex gap-4 overflow-hidden mb-8 px-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                                <Skeleton className="w-14 h-14 rounded-full" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="w-full aspect-[4/5] rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products?.length) return null;

    return (
        <section ref={sectionRef} className="handpicked-section bg-white relative">
            {/* Sticky trigger point — nav sticks when this reaches viewport top */}
            <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

            {isSticky && navHeight > 0 && (
                <div style={{ height: navHeight }} aria-hidden="true" />
            )}

            <div
                ref={navRef}
                className={`handpicked-circle-nav w-full ${isSticky ? 'handpicked-circle-nav--sticky' : ''}`}
                style={isSticky ? { top: headerOffset } : undefined}
            >
                <div className="text-center pt-4 md:pt-5 pb-2 md:pb-3 px-4">
                    <h2 className="handpicked-heading">Handpicked for You</h2>
                </div>

                <div
                    className={`handpicked-scroll-fog-wrap${fogEdges.left ? ' has-left-fog' : ''}${
                        fogEdges.right ? ' has-right-fog' : ''
                    }`}
                >
                    <div
                        ref={scrollRef}
                        onScroll={updateScrollFog}
                        className="handpicked-circle-scroll flex items-start gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-2 sm:px-4 md:px-6 py-2 md:py-2.5"
                    >
                    <Link to="/shop" className="handpicked-circle-item shrink-0">
                        <div className="handpicked-circle-icon handpicked-circle-icon--filters">
                            <SlidersHorizontal className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                        </div>
                        <span className="handpicked-circle-label">Filters</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className="handpicked-circle-item shrink-0"
                    >
                        <div
                            className={`handpicked-circle-icon ${
                                activeFilter === 'all' ? 'handpicked-circle-icon--active' : ''
                            }`}
                        >
                            <LayoutGrid className="w-5 h-5 text-[#e85d75]" strokeWidth={1.5} />
                        </div>
                        <span
                            className={`handpicked-circle-label ${
                                activeFilter === 'all' ? 'handpicked-circle-label--active' : ''
                            }`}
                        >
                            All
                        </span>
                    </button>

                    {categoryItems.map((cat) => {
                        const tabId = cat.id || cat.slug;
                        const isActive = activeFilter === tabId;

                        return (
                            <button
                                key={cat.slug}
                                type="button"
                                onClick={() => setActiveFilter(tabId)}
                                className="handpicked-circle-item shrink-0"
                            >
                                <div
                                    className={`handpicked-circle-icon handpicked-circle-icon--photo ${
                                        isActive ? 'handpicked-circle-icon--active' : ''
                                    }`}
                                >
                                    <CategoryCircleImage
                                        src={cat.image}
                                        fallback={cat.fallbackImage}
                                        alt={cat.name}
                                    />
                                </div>
                                <span
                                    className={`handpicked-circle-label ${
                                        isActive ? 'handpicked-circle-label--active' : ''
                                    }`}
                                >
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                    </div>
                </div>

                {/* Bottom fog — products fade under sticky bar while scrolling */}
                {isSticky && <div className="handpicked-sticky-fog" aria-hidden="true" />}
            </div>

            <div
                className={`handpicked-products-wrap${isSticky ? ' handpicked-products-wrap--under-sticky' : ''}`}
            >
            <div className="container mx-auto px-2 md:px-4 pb-8 md:pb-12">
                {displayProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 text-gray-400 text-sm"
                    >
                        No products in this category yet.{' '}
                        <Link to="/shop" className="text-[#6b252c] underline">
                            Browse all
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4"
                    >
                        {displayProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={{
                                    duration: 0.35,
                                    delay: Math.min(index * 0.04, 0.4),
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-8 md:mt-10 flex justify-center"
                >
                    <Link
                        to="/shop"
                        className="text-sm font-medium text-[#6b252c] border-b border-[#6b252c]/30 pb-0.5 hover:border-[#6b252c] transition-colors"
                    >
                        View all jewellery
                    </Link>
                </motion.div>
            </div>
            </div>
        </section>
    );
};

function normalizeKey(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default HandpickedForYou;
