
import React, { useState } from 'react';

interface AxemLogoProps {
  className?: string;
  src?: string | null;
}

const AxemLogo: React.FC<AxemLogoProps> = ({ className, src }) => {
  // State to track if the image failed to load
  const [imageError, setImageError] = useState(false);

  // 1. URL directe vers l'image brute (Raw) sur GitHub
  const defaultLogoUrl = "https://raw.githubusercontent.com/AlexisZtn/Axem-IA/718744c0f4c3169dd82ff26a925679d4a62dce87/components/unwatermarked_Gemini_Generated_Image_iggmm1iggmm1iggm.png";

  // 2. Priority: User's Dragged Logo (base64) OR the default GitHub URL
  const imageSource = src || defaultLogoUrl;

  if (!imageError) {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <img 
          src={imageSource} 
          alt="AXEM IA" 
          className="h-full w-auto object-contain"
          // Note: J'ai retiré le filtre 'invert' qui était spécifique à l'ancien logo noir.
          // La nouvelle image s'affichera avec ses couleurs d'origine.
          onError={(e) => {
            console.warn("Impossible de charger le logo depuis :", imageSource);
            setImageError(true);
          }} 
        />
      </div>
    );
  }

  // 3. Fallback: Vector Logo (Inline SVG)
  // S'affiche si le fichier PNG est introuvable ou échoue au chargement.
  return (
    <div className={`flex items-center justify-center select-none ${className}`} title="AXEM IA">
      <svg viewBox="0 0 200 50" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'white', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#e5e5e5', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* 'axem' - Geometric Lowercase */}
        <text 
            x="0" 
            y="38" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="800" 
            fontSize="42" 
            fill="url(#grad1)" 
            letterSpacing="-2.5"
        >
            axem
        </text>
        
        {/* Slash Accent */}
        <rect x="112" y="12" width="5" height="28" fill="#00FA9A" transform="skewX(-20)" />

        {/* 'IA' - Modern Tech */}
        <text 
            x="130" 
            y="38" 
            fontFamily="'Inter', sans-serif" 
            fontWeight="600" 
            fontSize="42" 
            fill="white" 
            letterSpacing="-1"
        >
            IA
        </text>
      </svg>
    </div>
  );
};

export default AxemLogo;
