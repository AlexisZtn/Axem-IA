
import React from 'react';

interface AxemLogoProps {
  className?: string;
  src?: string | null;
}

const AxemLogo: React.FC<AxemLogoProps> = ({ className, src }) => {
  if (src) {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <img 
          src={src} 
          alt="AXEM IA Logo" 
          className="h-full w-auto object-contain drop-shadow-[0_0_15px_rgba(0,250,154,0.3)]" 
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width="220" 
        height="60" 
        viewBox="0 0 220 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_20px_rgba(0,250,154,0.4)] h-full w-auto"
      >
        {/* A */}
        <path d="M10 45L25 15H33L48 45H39L31.5 23L24 45H10Z" fill="white" />
        
        {/* X - Entièrement en vert émeraude, sans bleu */}
        <g opacity="1">
          <path d="M55 15L85 45" stroke="#00FA9A" stroke-width="3.5" stroke-linecap="round" />
          <path d="M85 15L55 45" stroke="#00FA9A" stroke-width="3.5" stroke-linecap="round" />
          
          {/* Lignes d'accentuation blanches fines */}
          <path d="M51 19L81 49" stroke="white" stroke-width="1" stroke-linecap="round" stroke-opacity="0.3" />
          <path d="M89 19L59 49" stroke="white" stroke-width="1" stroke-linecap="round" stroke-opacity="0.3" />
        </g>

        {/* E */}
        <path d="M95 15H120V19H101V27H117V31H101V39H120V43H95V15Z" fill="white" />
        
        {/* M - Coordonnées ajustées pour tenir dans le viewBox */}
        <path d="M130 43V15H138L148 30L158 15H166V43H160V23L148 39L136 23V43H130Z" fill="white" />

        {/* IA */}
        <text 
          x="175" 
          y="43" 
          fill="#00FA9A" 
          fontSize="24" 
          fontFamily="sans-serif" 
          fontWeight="900" 
          letterSpacing="1"
          className="animate-pulse"
        >
          IA
        </text>
      </svg>
    </div>
  );
};

export default AxemLogo;
