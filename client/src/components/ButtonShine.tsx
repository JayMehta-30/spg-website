import React from 'react';

interface ButtonShineProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Button with a premium light-sweep shine effect on hover.
 * The light diagonally sweeps across the button surface — luxury brand aesthetic.
 */
export const ButtonShine: React.FC<ButtonShineProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button className={`btn-shine ${className}`} {...props}>
      <span className="btn-shine-content">{children}</span>
      <span className="btn-shine-sweep" aria-hidden="true" />
    </button>
  );
};
