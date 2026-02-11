
import React from 'react';
import LightRays from './LightRays';

const Hero: React.FC = () => {
  const scrollToRealisations = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('realisations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh] z-10 pt-40 pr-4 pb-32 pl-3 relative items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-[-1]">
         <LightRays
            raysOrigin="top-center"
            raysColor="#00FA9A"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
      </div>

      <div className="animate-reveal [animation-delay:100ms] text-center mb-10 space-y-2 opacity-0">
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.95] tracking-tight text-white">
          <span className="font-playfair italic font-normal text-neutral-300 mr-4">Rendre</span>
          <span className="font-medium tracking-tighter">l'IA simple,</span>
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.95] tracking-tight font-medium text-white">
          rentable et actionnable
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.95] tracking-tight font-medium text-neutral-500">
          pour votre croissance.
        </h1>
      </div>
      
      <p className="max-w-2xl text-center text-neutral-400 text-sm md:text-lg font-light leading-relaxed mb-12 animate-reveal [animation-delay:200ms] opacity-0">
        Formation, Conseil, Audit, Production & Automatisation IA
      </p>
      
      <div className="flex flex-col animate-reveal [animation-delay:300ms] sm:flex-row gap-x-5 gap-y-5 items-center opacity-0">
        <a 
          href="#realisations"
          onClick={scrollToRealisations}
          className="px-8 py-3.5 rounded-full bg-neutral-200 text-[#050505] font-playfair italic text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center"
        >
          Découvrir nos travaux
        </a>
        <a 
          href="https://calendly.com/clem-pred/30min"
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-neutral-200 text-sm font-medium hover:border-[#00FA9A]/50 hover:bg-[#00FA9A]/10 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(0,250,154,0.3)] transition-all duration-300 flex items-center justify-center"
        >
          Prendre rendez-vous
        </a>
      </div>
    </div>
  );
};

export default Hero;
