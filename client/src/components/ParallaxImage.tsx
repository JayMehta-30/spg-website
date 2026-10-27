import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Parallax intensity: higher = more movement. Default 40 */
  speed?: number;
  /** Scale factor when fully visible. Default 1.15 */
  scale?: number;
  children?: React.ReactNode;
  /** Tag for demo photo overlay */
  isDemo?: boolean;
}

/**
 * Parallax-scrolling image with subtle depth movement.
 * The image moves at a different speed from the content, creating premium depth.
 */
export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  speed = 40,
  scale: scaleFactor = 1.15,
  children,
  isDemo = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to vertical movement
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFactor, 1, scaleFactor * 0.98]);

  return (
    <div ref={containerRef} className={`parallax-container ${className}`}>
      <motion.div className="parallax-inner" style={{ y }}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="parallax-img"
          style={{ scale: imageScale }}
        />
      </motion.div>
      {isDemo && <span className="demo-tag">DEMO PHOTO · NOT ACTUAL PROPERTY</span>}
      {children}
    </div>
  );
};
