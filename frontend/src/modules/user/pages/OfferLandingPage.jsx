import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { MapPin, ChevronRight, Shield, RefreshCw, Award, Headphones } from 'lucide-react';
import { getOfferLanding } from '../data/offerLandingData';

const OfferLandingPage = () => {
    const { slug } = useParams();
    const offer = getOfferLanding(slug);

    if (!offer) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[#f7f3ed]">
            {/* Hero — BlueStone Old Gold Exchange style (no duplicate banner strip) */}
            <section className="relative overflow-hidden bg-[#f7f3ed] py-14 md:py-20 lg:py-24 min-h-[420px] md:min-h-[480px] flex items-center">
                <div
                    className="absolute inset-0 opacity-35 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Soft offer visual on the right — not a repeated carousel strip */}
                {offer.heroImage && (
                    <div
                        className="absolute right-0 top-0 bottom-0 w-[45%] md:w-[42%] opacity-[0.18] md:opacity-[0.22] pointer-events-none hidden sm:block"
                        style={{
                            backgroundImage: `url(${offer.heroImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            maskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to left, black 40%, transparent 100%)',
                        }}
                    />
                )}

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 max-w-5xl mx-auto">
                        <div className="shrink-0">
                            <div className="offer-landing-badge">
                                <span className="offer-landing-badge-star">✦</span>
                                <div className="offer-landing-badge-text">
                                    {offer.badge.includes(' ') ? (
                                        offer.badge.split(' ').map((word) => (
                                            <span
                                                key={word}
                                                className={
                                                    word === 'GOLD' || word === 'GOLD,' ? 'text-[#c9a227]' : ''
                                                }
                                            >
                                                {word}
                                            </span>
                                        ))
                                    ) : (
                                        <span>{offer.badge}</span>
                                    )}
                                </div>
                                <span className="offer-landing-badge-star">✦</span>
                            </div>
                        </div>

                        <div className="text-center lg:text-left flex-1">
                            <h1 className="font-serif text-[#1e3a5f] text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.15] tracking-tight mb-4">
                                {offer.heroTitle}
                                {offer.heroTitleLine2 && (
                                    <>
                                        <br />
                                        {offer.heroTitleLine2}
                                    </>
                                )}
                            </h1>
                            <p className="font-serif text-[#1e3a5f]/75 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                                <strong>{offer.heroSubtitle}</strong>
                            </p>
                            <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
                                <Link
                                    to={offer.ctaPrimary.path}
                                    className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-7 py-3 rounded-sm text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#152d4a] transition-colors"
                                >
                                    <MapPin size={14} />
                                    {offer.ctaPrimary.label}
                                </Link>
                                <Link
                                    to={offer.ctaSecondary.path}
                                    className="inline-flex items-center gap-2 border border-[#1e3a5f] text-[#1e3a5f] px-7 py-3 rounded-sm text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#1e3a5f]/5 transition-colors"
                                >
                                    {offer.ctaSecondary.label}
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white py-12 md:py-16 border-t border-[#e8e0d5]">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block">
                        <p className="text-5xl md:text-7xl font-serif text-[#1e3a5f] font-bold tracking-tight leading-none">
                            {offer.statValue}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#1e3a5f]/55 mt-3 font-bold">
                            {offer.statLabel}
                        </p>
                        <p className="text-sm text-[#1e3a5f]/70 font-serif mt-2">
                            {offer.statDescription}
                        </p>
                    </div>

                    <div className="mt-10">
                        <Link
                            to="/stores"
                            className="inline-flex items-center gap-2 text-[#1e3a5f] font-bold text-[11px] uppercase tracking-[0.2em] hover:underline"
                        >
                            <MapPin size={14} />
                            Locate our Stores
                        </Link>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-[#f7f3ed] py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8 max-w-3xl">
                    <h2 className="font-serif text-[#1e3a5f] text-xl md:text-2xl text-center mb-10 tracking-tight">
                        {offer.stepsTitle}
                    </h2>
                    <ol className="space-y-0">
                        {offer.steps.map((step, idx) => (
                            <li
                                key={idx}
                                className="flex gap-4 md:gap-6 items-start py-5 border-b border-[#e8e0d5] last:border-0"
                            >
                                <span className="shrink-0 w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">
                                    {idx + 1}
                                </span>
                                <p className="font-serif text-[#1e3a5f] text-sm md:text-base pt-1 leading-relaxed">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Curated collections */}
            <section className="bg-white py-12 md:py-16">
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="font-serif text-[#1e3a5f] text-xl md:text-2xl text-center mb-8 tracking-tight">
                        Browse Our Curated Collections
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 max-w-5xl mx-auto">
                        {offer.collections.map((col) => (
                            <Link
                                key={col.label}
                                to={col.path}
                                className="group flex flex-col items-center p-4 bg-[#f7f3ed] rounded-xl border border-[#e8e0d5] hover:border-[#1e3a5f]/30 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-white border border-[#e8e0d5] flex items-center justify-center mb-2 group-hover:bg-[#1e3a5f]/5 transition-colors">
                                    <span className="text-lg">💎</span>
                                </div>
                                <span className="text-[11px] md:text-xs font-serif text-[#1e3a5f] text-center leading-tight group-hover:text-[#c9a227] transition-colors">
                                    {col.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link
                            to={offer.ctaSecondary.path}
                            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-8 py-3 rounded-sm text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#152d4a] transition-colors"
                        >
                            {offer.ctaSecondary.label}
                            <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* HG Promise */}
            <section className="bg-[#1e3a5f] py-12 md:py-16 text-white">
                <div className="container mx-auto px-4 md:px-8">
                    <h2 className="font-serif text-xl md:text-2xl text-center mb-10 tracking-tight">
                        The HG Enterprises Promise
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: Shield, label: 'Certified Jewellery', sub: 'BIS Hallmarked' },
                            { icon: RefreshCw, label: 'Lifetime Exchange', sub: 'Easy buyback' },
                            { icon: Award, label: 'Authentic Quality', sub: '100% genuine' },
                            { icon: Headphones, label: 'Expert Support', sub: '9 AM – 10 PM' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="text-center">
                                <Icon className="w-6 h-6 mx-auto mb-3 text-[#c9a227]" strokeWidth={1.5} />
                                <p className="text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-[10px] text-white/60">{sub}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs">
                        <Link to="/help" className="text-white/70 hover:text-white underline">
                            View all FAQ
                        </Link>
                        <Link to="/terms" className="text-white/70 hover:text-white underline">
                            Terms &amp; Conditions
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferLandingPage;
