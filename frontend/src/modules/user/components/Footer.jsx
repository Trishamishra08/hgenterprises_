import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Truck, Mail, Phone, MapPin, Heart, ShieldCheck, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import hgLogoPremium from '../assets/logo_final.jpg';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import { SOCIAL_PLATFORMS } from '../../../utils/socialPlatforms';


const Footer = () => {
    const { settings: globalSettings } = useShop();
    const location = useLocation();
    const isOrderSuccess = location.pathname === '/order-success';


    const [settings, setSettings] = useState({
        footerTagline: 'Timeless Elegance,',
        footerSubTagline: 'Crafted for You.',
        footerDescription: 'HG Enterprises brings you the finest handcrafted jewellery, blending traditional artistry with modern sophistication. Discover a world of exquisite brilliance.',
        address: 'RNO.4 GULBERG CHAWL DAMU, NAGAR AKURLI ROAD, Kandivali East, Mumbai, Maharashtra, India, 400101',
        phone: '+91 90760 62592',
        email: 'concierge@hgjewels.com',

        footerColumn1Title: 'Experience',
        footerColumn2Title: 'Policies',
        footerColumn3Title: 'Our World',

        footerExperienceLinks: [
            { name: "Our Services", path: "/services" },
            { name: "Easy Returns", path: "/returns" },
            { name: "Contact Us", path: "/contact" },
            { name: "FAQs", path: "/help" },
            { name: "Blogs", path: "/blogs" },
        ],
        footerPoliciesLinks: [
            { name: "Shipping Policy", path: "/shipping-policy" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Cancellation Policy", path: "/cancellation-policy" },
            { name: "Terms & Conditions", path: "/terms" },
            { name: "Jewellery Return & Exchange", path: "/returns" },
            { name: "Lifetime Buyback Policy", path: "/policies/buyback" },
            { name: "Diamond Certification", path: "/policies/certification" },
        ],
        footerWorldLinks: [
            { name: "About Us", path: "/about" },
            { name: "Jewellery Care Guide", path: "/care-guide" },
            { name: "Store Locator", path: "/stores" },
            { name: "Our Craft", path: "/craft" },
        ],
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            youtube: '#'
        },
        footerDeliveryText: 'Safe & Express Pan India Delivery',
        footerCopyrightText: `HG Enterprises. All Rights Reserved.`
    });

    useEffect(() => {
        if (globalSettings) {
            setSettings(prev => {
                const updated = { ...prev };
                Object.keys(globalSettings).forEach(key => {
                    // Prevent empty arrays from the DB from overwriting our rich default links
                    if (Array.isArray(globalSettings[key]) && globalSettings[key].length === 0) {
                        return; // keep default array
                    }
                    if (globalSettings[key] !== undefined && globalSettings[key] !== null) {
                        updated[key] = globalSettings[key];
                    }
                });
                return updated;
            });
        }
    }, [globalSettings]);


    // Admin-managed policies (Admin → Policies) are appended to the Policies column
    const [dynamicPolicies, setDynamicPolicies] = useState([]);
    const [guideDepartments, setGuideDepartments] = useState([]);

    useEffect(() => {
        api.get('/policies').then((res) => setDynamicPolicies(res.data)).catch(() => {});
        api.get('/guidelines').then((res) => {
            const depts = ['jewellery', 'tools', 'machines'].filter((d) => res.data.some((g) => g.department === d));
            setGuideDepartments(depts);
        }).catch(() => {});
    }, []);

    const policyLinks = [
        ...(settings.footerPoliciesLinks || []).filter((l) => !l.path?.startsWith('/policies/')),
        ...dynamicPolicies.map((p) => ({ name: p.title, path: `/policies/${p.slug}` })),
    ];
    const worldLinks = [
        ...(settings.footerWorldLinks || []),
        { name: 'Resource Centre', path: '/resources' },
        ...guideDepartments.map((d) => ({ name: `${d.charAt(0).toUpperCase()}${d.slice(1)} Guide`, path: `/guidelines/${d}` })),
    ];

    if (isOrderSuccess) return null;

    return (
        <footer className="relative bg-[#0a0a0a] pt-8 md:pt-12 pb-4 md:pb-6 overflow-hidden text-white">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8B4356] via-[#eecad5] to-[#8B4356]"></div>

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-8 md:mb-10">

                    {/* Brand Identity */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src={hgLogoPremium} alt="HG" className="h-[45px] md:h-[50px] w-auto brightness-110" />
                            <div className="flex flex-col">
                                <span className="text-white font-serif text-base md:text-lg font-light tracking-widest leading-none group-hover:text-primary transition-colors uppercase">Harshad Gauri</span>
                                <span className="text-primary font-serif italic text-[10px] tracking-[0.2em]">enterprises</span>
                            </div>
                        </Link>
                        <p className="text-zinc-400 font-serif text-xs leading-relaxed max-w-xs opacity-80">
                            {settings.footerDescription}
                        </p>
                        <div className="flex gap-4">
                            {[{ Icon: ShieldCheck, label: "Secure" }, { Icon: Star, label: "Premium" }, { Icon: Heart, label: "Verified" }].map((badge, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <badge.Icon className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="lg:col-span-5 grid grid-cols-3 gap-4">
                        {[
                            { title: settings.footerColumn1Title, links: settings.footerExperienceLinks },
                            { title: settings.footerColumn2Title, links: policyLinks },
                            { title: settings.footerColumn3Title, links: worldLinks }
                        ].map((col, i) => (
                            <div key={i} className="space-y-4">
                                <h4 className="font-display text-white font-black uppercase tracking-widest text-[10px] pb-1 border-b border-white/5 inline-block">{col.title}</h4>
                                <ul className="space-y-2">
                                    {col.links?.map((link, idx) => (
                                        <li key={idx}>
                                            <Link to={link.path} className="text-[11px] text-zinc-400 hover:text-white transition-colors block">{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Contact & Social */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="space-y-3">
                                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group">
                                    <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-medium">{settings.email}</span>
                                </a>
                                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group">
                                    <Phone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-medium">{settings.phone}</span>
                                </a>
                                <div className="flex items-start gap-3 text-zinc-500">
                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-[10px] font-serif italic leading-tight">{settings.address}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                                {(settings.socialPages || []).filter((p) => p.isActive !== false && p.url).map((p, i) => {
                                    const meta = SOCIAL_PLATFORMS[p.platform] || SOCIAL_PLATFORMS.other;
                                    const Icon = meta.icon;
                                    return (
                                        <a
                                            key={i}
                                            href={p.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={p.label || meta.label}
                                            aria-label={p.label || meta.label}
                                            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-primary transition-all"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} {settings.footerCopyrightText}
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] text-zinc-600 font-serif italic">Industrial & Creative Perfection</span>
                        <div className="h-1 w-1 bg-primary rounded-full"></div>
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest">{settings.footerDeliveryText}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
