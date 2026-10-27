import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  /** The text to animate */
  text: string;
  /** Split mode */
  splitBy?: 'words' | 'chars';
  /** Animation style */
  variant?: 'rise' | 'blur' | 'slide' | 'fade' | 'flip';
  /** HTML tag for the wrapper */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Additional class for the wrapper */
  className?: string;
  /** Duration per element */
  duration?: number;
  /** Stagger delay between each word/char */
  stagger?: number;
  /** ScrollTrigger start position */
  triggerStart?: string;
  /** Only animate once */
  once?: boolean;
  /** Preserve inner HTML elements like <em>, <br> etc. If true, wraps each word in a span 
   *  but keeps the original children structure */
  dangerouslySetInnerHTML?: boolean;
}

/**
 * Premium split-text reveal animation powered by GSAP.
 * Each word or character animates in individually on scroll for that "agency website" feel.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  splitBy = 'words',
  variant = 'rise',
  as: Tag = 'h2',
  className = '',
  duration = 0.7,
  stagger = 0.04,
  triggerStart = 'top 85%',
  once = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  // Split the text into pieces
  const pieces = useMemo(() => {
    if (splitBy === 'chars') {
      return text.split('').map((char, i) => ({
        char: char === ' ' ? '\u00A0' : char,
        key: `${char}-${i}`,
        isSpace: char === ' ',
      }));
    }
    return text.split(' ').map((word, i) => ({
      char: word,
      key: `${word}-${i}`,
      isSpace: false,
    }));
  }, [text, splitBy]);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const targets = el.querySelectorAll('.tr-piece');

    if (!targets.length) return;

    // Set initial hidden state
    const fromProps: gsap.TweenVars = {};
    const toProps: gsap.TweenVars = {
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    };

    switch (variant) {
      case 'rise':
        fromProps.y = 45;
        fromProps.opacity = 0;
        toProps.y = 0;
        toProps.opacity = 1;
        break;
      case 'blur':
        fromProps.opacity = 0;
        fromProps.filter = 'blur(12px)';
        fromProps.y = 15;
        toProps.opacity = 1;
        toProps.filter = 'blur(0px)';
        toProps.y = 0;
        break;
      case 'slide':
        fromProps.x = 30;
        fromProps.opacity = 0;
        toProps.x = 0;
        toProps.opacity = 1;
        break;
      case 'fade':
        fromProps.opacity = 0;
        toProps.opacity = 1;
        break;
      case 'flip':
        fromProps.rotateX = -80;
        fromProps.opacity = 0;
        fromProps.y = 20;
        toProps.rotateX = 0;
        toProps.opacity = 1;
        toProps.y = 0;
        toProps.ease = 'back.out(1.5)';
        break;
    }

    gsap.set(targets, fromProps);
    const tween = gsap.to(targets, toProps);

    return () => {
      tween.kill();
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, [variant, duration, stagger, triggerStart, once]);

  return (
    <Tag
      ref={containerRef as any}
      className={`text-reveal tr-split-${splitBy} ${className}`}
    >
      {pieces.map((p) => (
        <span key={p.key} className="tr-word-wrap">
          <span className="tr-piece">{p.char}</span>
        </span>
      ))}
    </Tag>
  );
};
