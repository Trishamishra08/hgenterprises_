import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

const AllProducts = () => {
    const { products, loading } = useShop();

    if (loading || !products || products.length === 0) {
        return (
            <section className="pt-4 pb-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <Skeleton className="h-4 w-32 mx-auto mb-2" />
                        <Skeleton className="h-10 w-64 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col gap-3">
                                <Skeleton className="w-full aspect-square rounded-[2rem]" />
                                <Skeleton className="h-4 w-3/4 mx-auto" />
                                <Skeleton className="h-3 w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // 3 full rows on lg (5 cols) — avoid a lone card leaving empty space
    const displayProducts = products.slice(0, 15);

    return (
        <section className="pt-0 md:pt-2 pb-2 md:pb-4 bg-white overflow-hidden">
            <div className="container mx-auto px-2 md:px-4">

                {/* Centered Header - Matched to Shop by Recipient Style */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        OUR COLLECTION
                    </span>
                    <h2 className="luxury-heading text-dark mb-2">
                        All <span className="italic text-[#8c2a3e] font-normal">Products</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>

                {/* Grid - Using the standard ProductCard component with tighter gaps */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5 items-stretch">
                    {displayProducts.map((product) => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Subtle View All Link at Bottom */}
                <div className="mt-6 md:mt-8 flex justify-center">
                    <Link
                        to="/shop"
                        className="group flex items-center gap-3 text-sm font-medium text-primary transition-all"
                    >
                        <span className="border-b border-primary pb-0.5 group-hover:text-gold group-hover:border-gold transition-all">
                            View Full Collection
                        </span>
                        <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
