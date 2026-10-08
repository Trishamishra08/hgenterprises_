import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

const RecommendedForYou = () => {
    const { products, loading } = useShop();
    const scrollRef = useRef(null);

    const recommendedProducts = useMemo(() => {
        if (!products?.length) return [];
        const offset = Math.min(6, Math.max(0, products.length - 8));
        const rotated = [...products.slice(offset), ...products.slice(0, offset)];
        return rotated.slice(0, 10);
    }, [products]);

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.75;
        el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <section className="recommended-section bg-[#fafafa]">
                <div className="container mx-auto px-4 py-6">
                    <Skeleton className="h-8 w-52 mb-6" />
                    <div className="flex gap-3 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="w-[160px] md:w-[200px] shrink-0 aspect-[4/5] rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (recommendedProducts.length < 4) return null;

    return (
        <section className="recommended-section bg-[#fafafa] border-t border-gray-100">
            <div className="container mx-auto px-3 md:px-4 pt-4 pb-6 md:pt-5 md:pb-8">
                <div className="flex items-end justify-between gap-4 mb-4 md:mb-5">
                    <h2
                        className="text-xl md:text-2xl font-serif font-semibold text-[#1a1a1a] tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        Recommended for You
                    </h2>
                    <Link
                        to="/shop"
                        className="hidden md:inline text-sm font-medium text-[#6b252c] hover:underline shrink-0"
                    >
                        View all
                    </Link>
                </div>

                <div className="relative group/rec">
                    <button
                        type="button"
                        onClick={() => scrollBy(-1)}
                        className="recommended-nav recommended-nav-left hidden md:flex"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="recommended-track flex gap-2.5 md:gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide snap-x snap-mandatory"
                    >
                        {recommendedProducts.map((product) => (
                            <div
                                key={product.id}
                                className="recommended-card snap-start shrink-0 w-[calc(50%-5px)] sm:w-[180px] md:w-[200px] lg:w-[220px]"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollBy(1)}
                        className="recommended-nav recommended-nav-right hidden md:flex"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RecommendedForYou;
