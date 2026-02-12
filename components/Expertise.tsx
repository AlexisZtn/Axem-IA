
import React, { useEffect, useRef } from 'react';
import EditableText from './ui/EditableText';

type Category = 'audit' | 'formation' | 'solutions' | 'automation';
const ORDERED_CATEGORIES: Category[] = ['audit', 'formation', 'solutions', 'automation'];

const Expertise: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories: Record<Category, { title: string; subtitle: string; tags: string[] }> = {
    audit: {
      title: "Audit & Conseil",
      subtitle: "La Boussole",
      tags: ["Stratégie IA", "Roadmap 90 jours", "Audit Sécurité & Data", "Cartographie des flux", "ROI Prévisionnel"]
    },
    formation: {
      title: "Formation",
      subtitle: "L'Autonomie",
      tags: ["Acculturation Équipes", "Prompt Engineering Avancé", "IA pour Dirigeants", "Ateliers Pratiques", "Gouvernance"]
    },
    solutions: {
      title: "Solutions Sur Mesure",
      subtitle: "L'Arsenal",
      tags: ["Création de Contenu (Avatars/SEO)", "Outils Productivité", "Dashboards Intelligents", "Chatbots & Agents", "Apps Internes"]
    },
    automation: {
      title: "Automatisation",
      subtitle: "Le Moteur",
      tags: ["Connexion API (n8n/Make)", "Gestion Admin Auto", "Legacy (AS400/WinDev)", "Scraping & Data", "Workflows complexes"]
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const items = containerRef.current.querySelectorAll('.expertise-item');
      const windowHeight = window.innerHeight;
      const centerPoint = windowHeight / 2;

      items.forEach((item) => {
        const element = item as HTMLElement;
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(elementCenter - centerPoint);
        
        // Reduced the divisor further to 150 for smaller items to have a snappy focus effect
        let opacity = 1 - (distanceFromCenter / 150);
        opacity = Math.max(0.15, Math.min(1, opacity));
        
        // Apply base opacity to the whole container
        element.style.opacity = opacity.toString();
        
        // Target title for the glow effect
        const title = element.querySelector('.expertise-title') as HTMLElement;
        const subtitle = element.querySelector('.expertise-subtitle') as HTMLElement;
        
        if (title) {
           // Threshold for "active" state highlight
           const isActive = opacity > 0.8;
           title.style.color = isActive ? '#ffffff' : '#404040'; // Bright white vs Dark Gray
           title.style.textShadow = isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none';
        }

        if (subtitle) {
             const isActive = opacity > 0.8;
             subtitle.style.color = isActive ? '#00FA9A' : '#1a4c35'; // Bright Green vs Dim Green
             subtitle.style.textShadow = isActive ? '0 0 10px rgba(0,250,154,0.3)' : 'none';
        }

        // Subtle scale breathing
        const scale = 0.95 + (opacity * 0.05);
        element.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div id="expertise" className="relative z-10 py-20 bg-[#050505] border-t border-white/5">
       <div className="max-w-4xl mx-auto px-6" ref={containerRef}>
          <div className="text-center mb-16">
             <p className="text-xs uppercase tracking-widest text-[#00FA9A] mb-3 opacity-80">
                <EditableText value="Notre Approche" storageKey="expertise_header_desktop" />
             </p>
             <h2 className="text-3xl md:text-4xl font-medium text-white opacity-90">
                <EditableText value="Nos 4 Piliers" storageKey="expertise_main_title" />
             </h2>
          </div>
          
          <div className="flex flex-col gap-10 pb-16">
             {ORDERED_CATEGORIES.map(key => {
               const cat = categories[key];
               return (
                  <div key={key} className="expertise-item flex flex-col items-center justify-center text-center transition-all duration-100 ease-linear will-change-transform">
                      <p className="expertise-subtitle text-[#1a4c35] text-[10px] uppercase tracking-widest mb-1 font-medium transition-all duration-300">
                        <EditableText value={cat.subtitle} storageKey={`expertise_${key}_subtitle`} />
                      </p>
                      
                      <h2 className="expertise-title font-playfair italic text-3xl md:text-4xl lg:text-5xl font-medium mb-4 transition-colors duration-300 text-neutral-800">
                          <EditableText value={cat.title} storageKey={`expertise_${key}_title`} />
                      </h2>
                      
                      <div className="expertise-tags flex flex-wrap justify-center gap-2 max-w-2xl transition-opacity duration-300">
                        {cat.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-[#121212] border border-white/5 text-neutral-400 text-[10px] md:text-xs">
                            <EditableText value={tag} storageKey={`expertise_${key}_tag_${i}`} />
                          </span>
                        ))}
                      </div>
                  </div>
               );
             })}
          </div>
       </div>
    </div>
  );
};

export default Expertise;
