import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.971 1.172-4.971s-.299-.599-.299-1.484c0-1.391.806-2.428 1.809-2.428.853 0 1.264.641 1.264 1.409 0 .858-.546 2.14-.828 3.33-.236.995.499 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.936.29 1.929.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
);

const AppDownloadSocial = () => {
    const { settings } = useShop();
    const social = settings?.socialLinks || {};

    const socialItems = [
        { key: 'instagram', Icon: Instagram, href: social.instagram || '#', label: 'Instagram' },
        { key: 'facebook', Icon: Facebook, href: social.facebook || '#', label: 'Facebook' },
        { key: 'linkedin', Icon: Linkedin, href: social.linkedin || '#', label: 'LinkedIn' },
        { key: 'pinterest', Icon: PinterestIcon, href: social.pinterest || '#', label: 'Pinterest' },
        { key: 'twitter', Icon: Twitter, href: social.twitter || '#', label: 'X' },
    ];

    return (
        <section className="app-social-section" aria-label="App download and social links">
            <div className="app-social-inner">
                <div className="app-download-card">
                    <h3 className="app-download-title">Download the HG App</h3>
                    <p className="app-download-sub">
                        Shop &amp; save more on app with exclusive offers and faster checkout
                    </p>
                    <div className="app-download-badges">
                        <a
                            href="#"
                            className="app-store-badge"
                            aria-label="Download on the App Store"
                            onClick={(e) => e.preventDefault()}
                        >
                            <span className="app-badge-icon">&#63743;</span>
                            <span className="app-badge-text">
                                <small>Download on the</small>
                                App Store
                            </span>
                        </a>
                        <a
                            href="#"
                            className="app-store-badge"
                            aria-label="Get it on Google Play"
                            onClick={(e) => e.preventDefault()}
                        >
                            <span className="app-badge-play">▶</span>
                            <span className="app-badge-text">
                                <small>GET IT ON</small>
                                Google Play
                            </span>
                        </a>
                    </div>
                </div>

                <div className="app-social-find">
                    <h4 className="app-social-find-title">Find Us On</h4>
                    <div className="app-social-icons">
                        {socialItems.map(({ key, Icon, href, label }) => (
                            <a
                                key={key}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="app-social-icon-btn"
                                aria-label={label}
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSocial;
