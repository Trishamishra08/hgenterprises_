import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef();
  const isAdmin = useLocation().pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return undefined;
    const lenis = new Lenis({
      duration: 1.5, // Slightly longer for a more luxurious feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Update Lenis on window resize
    const handleResize = () => lenis.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
};

export default SmoothScroll;
