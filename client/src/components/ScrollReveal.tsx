import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  variant?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade' | 'scale' | 'blur-up';
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** When to trigger: 'top 85%' means when element top hits 85% down the viewport */
  triggerStart?: string;
  /** Stagger children instead of animating container */
  stagger?: boolean;
  /** Stagger delay between children */
  staggerDelay?: number;
  /** Only animate once (default: true) */
  once?: boolean;
  /** Custom distance for slide animations */
  distance?: number;
  /** HTML tag to render */
  as?: React.ElementType;
}

/**
 * GSAP ScrollTrigger powered reveal animation.
 * Wraps any content and reveals it with beautiful entrance effects as it scrolls into view.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 0.9,
  triggerStart = 'top 87%',
  stagger = false,
  staggerDelay = 0.12,
  once = true,
  distance = 55,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const targets = stagger ? el.children : [el];

    // Initial hidden state based on variant
    const fromVars: gsap.TweenVars = { duration, delay, ease: 'power3.out' };

    switch (variant) {
      case 'fade-up':
        gsap.set(targets, { opacity: 0, y: distance });
        fromVars.opacity = 1;
        fromVars.y = 0;
        break;
      case 'fade-left':
        gsap.set(targets, { opacity: 0, x: -distance });
        fromVars.opacity = 1;
        fromVars.x = 0;
        break;
      case 'fade-right':
        gsap.set(targets, { opacity: 0, x: distance });
        fromVars.opacity = 1;
        fromVars.x = 0;
        break;
      case 'fade':
        gsap.set(targets, { opacity: 0 });
        fromVars.opacity = 1;
        break;
      case 'scale':
        gsap.set(targets, { opacity: 0, scale: 0.88 });
        fromVars.opacity = 1;
        fromVars.scale = 1;
        break;
      case 'blur-up':
        gsap.set(targets, { opacity: 0, y: distance, filter: 'blur(10px)' });
        fromVars.opacity = 1;
        fromVars.y = 0;
        fromVars.filter = 'blur(0px)';
        break;
    }

    if (stagger) {
      fromVars.stagger = staggerDelay;
    }

    fromVars.scrollTrigger = {
      trigger: el,
      start: triggerStart,
      toggleActions: once ? 'play none none none' : 'play none none reverse',
    };

    const tween = gsap.to(targets, fromVars);

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, [variant, delay, duration, triggerStart, stagger, staggerDelay, once, distance]);

  return (
    <Tag ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </Tag>
  );
};
