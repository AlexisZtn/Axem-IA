
import React from 'react';

// Using a static string path avoids the "Failed to resolve module specifier" error 
// that occurs when importing non-JS assets with spaces in browser-native ESM environments.
const defaultLogo = 'components/axem%20logo%20transp.png';

interface AxemLogoProps {
  className?: string;
  src?: string | null;
}

const AxemLogo: React.FC<AxemLogoProps> = ({ className, src }) => {
  // Use user-uploaded custom logo (src) if exists, otherwise use the default png file
  const logoSource = src || defaultLogo;

  if (logoSource) {
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <img 
          src={logoSource} 
          alt="AXEM IA Logo" 
          className="h-full w-auto object-contain drop-shadow-[0_0_15px_rgba(0,250,154,0.3)]" 
          onError={(e) => {
             // Visual fallback if image path is incorrect or file missing
             const img = e.currentTarget;
             img.style.display = 'none';
             if (img.parentElement) {
                img.parentElement.innerHTML = '<span class="text-white font-bold tracking-widest text-lg px-2">AXEM IA</span>';
             }
          }}
        />
      </div>
    );
  }

  return null;
};

export default AxemLogo;
