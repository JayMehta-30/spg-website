import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  /** Target number to count up to */
  end: number;
  /** Start value */
  start?: number;
  /** Duration of count animation in seconds */
  duration?: number;
  /** Prefix before number (e.g. "₹") */
  prefix?: string;
  /** Suffix after number (e.g. "+") */
  suffix?: string;
  /** Decimal places */
  decimals?: number;
  /** Additional CSS class */
  className?: string;
  /** When to trigger */
  triggerStart?: string;
}

/**
 * Animated number counter that counts up on scroll.
 * Uses GSAP for buttery-smooth number interpolation.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  triggerStart = 'top 85%',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(`${prefix}${start}${suffix}`);

  useEffect(() => {
    if (!ref.current) return;

    const counter = { val: start };
    const tween = gsap.to(counter, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: triggerStart,
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        setDisplay(`${prefix}${counter.val.toFixed(decimals)}${suffix}`);
      },
    });

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, [end, start, duration, prefix, suffix, decimals, triggerStart]);

  return (
    <span ref={ref} className={`count-up ${className}`}>
      {display}
    </span>
  );
};
