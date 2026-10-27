import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
  route: string;
}

/**
 * Lenis.dev smooth scroll wrapper — now synced with GSAP ScrollTrigger.
 * Provides inertial, silky-smooth scrolling physics across the entire website,
 * and keeps GSAP scroll-triggered animations perfectly in sync.
 */
export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, route }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable smooth scroll on admin routes for fast data entry
    if (route.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 🔗 Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for Lenis RAF — keeps both animation systems in lockstep
    const update = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis uses milliseconds
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
      // Clean up GSAP ScrollTrigger instances for this route
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [route]);

  // When route changes, scroll back to top smoothly
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Refresh ScrollTrigger positions after route change
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, [route]);

  return <>{children}</>;
};
