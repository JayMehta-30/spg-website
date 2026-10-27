import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Current route key — changes trigger the transition */
  routeKey: string;
}

/**
 * Smooth page transition using Motion AnimatePresence.
 * Provides a graceful fade + slide when navigating between pages.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  routeKey,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
