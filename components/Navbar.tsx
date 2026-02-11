
import React, { useState, useEffect } from 'react';
import AxemLogo from './AxemLogo';
import { Loader2 } from 'lucide-react';

interface NavbarProps {
  customLogo?: string | null;
  onUpdateLogo?: (newLogo: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ customLogo, onUpdateLogo }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY) {
          setIsHidden(true);
          setIsScrolledUp(false);
        } else {
          setIsHidden(false);
          setIsScrolledUp(true);
        }
      } else {
        setIsHidden(false);
        setIsScrolledUp(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (onUpdateLogo && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setIsProcessing(true);
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            onUpdateLogo(result);
            setIsProcessing(false);
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error("Logo processing failed", err);
          setIsProcessing(false);
        }
      }
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav 
      className={`fixed z-50 flex md:px-10 transition-all duration-300 pt-8 pr-6 pb-8 pl-6 top-0 right-0 left-0 items-start justify-between
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        ${isScrolledUp ? 'bg-[#050505]/80 backdrop-blur-md py-6 border-b border-white/5' : ''}
      `}
    >
      {/* Logo Area with Drag & Drop */}
      <div 
        className={`group relative cursor-pointer transition-all duration-300 rounded-2xl p-3
          ${isDragOver ? 'ring-2 ring-[#00FA9A] bg-[#00FA9A]/10 scale-110 shadow-[0_0_30px_rgba(0,250,154,0.4)]' : 'hover:scale-105'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Glissez votre logo ici pour le changer"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
            <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
          </div>
        )}
        <AxemLogo src={customLogo} className="h-14 md:h-20 w-auto" />
      </div>

      {/* Right Column Stack */}
      <div className="flex flex-col text-right gap-x-5 gap-y-5 items-end">
        <div className="flex flex-col gap-0.5 items-end">
          <a 
            href="#expertise" 
            onClick={(e) => scrollToSection(e, 'expertise')}
            className="text-[10px] font-medium tracking-[0.1em] text-neutral-300 hover:text-white transition-colors uppercase cursor-pointer"
          >
            Expertise
          </a>
          <a 
            href="#qui-sommes-nous" 
            onClick={(e) => scrollToSection(e, 'qui-sommes-nous')}
            className="text-[10px] font-medium tracking-[0.1em] text-neutral-300 hover:text-white transition-colors uppercase cursor-pointer"
          >
            Qui sommes-nous
          </a>
          <a 
            href="#realisations" 
            onClick={(e) => scrollToSection(e, 'realisations')}
            className="text-[10px] font-medium tracking-[0.1em] text-neutral-300 hover:text-white transition-colors uppercase cursor-pointer"
          >
            Réalisations
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="text-[10px] font-medium tracking-[0.1em] text-neutral-300 hover:text-white transition-colors uppercase cursor-pointer"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
