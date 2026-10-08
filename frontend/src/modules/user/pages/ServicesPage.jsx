import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Wrench, Gem, Phone } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { getServicesFromSections, findServiceBySlug, slugifyService } from '../data/servicesData';

const GROUP_ICONS = { machine: Wrench, jewelry: Gem };

const ServicesPage = () => {
    const { category, slug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { homepageSections } = useShop();
    const sectionData = useMemo(() => getServicesFromSections(homepageSections), [homepageSections]);
    const groups = sectionData.groups || [];

    const initialTab = category || searchParams.get('tab') || groups[0]?.id || 'machine';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (category && groups.some((g) => g.id === category)) {
            setActiveTab(category);
        } else if (searchParams.get('tab')) {
            setActiveTab(searchParams.get('tab'));
        }
    }, [category, searchParams, groups]);

    const activeGroup = groups.find((g) => g.id === activeTab) || groups[0];
    const detailService = slug && category ? findServiceBySlug(homepageSections, category, slug) : null;

    if (detailService) {
        const GroupIcon = GROUP_ICONS[category] || Wrench;
        const groupName = groups.find((g) => g.id === category)?.name || category;

        return (
            <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <button
                        type="button"
                        onClick={() => navigate(`/services?tab=${category}`)}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#8B4356] mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to {groupName}
                    </button>

                    <div className="bg-[#FFF5F6] border border-[#EBCDD0]/40 rounded-2xl p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#EBCDD0] flex items-center justify-center text-[#8B4356]">
                                <GroupIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D39A9F]">{groupName}</span>
                        </div>

                        <h1 className="font-display text-2xl md:text-3xl text-black mb-4">{detailService.name}</h1>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed font-serif mb-8">
                            {detailService.description || 'Contact our team to learn more about this service and book an appointment.'}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/help"
                                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8B4356] transition-colors"
                            >
                                Book / Enquire
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 border border-black/10 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-[#D39A9F] transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" /> Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-8 md:mb-10">
                    <span className="text-[#D39A9F] text-[10px] font-bold uppercase tracking-[0.25em]">HG Services</span>
                    <h1 className="font-display text-3xl md:text-4xl text-black mt-1 mb-2">{sectionData.label}</h1>
                    <p className="text-gray-500 text-sm font-serif italic">{sectionData.subtitle}</p>
                </div>

                <div className="flex justify-center gap-4 md:gap-10 mb-8 border-b border-[#EBCDD0]/50 pb-1">
                    {groups.map((group) => {
                        const Icon = GROUP_ICONS[group.id] || Wrench;
                        return (
                            <button
                                key={group.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(group.id);
                                    navigate(`/services?tab=${group.id}`, { replace: true });
                                }}
                                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-2 relative transition-colors ${
                                    activeTab === group.id ? 'text-[#8B4356]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {group.name}
                                {activeTab === group.id && (
                                    <motion.div layoutId="servicesPageTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D39A9F]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                    >
                        {(activeGroup?.items || []).map((item) => {
                            const itemSlug = item.slug || slugifyService(item.name);
                            return (
                                <Link
                                    key={item.id}
                                    to={`/services/${activeGroup.id}/${itemSlug}`}
                                    className="group bg-[#FFF5F6] border border-[#EBCDD0]/40 rounded-xl p-4 md:p-5 hover:border-[#D39A9F] hover:shadow-lg transition-all flex flex-col"
                                >
                                    <h3 className="text-sm font-bold text-black mb-2 group-hover:text-[#8B4356] transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-serif leading-relaxed line-clamp-2 flex-grow">
                                        {item.description}
                                    </p>
                                    <span className="mt-3 text-[9px] font-bold uppercase tracking-widest text-[#D39A9F] flex items-center gap-1">
                                        Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </Link>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ServicesPage;
