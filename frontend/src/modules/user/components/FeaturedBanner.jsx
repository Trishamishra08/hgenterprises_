import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import bannerImgDefault from '../assets/proposal_banner.png';

const FeaturedBanner = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['featured-banner'];
    const displayItems = sectionData?.items || [];

    // Use first item for banner if available
    const bannerItem = displayItems[0];
    const bannerImage = bannerItem?.image || "https://images.unsplash.com/photo-1541888081622-1d54e4df9d1d?auto=format&fit=crop&q=80&w=800";
    const bannerLink = bannerItem?.path || "/category/machine";

    return (
        <section className="w-full bg-dark relative overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-primary/30 to-dark opacity-90"></div>

            <div className="container mx-auto px-2 md:px-4 relative z-10">
                <div className="flex flex-col items-center justify-center py-10 md:py-16 gap-6 text-center max-w-3xl mx-auto">

                    {/* Content Section - Centered */}
                    <div className="w-full space-y-4">
                        <div className="inline-block px-4 py-1.5 bg-primary/20 border border-primary/50 rounded-full mb-1 backdrop-blur-sm">
                            <span className="text-gold text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase">Industrial Excellence</span>
                        </div>

                        <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight uppercase tracking-tight">
                            {sectionData?.label || "Precision Machinery"} <br />
                            <span className="italic font-serif font-light text-[#E5E5E5] text-2xl md:text-4xl normal-case tracking-normal">For Artisans</span>
                        </h2>

                        <p className="text-gray-300 font-serif text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                            Elevate your craft with our advanced range of high-performance jewellery machines and smart tools. Engineered for durability and unmatched accuracy.
                        </p>

                        <div className="pt-2">
                            <Link
                                to={bannerLink}
                                className="inline-flex items-center gap-3 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-[#F0F0F0] transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)] group text-sm md:text-base"
                            >
                                <span className="tracking-wide uppercase font-serif font-normal">Explore Collection</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Items Grid (Satisfies "item add karne ka") */}
                {displayItems.length > 1 && (
                    <div className="pb-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {displayItems.slice(1).map((item, index) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="group relative rounded-2xl overflow-hidden aspect-square bg-[#2A0505] border border-[#4A1015]/50 shadow-xl"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <h4 className="text-white font-display text-lg tracking-wide uppercase">{item.name}</h4>
                                    <div className="w-8 h-[1px] bg-gold mx-auto mt-1 group-hover:w-16 transition-all duration-500"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedBanner;
