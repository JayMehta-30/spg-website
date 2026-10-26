import React from 'react';

interface MarqueeProps {
  items: string[];
  speedSeconds?: number;
  reverse?: boolean;
}

/**
 * Basement.studio inspired continuous marquee ribbon.
 * Renders an endless, smooth kinetic brand ribbon with luxury serif accents.
 */
export const Marquee: React.FC<MarqueeProps> = ({ items, speedSeconds = 32, reverse = false }) => {
  return (
    <div className="marquee-container" aria-hidden="true">
      <div
        className={`marquee-track ${reverse ? 'reverse' : ''}`}
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <span key={idx} className="marquee-item">
            <span className="marquee-dot">✦</span>
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
