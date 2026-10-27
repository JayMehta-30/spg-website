import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Thin, elegant scroll progress indicator fixed at the very top of the viewport.
 * Uses Motion spring physics for smooth, natural-feeling response.
 */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Spring smoothing so the bar doesn't feel jittery
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{
        scaleX,
        transformOrigin: '0%',
      }}
    />
  );
};
