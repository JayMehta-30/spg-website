import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  pullStrength?: number;
}

/**
 * ReactBits / Basement.studio inspired MagneticButton.
 * Gently glides toward cursor position within hover proximity for a tactile physical feel.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  pullStrength = 0.35,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distFactorX = (e.clientX - centerX) * pullStrength;
    const distFactorY = (e.clientY - centerY) * pullStrength;
    setOffset({ x: distFactorX, y: distFactorY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-btn ${className}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.1s ease-out',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
