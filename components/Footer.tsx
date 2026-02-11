
import React from 'react';
import { ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react';
import AxemLogo from './AxemLogo';

interface FooterProps {
  customLogo?: string | null;
}

const Footer: React.FC<FooterProps> = ({ customLogo }) => {
  return (
    <footer id="footer" className="relative z-20 py-24 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 z-0 bg-black pointer-events-none">
         <div className="absolute w-[150%] h-[150%] -top-[40%] -right-[30%] bg-[radial-gradient(circle_farthest-corner_at_center,_var(--tw-gradient-stops))] from-[#00FA9A]/20 via-[#050505] to-black blur-[100px] opacity-60"></div>
         <div className="absolute w-[80%] h-[80%] top-[10%] right-[0%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00FA9A]/10 via-transparent to-transparent blur-[80px] rotate-45"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-t border-white/5 pt-16">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-6">
              <AxemLogo src={customLogo} className="h-16 w-auto origin-left" />
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-white text-sm">Produit</h4>
            <a href="#" className="text-sm text-[#00FA9A] hover:text-[#00FA9A] transition-colors">Expertise</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Cas d'usage</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Tarifs</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-white text-sm">Services</h4>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Formation IA</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Automatisation</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Conseil Stratégique</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-white text-sm">Entreprise</h4>
            <a href="#qui-sommes-nous" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">À propos</a>
            <a href="#" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Articles</a>
            <a href="mailto:axemiacontact@gmail.com" className="text-sm text-neutral-500 hover:text-[#00FA9A] transition-colors">Contact</a>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 text-xs text-neutral-600">
          © 2025 AXEM IA. Tous droits réservés.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
