import React from 'react';
import { Link } from 'react-router-dom';
import {
    Store,
    ShieldCheck,
    RefreshCw,
    RotateCcw,
    Search,
    Truck,
    ThumbsUp,
    Gem,
    Video,
    Phone,
    MessageCircle,
    Mail,
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const PROMISE_ITEMS = [
    { icon: Store, label: 'Pan India Presence', sub: '50+ Cities Nationwide' },
    { icon: ShieldCheck, label: '100% Certified Jewellery', sub: '' },
    { icon: RefreshCw, label: 'Lifetime Exchange & Buyback', sub: '' },
    { icon: RotateCcw, label: '30 Days Money Back', sub: '' },
    { icon: Search, label: '100% Transparency', sub: '' },
    { icon: Truck, label: 'Free Shipping', sub: '' },
    { icon: ThumbsUp, label: 'No Compromise On Ethics', sub: '' },
    { icon: Gem, label: 'A world of designs', sub: '' },
    { icon: Video, label: 'Personalised Video Consultations', sub: '' },
];

const HGPromise = () => {
    const { settings } = useShop();

    const phone = settings?.phone || '+91 90760 62592';
    const generalEmail = settings?.email || 'concierge@hgjewels.com';
    const cleanedPhone = phone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent('Hello HG Enterprises, I need assistance.')}`;

    const enquiryLinks = [
        { label: 'General', value: generalEmail, href: `mailto:${generalEmail}` },
        { label: 'Corporate', value: 'corporate@hgjewels.com', href: 'mailto:corporate@hgjewels.com' },
        { label: 'Hr', value: 'careers@hgjewels.com', href: 'mailto:careers@hgjewels.com' },
        { label: 'Grievance', value: 'click here', href: '/help', isLink: true },
    ];

    const actionIcons = [
        { icon: Phone, label: 'Call Us', href: `tel:${cleanedPhone}` },
        { icon: MessageCircle, label: 'Chat', href: '/help' },
        { icon: null, label: 'Whatsapp', href: waUrl, isWhatsApp: true },
        { icon: Mail, label: 'Email', href: `mailto:${generalEmail}` },
    ];

    return (
        <section className="hg-promise-section" aria-label="HG Promise and support">
            <div className="hg-promise-layout">
                {/* BlueStone-style Promise block */}
                <div className="hg-promise-block">
                    <div className="hg-promise-block-inner">
                        <div className="hg-promise-title-col">
                            <p className="hg-promise-brand">HG</p>
                            <p className="hg-promise-brand-sub">Enterprises</p>
                            <h2 className="hg-promise-title">Promise</h2>
                        </div>

                        <div className="hg-promise-connector" aria-hidden="true" />

                        <div className="hg-promise-grid-box">
                            <div className="hg-promise-grid">
                                {PROMISE_ITEMS.map((item, i) => (
                                    <div key={i} className="hg-promise-grid-item">
                                        <div className="hg-promise-icon-circle">
                                            <item.icon className="hg-promise-icon" strokeWidth={1.5} />
                                        </div>
                                        <p className="hg-promise-item-label">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 24x7 Enquiry Support panel */}
                <aside className="hg-enquiry-panel">
                    <h3 className="hg-enquiry-heading">24X7 ENQUIRY SUPPORT ( ALL DAYS )</h3>

                    <ul className="hg-enquiry-list">
                        {enquiryLinks.map((row) => (
                            <li key={row.label} className="hg-enquiry-row">
                                <span className="hg-enquiry-label">{row.label} :</span>
                                {row.isLink ? (
                                    <Link to={row.href} className="hg-enquiry-value hg-enquiry-value--link">
                                        {row.value}
                                    </Link>
                                ) : (
                                    <a href={row.href} className="hg-enquiry-value">
                                        {row.value}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="hg-enquiry-actions">
                        {actionIcons.map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                target={action.isWhatsApp ? '_blank' : undefined}
                                rel={action.isWhatsApp ? 'noopener noreferrer' : undefined}
                                className="hg-enquiry-action"
                            >
                                <div className="hg-enquiry-action-icon">
                                    {action.isWhatsApp ? (
                                        <svg viewBox="0 0 24 24" className="hg-enquiry-wa-icon" aria-hidden="true">
                                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.197-1.362a9.932 9.932 0 0 0 4.814 1.237h.005c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.927-7.067C17.189 2.937 14.683 2 12.012 2zm0 1.711c2.213 0 4.292.862 5.856 2.427a8.232 8.232 0 0 1 2.423 5.851c0 4.561-3.712 8.271-8.277 8.271a8.21 8.21 0 0 1-4.202-1.154l-.302-.18-3.12.818.832-3.044-.198-.314a8.2 8.2 0 0 1-1.258-4.398c0-4.562 3.713-8.272 8.277-8.272z" />
                                        </svg>
                                    ) : (
                                        action.icon && <action.icon className="w-5 h-5" strokeWidth={1.5} />
                                    )}
                                </div>
                                <span className="hg-enquiry-action-label">{action.label}</span>
                            </a>
                        ))}
                    </div>

                    <Link to="/stores" className="hg-enquiry-store-btn">
                        <Store className="w-4 h-4" strokeWidth={1.5} />
                        FIND A STORE
                    </Link>
                </aside>
            </div>
        </section>
    );
};

export default HGPromise;
