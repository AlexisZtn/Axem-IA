
import React, { useState, useEffect } from 'react';
import AxemLogo from './AxemLogo';

interface NavbarProps {
  customLogo?: string | null;
  onUpdateLogo?: (newLogo: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ customLogo }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      className={`fixed z-50 flex md:px-10 transition-all duration-300 pt-8 pr-6 pb-8 pl-6 top-0 right-0 left-0 items-center justify-between
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        ${isScrolledUp ? 'bg-[#050505]/80 backdrop-blur-md py-4 border-b border-white/5' : ''}
      `}
    >
      {/* Logo Area */}
      <div 
        className="group relative cursor-pointer transition-all duration-300 rounded-2xl p-2 -ml-2 hover:bg-white/5"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <AxemLogo src={customLogo} className="h-16 md:h-20 w-auto relative z-0" />
      </div>

      {/* Right Column Stack */}
      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6 items-center">
          <a href="#expertise" onClick={(e) => scrollToSection(e, 'expertise')} className="nav-link">Expertise</a>
          <a href="#qui-sommes-nous" onClick={(e) => scrollToSection(e, 'qui-sommes-nous')} className="nav-link">Qui sommes-nous</a>
          <a href="#realisations" onClick={(e) => scrollToSection(e, 'realisations')} className="nav-link">Réalisations</a>
        </div>
      </div>
      
      <style>{`
        .nav-link {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.1em;
            color: #d4d4d4;
            text-transform: uppercase;
            cursor: pointer;
            transition: color 0.2s;
        }
        .nav-link:hover {
            color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
