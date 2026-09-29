import React from 'react';

interface BrandBagEmblemProps {
  className?: string;
}

/**
 * High-precision vector rendition of the attached Mr. J Collections
 * 3D Gold Shopping Bag with intertwined "MJ" monogram on a black background.
 */
export const BrandBagEmblem: React.FC<BrandBagEmblemProps> = ({ className = 'w-14 h-14' }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mr. J Collections gold shopping bag monogram emblem"
    >
      <defs>
        <linearGradient id="mjGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8E4A8" />
          <stop offset="35%" stopColor="#D6AD54" />
          <stop offset="70%" stopColor="#9E7123" />
          <stop offset="100%" stopColor="#E6C677" />
        </linearGradient>
        <linearGradient id="mjGoldSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C89C42" />
          <stop offset="50%" stopColor="#7A5315" />
          <stop offset="100%" stopColor="#B88B32" />
        </linearGradient>
        <linearGradient id="mjGoldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF2C6" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B631B" />
        </linearGradient>
      </defs>

      {/* Deep Obsidian Background Badge */}
      <rect width="200" height="200" rx="16" fill="#070708" />

      {/* Back Handle */}
      <path
        d="M78 66 C78 36, 114 36, 114 66"
        stroke="url(#mjGoldSide)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left 3D Gusset Panel of the Shopping Bag */}
      <polygon
        points="42,155 58,64 74,58 58,164"
        fill="url(#mjGoldSide)"
        stroke="url(#mjGoldPrimary)"
        strokeWidth="1.5"
      />
      {/* Bottom Gusset Fold Triangle */}
      <polygon
        points="42,155 58,164 56,144"
        fill="#63420E"
        stroke="url(#mjGoldPrimary)"
        strokeWidth="1"
      />

      {/* Front Face of the Shopping Bag */}
      <polygon
        points="58,164 74,58 148,68 160,156"
        fill="#08080A"
        stroke="url(#mjGoldPrimary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Bag Eyelets / Grommets */}
      <circle cx="92" cy="72" r="5.5" stroke="url(#mjGoldPrimary)" strokeWidth="3" fill="#08080A" />
      <circle cx="130" cy="76" r="5.5" stroke="url(#mjGoldPrimary)" strokeWidth="3" fill="#08080A" />

      {/* Front Arched Handle */}
      <path
        d="M92 72 C92 28, 132 30, 130 76"
        stroke="url(#mjGoldHighlight)"
        strokeWidth="7.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Stylized Intertwined "MJ" Gold Monogram */}
      {/* Left stem & serif of M */}
      <path
        d="M84 134 L88 90 M80 90 L94 90 M78 134 L91 134"
        stroke="url(#mjGoldPrimary)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Center V and Right Pillar of M */}
      <path
        d="M88 90 L106 116 L122 92 L120 132 C120 142, 112 146, 102 146"
        stroke="url(#mjGoldHighlight)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* J Pillar & Descender Hook */}
      <path
        d="M128 106 L142 106 M135 106 L135 140 C135 152, 124 157, 112 155"
        stroke="url(#mjGoldHighlight)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Signature Swooping Gold Ribbon Across M & J */}
      <path
        d="M86 91 C96 114, 118 122, 137 134"
        stroke="url(#mjGoldPrimary)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
