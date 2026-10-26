import React, { useEffect, useRef, useState } from 'react';

/**
 * Basement.studio inspired ambient cursor glow follower.
 * Tracks pointer movement with smooth interpolation and diffused radial gradient.
 */
export const CursorGlow: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200, currentX: -200, currentY: -200 });

  useEffect(() => {
    // Check if device supports fine hover pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let animId: number;
    const update = () => {
      const p = pos.current;
      // Spring interpolation
      p.currentX += (p.x - p.currentX) * 0.15;
      p.currentY += (p.y - p.currentY) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${p.currentX - 180}px, ${p.currentY - 180}px, 0)`;
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: visible ? 0.6 : 0,
        transition: 'opacity 0.4s ease',
        background: 'radial-gradient(circle, rgba(124, 138, 114, 0.16) 0%, rgba(124, 138, 114, 0.05) 45%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
};
