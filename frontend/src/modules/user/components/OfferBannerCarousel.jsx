import React, { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_BANNER_OFFERS, OFFERS_HUB_PATH } from '../data/offerLandingData';

const DWELL_MS = 2800;
const TRANSITION_MS = 750;

const OfferBannerCarousel = () => {
    const [banners, setBanners] = useState(DEFAULT_BANNER_OFFERS);
    const [trackIndex, setTrackIndex] = useState(1);
    const [translateX, setTranslateX] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const autoplayRef = useRef(null);
    const isJumpingRef = useRef(false);

    const loopSlides = useMemo(() => {
        if (banners.length <= 1) return banners;
        return [banners[banners.length - 1], ...banners, banners[0]];
    }, [banners]);

    const realIndex = useMemo(() => {
        if (banners.length <= 1) return 0;
        if (trackIndex === 0) return banners.length - 1;
        if (trackIndex === loopSlides.length - 1) return 0;
        return trackIndex - 1;
    }, [trackIndex, banners.length, loopSlides.length]);

    // Always use curated banner offers with dedicated landing page links

    const computeTranslateX = useCallback((index) => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track || !track.children[index]) return 0;

        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
        const containerWidth = container.offsetWidth;
        const slideWidth = track.children[index].offsetWidth;
        const slideOffset = index * (slideWidth + gap);
        return containerWidth / 2 - slideWidth / 2 - slideOffset;
    }, []);

    const applyTranslate = useCallback((index) => {
        setTranslateX(computeTranslateX(index));
        setIsReady(true);
    }, [computeTranslateX]);

    useLayoutEffect(() => {
        applyTranslate(trackIndex);
    }, [trackIndex, applyTranslate, loopSlides.length]);

    useEffect(() => {
        const handleResize = () => applyTranslate(trackIndex);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [trackIndex, applyTranslate]);

    const clearAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearTimeout(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const goNext = useCallback(() => {
        if (banners.length <= 1 || isJumpingRef.current) return;
        clearAutoplay();
        setTransitionEnabled(true);
        setTrackIndex((prev) => prev + 1);
    }, [banners.length, clearAutoplay]);

    const scheduleAutoplay = useCallback(() => {
        clearAutoplay();
        if (banners.length <= 1 || isJumpingRef.current) return;
        autoplayRef.current = setTimeout(goNext, DWELL_MS);
    }, [banners.length, goNext, clearAutoplay]);

    const jumpWithoutTransition = useCallback((index) => {
        isJumpingRef.current = true;
        clearAutoplay();
        setTransitionEnabled(false);
        setTrackIndex(index);
        setTranslateX(computeTranslateX(index));
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTransitionEnabled(true);
                isJumpingRef.current = false;
                scheduleAutoplay();
            });
        });
    }, [computeTranslateX, clearAutoplay, scheduleAutoplay]);

    const handleTransitionEnd = useCallback((e) => {
        if (e.propertyName !== 'transform') return;
        if (banners.length <= 1) return;

        if (trackIndex === loopSlides.length - 1) {
            jumpWithoutTransition(1);
            return;
        }
        if (trackIndex === 0) {
            jumpWithoutTransition(banners.length);
            return;
        }

        scheduleAutoplay();
    }, [trackIndex, loopSlides.length, banners.length, jumpWithoutTransition, scheduleAutoplay]);

    useEffect(() => {
        if (isReady && banners.length > 1) {
            scheduleAutoplay();
        }
        return clearAutoplay;
    }, [isReady, banners.length, scheduleAutoplay, clearAutoplay]);

    if (banners.length === 0) return null;

    const isLoop = banners.length > 1;

    return (
        <section className="offer-carousel-section" aria-label="Special offers">
            <div className="offer-carousel-wrapper">
                <div ref={containerRef} className="offer-carousel-viewport">
                    <div
                        ref={trackRef}
                        className="offer-carousel-track"
                        style={{
                            transform: `translate3d(${translateX}px, 0, 0)`,
                            transition: transitionEnabled
                                ? `transform ${TRANSITION_MS}ms ease-in-out`
                                : 'none',
                            visibility: isReady ? 'visible' : 'hidden',
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {loopSlides.map((banner, index) => {
                            const isActive = isLoop ? index === trackIndex : index === 0;

                            return (
                                <Link
                                    key={`${banner.id}-${index}`}
                                    to={OFFERS_HUB_PATH}
                                    className={`offer-carousel-slide ${isActive ? 'is-active' : ''}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    aria-hidden={!isActive}
                                    tabIndex={isActive ? 0 : -1}
                                    draggable={false}
                                    onDragStart={(e) => e.preventDefault()}
                                >
                                    <div className={`offer-carousel-card ${isActive ? 'is-active' : ''}`}>
                                        <img
                                            src={banner.image}
                                            alt={banner.alt}
                                            className="offer-carousel-img"
                                            draggable={false}
                                            loading={Math.abs(index - trackIndex) <= 1 ? 'eager' : 'lazy'}
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {isLoop && (
                    <div className="offer-carousel-dots" aria-hidden="true">
                        {banners.map((banner, idx) => (
                            <span
                                key={banner.id}
                                className={`offer-carousel-dot ${realIndex === idx ? 'is-active' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OfferBannerCarousel;
