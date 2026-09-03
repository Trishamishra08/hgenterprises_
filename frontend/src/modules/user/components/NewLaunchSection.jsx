import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { resolveCatalogImage } from '../data/catalogImages';
import catRings from '../assets/cat_rings.png';

const LaunchCard = ({ item, index }) => {
    const itemLabel = item.name || item.label;
    const isMachine = itemLabel && (
        itemLabel.toLowerCase().includes('welder') ||
        itemLabel.toLowerCase().includes('machine') ||
        itemLabel.toLowerCase().includes('vacuum') ||
        itemLabel.toLowerCase().includes('laser') ||
        itemLabel.toLowerCase().includes('printer')
    );
    const initialSrc = resolveCatalogImage(item.image, itemLabel, isMachine ? 'machines' : '');
    const [imgSrc, setImgSrc] = React.useState(initialSrc);

    React.useEffect(() => {
        setImgSrc(resolveCatalogImage(item.image, itemLabel, isMachine ? 'machines' : ''));
    }, [item.image, isMachine, itemLabel]);

    return (
        <motion.div
            initial={{ opacity: 0, rotateY: 0, y: 30 }}
            whileInView={{ opacity: 1, rotateY: 360, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ 
                opacity: { duration: 0.4, delay: index * 0.08 },
                y: { duration: 0.5, delay: index * 0.08 },
                rotateY: { duration: 1.2, ease: [0.25, 1, 0.5, 1], delay: index * 0.08 }
            }}
            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
            className="w-[31%] md:w-48 lg:w-56"
        >
            <Link to={item.path} className="group block relative">
                {/* Square Card Container - Tighter Corner */}
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-white shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 isolate">

                    {/* Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={itemLabel}
                            className="w-full h-full object-contain bg-white transition-transform duration-700 group-hover:scale-110"
                            onError={() => setImgSrc(fallbackSrc)}
                        />
                    </div>



                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                    {/* Content - Bottom Center - Reduced Padding */}
                    <div className="absolute bottom-0 left-0 right-0 p-1 md:p-4 flex flex-col items-center justify-end text-center z-10">

                        {/* Name - Smaller Font */}
                        <h4 className="font-serif font-normal text-[10px] md:text-lg text-white tracking-wide mb-1 transform transition-transform duration-300 group-hover:-translate-y-1 uppercase">
                            {itemLabel}
                        </h4>

                        {/* Divider - Thinner */}
                        <div className="w-6 h-[1px] bg-gold rounded-full mb-2 opacity-50 group-hover:w-12 group-hover:opacity-100 transition-all duration-500"></div>

                        {/* Action Text - Ultra Small */}
                        <span className="text-gold text-[8px] font-medium uppercase tracking-[0.2em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                            Discover
                        </span>
                    </div>

                    {/* Border Glow Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                </div>
            </Link>
        </motion.div>
    );
};

const NewLaunchSection = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['new-launch'];
    let displayItems = sectionData?.items && sectionData.items.length > 0 ? [...sectionData.items] : [];

    // Pad to 6 items if less than 6 (as requested: "6 cards kro")
    if (displayItems.length > 0 && displayItems.length < 6) {
        const dummyItems = [
            { id: 'dummy-rings', name: 'RINGS', path: '/shop?category=rings', image: catRings }
        ];
        
        while (displayItems.length < 6) {
            displayItems.push({ ...dummyItems[0], id: `dummy-${displayItems.length}` });
        }
    }

    if (displayItems.length === 0) return null;

    return (
        <section className="pt-2 pb-10 md:pt-4 md:pb-16 bg-bg-light relative overflow-hidden">

            <div className="container mx-auto px-2 md:px-4 relative z-10">

                {/* Header - Matched to Shop by Recipient Style */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-[#c1a05b] font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-1 block">
                        OUR LATEST
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dark mb-2 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {sectionData?.label ? (
                            <>
                                {sectionData.label.split(' ').slice(0, -1).join(' ')}{' '}
                                <span className="italic text-[#8c2a3e] font-normal">{sectionData.label.split(' ').pop()}</span>
                            </>
                        ) : (
                            <>
                                New <span className="italic text-[#8c2a3e] font-normal">Launches</span>
                            </>
                        )}
                    </h2>
                    <div className="h-[1px] w-12 bg-[#c1a05b] mx-auto mt-2"></div>
                </div>

                {/* Cards Row */}
                <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-8 px-1">
                    {displayItems.map((item, index) => (
                        <LaunchCard key={item.id} item={item} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default NewLaunchSection;
