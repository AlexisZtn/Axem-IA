
import React, { useEffect, useState, useRef } from 'react';

type Category = 'audit' | 'formation' | 'solutions' | 'automation';

const Expertise: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('audit');

  const categories = {
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
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const scrollDistance = -rect.top;
      const totalDistance = rect.height - viewHeight;
      let progress = scrollDistance / totalDistance;
      
      progress = Math.max(0, Math.min(1, progress));

      // Divide progress into 4 sections (0.25 each)
      if (progress < 0.25) {
        setActiveCategory('audit');
      } else if (progress < 0.5) {
        setActiveCategory('formation');
      } else if (progress < 0.75) {
        setActiveCategory('solutions');
      } else {
        setActiveCategory('automation');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="expertise" ref={sectionRef} className="relative z-10 w-full lg:h-[400vh] min-h-screen">
      
      {/* Mobile/Tablet Layout (Static) */}
      <div className="lg:hidden px-6 py-24 border-t border-white/5">
        <p className="text-white text-sm uppercase tracking-widest mb-16">Nos 4 Piliers d'Intervention</p>
        
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="mb-14">
             <div className="flex items-baseline gap-3 mb-2">
                <h2 className="font-playfair italic text-3xl text-white font-normal">{cat.title}</h2>
             </div>
            <p className="text-[#00FA9A] text-xs uppercase tracking-widest mb-6 font-medium">{cat.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              {cat.tags.map(tag => (
                <span key={tag} className="px-5 py-2.5 rounded-full bg-[#181818] border border-white/20 text-white text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Layout (Sticky & Interactive) */}
      <div className="hidden lg:flex sticky overflow-hidden bg-[#050505]/80 w-full h-screen border-white/5 border-t top-0 backdrop-blur-xl items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Headings */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <p className="text-xs font-medium tracking-[0.2em] text-[#00FA9A] uppercase mb-4">Nos 4 Piliers</p>
            
            {(Object.keys(categories) as Category[]).map(key => (
              <div 
                key={key} 
                className={`transition-all duration-500 ease-out cursor-pointer group ${
                  activeCategory === key 
                  ? 'opacity-100 translate-x-3' 
                  : 'opacity-30 hover:opacity-60'
                }`}
              >
                <h2 className={`font-playfair italic text-4xl lg:text-5xl font-medium mb-1 ${activeCategory === key ? 'text-white' : 'text-neutral-400'}`}>
                  {categories[key].title}
                </h2>
                <div className={`text-xs uppercase tracking-widest transition-colors duration-300 ${activeCategory === key ? 'text-[#00FA9A]' : 'text-transparent group-hover:text-neutral-600'}`}>
                    {categories[key].subtitle}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Tag Cloud */}
          <div className="lg:col-span-7 w-full">
            <div className="flex flex-wrap gap-3 lg:justify-end w-full content-center">
               {(Object.keys(categories) as Category[]).map(key => (
                  categories[key].tags.map(tag => (
                    <div 
                      key={tag} 
                      className={`px-6 py-3 rounded-full border text-sm transition-all duration-700
                        ${activeCategory === key
                          ? 'border-[#00FA9A]/30 bg-[#00FA9A]/5 text-[#00FA9A] shadow-[0_0_20px_-5px_rgba(0,250,154,0.15)] opacity-100 scale-100'
                          : 'border-white/5 bg-[#0a0a0a] text-[#525252] opacity-40 scale-95 grayscale'
                        }
                      `}
                    >
                      {tag}
                    </div>
                  ))
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Expertise;
