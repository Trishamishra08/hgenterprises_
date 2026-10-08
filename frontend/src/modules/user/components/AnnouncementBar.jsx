import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, Headset, Tag, Gift, Star, Bell, Zap, Shield } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';



const iconMap = {
    'Truck': Truck,
    'Shield': Shield,
    'ShieldCheck': ShieldCheck,
    'RefreshCw': RefreshCw,
    'Headset': Headset,
    'Tag': Tag,
    'Gift': Gift,
    'Star': Star,
    'Bell': Bell,
    'Zap': Zap
};

const AnnouncementBar = () => {
    const { settings } = useShop();
    const [announcements, setAnnouncements] = useState([
        { icon: 'Truck', text: "Free Shipping" },
        { icon: 'Shield', text: "Secure Payments" },
        { icon: 'RefreshCw', text: "Easy Returns & Refunds" },
        { icon: 'Headset', text: "Dedicated Support Team" }
    ]);


    useEffect(() => {
        if (settings?.announcementItems && settings.announcementItems.length > 0) {
            setAnnouncements(settings.announcementItems);
        }
    }, [settings]);


    return (
        <div className="bg-[#1F1F1F] text-[#F7F2EF] overflow-hidden py-0.5 relative z-[60]">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center mx-20 gap-32">
                        {announcements.map((item, idx) => {
                            return (
                                <div key={idx} className="flex items-center gap-2">
                                    {item.type === 'image' && item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.text || "Announcement icon"}
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 object-contain"
                                        />
                                    ) : (
                                        (() => {
                                            const IconComponent = iconMap[item.icon] || Tag;
                                            return <IconComponent className="w-3.5 h-3.5 text-[#C9A24D]" />;
                                        })()
                                    )}
                                    <span className="text-[10px] font-medium uppercase tracking-widest">{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}
            </style>
        </div>
    );
};

export default AnnouncementBar;
