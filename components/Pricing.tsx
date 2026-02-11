import React from 'react';
import { Check, Calendar } from 'lucide-react';
import EditableText from './ui/EditableText';

const Pricing: React.FC = () => {
  return (
    <section className="bg-[#050505] z-10 border-white/5 border-t pt-32 pb-32 relative" id="pricing">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 flex flex-wrap justify-center gap-x-3">
            <EditableText value="Tarification" storageKey="pricing_title_1" />
            <span className="font-playfair italic text-neutral-400">
                <EditableText value="Sur Mesure" storageKey="pricing_title_2" />
            </span>
          </h2>
          <div className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
            <EditableText 
                isTextarea 
                value="Parce que chaque entreprise a des besoins uniques, nous construisons nos offres en fonction de vos projets et de vos ambitions. Pas de grille rigide, uniquement de la valeur ajoutée."
                storageKey="pricing_desc"
                className="text-center w-full"
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_50px_-20px_rgba(0,250,154,0.1)] relative overflow-hidden animate-reveal">
            
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00FA9A]/5 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none -ml-10 -mb-10"></div>

            <div className="relative z-10 flex flex-col items-center">
                <h3 className="font-playfair italic text-3xl text-white mb-6">
                    <EditableText value="Parlons de votre projet" storageKey="pricing_card_title" />
                </h3>
                <div className="text-neutral-500 mb-10 max-w-lg text-center">
                    <EditableText 
                        isTextarea 
                        value="Discutons de vos objectifs pour établir une proposition adaptée à votre budget et à vos délais."
                        storageKey="pricing_card_desc"
                        className="text-center w-full"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <a 
                        href="https://calendly.com/clem-pred/30min" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] min-w-[240px]"
                    >
                        <Calendar className="w-5 h-5" />
                        <span>
                            <EditableText value="Réserver un appel découverte" storageKey="pricing_btn_text" className="bg-transparent border-none text-black hover:border-none" />
                        </span>
                    </a>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col md:flex-row justify-center gap-6 md:gap-12">
                     <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                        <Check className="w-4 h-4 text-[#00FA9A]" />
                        <span><EditableText value="Devis gratuit sous 24h" storageKey="pricing_feature_1" /></span>
                     </div>
                     <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                        <Check className="w-4 h-4 text-[#00FA9A]" />
                        <span><EditableText value="Accompagnement personnalisé" storageKey="pricing_feature_2" /></span>
                     </div>
                     <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                        <Check className="w-4 h-4 text-[#00FA9A]" />
                        <span><EditableText value="Flexibilité & Agilité" storageKey="pricing_feature_3" /></span>
                     </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;