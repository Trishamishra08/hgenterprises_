import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

const AboutUs = () => {
    const { settings } = useShop();
    const aboutData = settings?.aboutContent;

    // Curated high-end jewellery photography with multi-CDN redundancy for maximum reliability
    const defaultGallery = [
        "https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=600"
    ];

    const galleryItems = aboutData?.images?.length > 0
        ? aboutData.images.map(img => img.url)
        : defaultGallery;

    return (
        <div className="bg-[#fdf2f8] min-h-screen relative overflow-hidden flex flex-col items-center pb-0">

            {/* Gallery Wrapper with High-End Depth Background */}
            <div className="w-full relative py-6 lg:py-8 bg-gradient-to-b from-[#fdf2f8] via-[#eecad5] to-[#fdf2f8] overflow-hidden">

                {/* Subtle Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-full bg-[radial-gradient(circle_at_center,_rgba(238,202,213,0.4)_0%,_transparent_70%)] pointer-events-none z-0"></div>

                {/* Desktop Version: Curated Compact Gallery */}
                <div className="hidden md:block max-w-7xl mx-auto px-10 relative z-10 pt-14 md:pt-20">
                    <div className="grid grid-cols-12 gap-6 items-center">
                        {/* Left Column Shards */}
                        <div className="col-span-3 flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -15, 0],
                                    rotate: [0, -2, 0]
                                }}
                                transition={{
                                    opacity: { duration: 1 },
                                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="aspect-[3/4] w-32 mx-auto rounded-[2rem] overflow-hidden border-2 border-white shadow-lg"
                            >
                                <img src={galleryItems[0]} alt="jewelry" className="w-full h-full object-cover" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, 15, 0],
                                    rotate: [-3, -5, -3]
                                }}
                                transition={{
                                    opacity: { duration: 1, delay: 0.2 },
                                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="aspect-[3/4] w-32 mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg transform -rotate-3"
                            >
                                <img src={galleryItems[1]} alt="jewelry" className="w-full h-full object-cover" />
                            </motion.div>
                        </div>

                        {/* Center Piece (Typography + Focus Images) */}
                        <div className="col-span-6 flex flex-col items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center mb-6 px-4"
                            >
                                <h1 className="font-serif italic text-4xl lg:text-[5rem] text-[#4a1d1d]/90 tracking-tighter leading-none select-none drop-shadow-lg uppercase">
                                    {aboutData?.heroTitle || "Our Story"}
                                </h1>
                                <p className="mt-4 text-[10px] lg:text-sm font-serif italic text-[#4a1d1d]/60 max-w-md mx-auto leading-relaxed">
                                    {aboutData?.heroSubtitle || ""}
                                </p>
                            </motion.div>
                            <div className="flex gap-3 w-full justify-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, -10, 0]
                                    }}
                                    transition={{
                                        opacity: { duration: 1, delay: 0.3 },
                                        scale: { duration: 1, delay: 0.3 },
                                        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="w-24 h-32 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl relative z-20"
                                >
                                    <img src={galleryItems[2]} alt="jewelry" className="w-full h-full object-cover" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, 10, 0]
                                    }}
                                    transition={{
                                        opacity: { duration: 1, delay: 0.4 },
                                        scale: { duration: 1, delay: 0.4 },
                                        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="w-24 h-32 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl relative z-20"
                                >
                                    <img src={galleryItems[3]} alt="jewelry" className="w-full h-full object-cover" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Column Shards */}
                        <div className="col-span-3 flex flex-col gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, -12, 0],
                                    rotate: [3, 5, 3]
                                }}
                                transition={{
                                    opacity: { duration: 1, delay: 0.5 },
                                    y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="aspect-[3/4] w-32 mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg transform rotate-3"
                            >
                                <img src={galleryItems[4]} alt="jewelry" className="w-full h-full object-cover" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, 18, 0],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{
                                    opacity: { duration: 1, delay: 0.6 },
                                    y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="aspect-[3/4] w-32 mx-auto rounded-[2rem] overflow-hidden border-2 border-white shadow-lg"
                            >
                                <img src={galleryItems[5]} alt="jewelry" className="w-full h-full object-cover" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden w-full px-6 flex flex-col items-center relative z-10 -mt-12 pt-12 text-center">
                    <h1 className="font-serif italic text-4xl text-[#4a1d1d]/90 tracking-tighter py-4 uppercase">
                        {aboutData?.heroTitle || "Our Story"}
                    </h1>
                    <p className="mb-6 text-[10px] font-serif italic text-[#4a1d1d]/60 leading-relaxed max-w-[280px]">
                        {aboutData?.heroSubtitle || ""}
                    </p>

                    <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-4">
                        {galleryItems.slice(0, 3).map((src, idx) => (
                            <motion.div
                                key={`m-top-${idx}`}
                                animate={{ y: [0, idx % 2 === 0 ? -12 : 12, 0] }}
                                transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut" }}
                                className={`aspect-[3/4] rounded-3xl overflow-hidden border-2 border-white shadow-2xl ${idx === 1 ? 'mt-4 scale-105' : ''}`}
                            >
                                <img src={src} className="w-full h-full object-cover" alt="jewelry" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Narrative Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-3 max-w-[95%] lg:max-w-6xl px-8 mb-8 relative z-10">
                {aboutData?.features?.slice(0, 3).map((feature, idx) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/40 backdrop-blur-xl rounded-none p-8 border border-white/40 shadow-sm text-center flex flex-col items-center min-h-[220px]"
                    >
                        <h2 className="text-xl font-serif text-[#4a1d1d] mb-2 italic tracking-tight leading-none">{feature.title}</h2>
                        <div className="h-[1px] w-10 bg-[#4a1d1d]/10 mb-4"></div>
                        <p className="text-[11px] font-serif text-[#4a1d1d]/70 leading-relaxed italic">
                            "{feature.description}"
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Main Narrative - Full Width Elegant Story */}
            <div className="w-full max-w-4xl px-6 mb-20 text-center relative z-10">
                <div className="h-[1px] w-24 bg-primary/20 mx-auto mb-8"></div>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="font-serif text-sm md:text-xl text-[#4a1d1d]/80 italic leading-loose tracking-wide md:px-12"
                >
                    {aboutData?.mainStory}
                </motion.p>
                <div className="h-[1px] w-24 bg-primary/20 mx-auto mt-8"></div>
            </div>

            {/* Mobile View: Vertical Narrative Stack (Legacy Support) */}
            <div className="md:hidden w-full flex flex-col items-center px-6">
                {/* Mobile Heritage Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full bg-[#f0dae4]/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-2xl text-center mb-10"
                >
                    <h2 className="text-3xl font-serif text-[#4a1d1d] mb-6 italic">The Heritage</h2>
                    <p className="text-base font-serif text-[#4a1d1d]/70 italic leading-relaxed pt-6 border-t border-[#4a1d1d]/10">
                        "At HG Enterprises, we believe that true luxury lies in the pure essence of craftsmanship. Our journey is a tribute to silver."
                    </p>
                </motion.div>

                {/* Mobile Philosophy Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full bg-[#f0dae4]/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-2xl text-center mb-10"
                >
                    <h2 className="text-3xl font-serif text-[#4a1d1d] mb-6 italic">Our Philosophy</h2>
                    <p className="text-base font-serif text-[#4a1d1d]/70 italic leading-relaxed pt-6 border-t border-[#4a1d1d]/10">
                        "Inspired by quiet, meaningful moments—the sunlit morning glow or the first touch of pure metal on skin."
                    </p>
                </motion.div>

                {/* Mobile Approach Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full bg-[#f0dae4]/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-2xl text-center mb-10"
                >
                    <h2 className="text-3xl font-serif text-[#4a1d1d] mb-6 italic">Our Approach</h2>
                    <p className="text-base font-serif text-[#4a1d1d]/70 italic leading-relaxed pt-6 border-t border-[#4a1d1d]/10">
                        "Merging traditional metallurgy with modern aesthetics. No two pieces share the exact same soul."
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUs;
