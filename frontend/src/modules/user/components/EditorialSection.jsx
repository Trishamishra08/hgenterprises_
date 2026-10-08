import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import all premium local editorial assets
import feature1 from '../../../assets/editorial/clean_feature1.png';
import feature2 from '../../../assets/editorial/clean_feature2.png';
import detail1 from '../../../assets/editorial/detail1.png';
import detail2 from '../../../assets/editorial/detail2.png';
import item3 from '../../../assets/editorial/clean_item3.png';
import item4 from '../../../assets/editorial/item4.png';
import item5 from '../../../assets/editorial/item5.png';
import item6 from '../../../assets/editorial/item6.png';
import item7 from '../../../assets/editorial/item7.png';
import item8 from '../../../assets/editorial/item8.png';
import item9 from '../../../assets/editorial/item9.png';
import item10 from '../../../assets/editorial/item10.png';
import item11 from '../../../assets/editorial/item11.png';
import item12 from '../../../assets/editorial/item12.png';

// Premium editorial-style imagery sets
const block1Images = [feature1, item3, item4, item5, item6, detail1, item7];
const block2Images = [feature2, item8, item9, item10, item11, detail2, item12];

// Luxurious titles and descriptions for each image index on the back of the card
const block1Details = [
    { title: "Bridal Couture", desc: "Handcrafted masterworks for your special day." }, // feature1
    { title: "Diamond Bands", desc: "Infinite elegance set in precious 18K gold." }, // item3
    { title: "Gold Chains", desc: "Premium links woven with royal heritage." }, // item4
    { title: "Fine Bracelets", desc: "Delicate wrists adorned with artisan luxury." }, // item5
    { title: "Royal Pendants", desc: "A sacred centerpiece of eternal grace." }, // item6
    { title: "BIS Hallmark", desc: "Certified pure and authenticated treasures." }, // detail1
    { title: "Luxury Rings", desc: "Precision-cut stones of unrivaled beauty." }  // item7
];

const block2Details = [
    { title: "Emerald Drop", desc: "Vibrant royal gems capturing eternal light." }, // feature2
    { title: "Choker Necklace", desc: "An architectural statement of gold filigree." }, // item8
    { title: "Gold Bangles", desc: "Traditional solid crafts with modern wearability." }, // item9
    { title: "Gift Sets", desc: "Carefully curated tokens of love and esteem." }, // item10
    { title: "Luxury Pearls", desc: "Ocean's finest pearls strung in premium gold." }, // item11
    { title: "Signature Gems", desc: "Expertly sourced rubies, emeralds, and sapphires." }, // detail2
    { title: "Artisan Chains", desc: "Heavy hand-carved heritage gold chains." } // item12
];

// Interactive 3D Flip Card Component for premium luxury editorial page
const FlipCard = ({ frontImage, backContent, className, delay = 0, slideDirection, children }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    let initialX = 0;
    let initialScale = 1;
    const shiftDistance = isMobile ? 30 : 120;

    if (slideDirection === "left") {
        initialX = shiftDistance;
    } else if (slideDirection === "right") {
        initialX = -shiftDistance;
    } else {
        initialScale = 0.95;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: initialX, scale: initialScale }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.02 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1], delay: delay }}
            className={`relative group cursor-pointer ${className}`}
            style={{ perspective: '1200px' }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Inner Card Flipper */}
            <div
                className="w-full h-full relative"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            >
                {/* Front Face */}
                <div
                    className="relative w-full h-full rounded-lg overflow-hidden border border-black/5"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    {children ? children : (
                        <>
                            <img
                                src={frontImage}
                                alt="Editorial Front"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500"></div>
                        </>
                    )}
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-[#2D0A0D] via-[#4A1015] to-[#150405] p-3 flex flex-col items-center justify-center text-center border border-white/5 shadow-inner"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    {/* Luxurious blurry background element */}
                    <div className="absolute inset-0 opacity-[0.12] filter blur-md pointer-events-none">
                        <img src={frontImage} className="w-full h-full object-cover" alt="" />
                    </div>

                    {/* Gold filigree borders */}
                    <div className="absolute inset-1.5 border border-[#c4a265]/15 pointer-events-none rounded-md"></div>
                    <div className="absolute inset-2 border border-[#c4a265]/5 pointer-events-none rounded-md"></div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-1.5">
                        <span className="font-serif italic text-[#c4a265] text-[7px] md:text-[8px] tracking-[0.25em] mb-1">HG SELECTION</span>
                        <h4 className="font-serif text-[10px] md:text-sm font-bold text-white uppercase tracking-[0.1em] mb-1.5 line-clamp-2 leading-tight">
                            {backContent?.title}
                        </h4>
                        <div className="h-[1px] w-6 bg-[#c4a265]/35 my-1.5"></div>
                        <p className="text-[#FAF5F6]/75 text-[7px] md:text-[10px] leading-relaxed max-w-[95%] font-serif italic mb-3.5 line-clamp-3">
                            {backContent?.desc}
                        </p>
                        <Link
                            to="/shop"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white hover:bg-gold text-dark hover:text-white text-[7px] md:text-[8.5px] font-bold uppercase tracking-[0.15em] py-1 px-3 shadow-md transition-all rounded-sm"
                        >
                            Explore
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EditorialSection = () => {
    return (
        <section className="pt-0 md:pt-2 pb-4 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                
                {/* Section Header - Matched to Shop by Recipient Style */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        OUR VISION
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark mb-2 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Our <span className="italic text-[#8c2a3e] font-normal">Editorial</span>
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>
                
                {/* --- Block 1: Bluestone Grid Pattern (Mobile: 3cols) --- */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6 mb-2 md:mb-6">
                    
                    {/* Big Feature (2x2 on Mobile) */}
                    <FlipCard 
                        frontImage={block1Images[0]}
                        backContent={block1Details[0]}
                        className="col-span-2 row-span-2 relative group min-h-[280px] md:min-h-0 md:h-full" 
                        delay={0}
                    >
                        <img 
                            src={block1Images[0]} 
                            alt="Editorial" 
                            className="w-full h-full object-cover animate-fade-in"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-fit" style={{ transform: 'translateZ(30px) translateX(-50%)' }}>
                            <Link 
                                to="/shop"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white text-dark px-4 py-1.5 rounded-sm text-[8px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-md hover:bg-primary hover:text-white transition-colors block text-center"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </FlipCard>

                    {/* Row 1 Small Cards (Right to Left Slide) */}
                    <FlipCard 
                        frontImage={block1Images[1]}
                        backContent={block1Details[1]}
                        className="col-span-1 row-span-1 relative h-[130px] md:h-auto" 
                        delay={0.05} 
                        slideDirection="left"
                    />
                    <FlipCard 
                        frontImage={block1Images[2]}
                        backContent={block1Details[2]}
                        className="col-span-1 row-span-1 relative h-[130px] md:h-auto" 
                        delay={0.1} 
                        slideDirection="left"
                    />
                    <FlipCard 
                        frontImage={block1Images[3]}
                        backContent={block1Details[3]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.15} 
                        slideDirection="left"
                    />

                    {/* Row 2 Small Cards (Left to Right Slide) */}
                    <FlipCard 
                        frontImage={block1Images[4]}
                        backContent={block1Details[4]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.05} 
                        slideDirection="right"
                    />
                    <FlipCard 
                        frontImage={block1Images[5]}
                        backContent={block1Details[5]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.1} 
                        slideDirection="right"
                    />
                    <FlipCard 
                        frontImage={block1Images[6]}
                        backContent={block1Details[6]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto hidden md:block" 
                        delay={0.15} 
                        slideDirection="right"
                    />
                </div>

                {/* --- Block 2: Continued Pattern (Mobile: 3cols) --- */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6">
                    
                    {/* Row 1 Small Cards (Right to Left Slide) */}
                    <FlipCard 
                        frontImage={block2Images[1]}
                        backContent={block2Details[1]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.05} 
                        slideDirection="left"
                    />
                    <FlipCard 
                        frontImage={block2Images[2]}
                        backContent={block2Details[2]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.1} 
                        slideDirection="left"
                    />
                    <FlipCard 
                        frontImage={block2Images[3]}
                        backContent={block2Details[3]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.15} 
                        slideDirection="left"
                    />

                    {/* Big Feature (Anchor Block) */}
                    <FlipCard 
                        frontImage={block2Images[0]}
                        backContent={block2Details[0]}
                        className="col-span-2 row-span-2 relative group min-h-[280px] md:min-h-0 md:h-full" 
                        delay={0.1}
                    >
                        <img 
                            src={block2Images[0]} 
                            alt="Editorial" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-fit" style={{ transform: 'translateZ(30px) translateX(-50%)' }}>
                            <Link 
                                to="/shop"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white text-dark px-4 py-1.5 rounded-sm text-[8px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-md hover:bg-primary hover:text-white transition-colors block text-center"
                            >
                                Shop Now
                            </Link>
                        </div>
                    </FlipCard>

                    {/* Row 2 Small Cards (Left to Right Slide) */}
                    <FlipCard 
                        frontImage={block2Images[4]}
                        backContent={block2Details[4]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.05} 
                        slideDirection="right"
                    />
                    <FlipCard 
                        frontImage={block2Images[5]}
                        backContent={block2Details[5]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto" 
                        delay={0.1} 
                        slideDirection="right"
                    />
                    <FlipCard 
                        frontImage={block2Images[6]}
                        backContent={block2Details[6]}
                        className="col-span-1 h-[130px] md:min-h-0 md:h-auto hidden md:block" 
                        delay={0.15} 
                        slideDirection="right"
                    />
                </div>
            </div>
        </section>
    );
};

export default EditorialSection;
