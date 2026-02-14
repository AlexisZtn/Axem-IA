
import React, { useState } from 'react';
import { Search, GraduationCap, Cpu, Rocket, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditableText from './ui/EditableText';
import { cn } from '../lib/utils';
import Reveal from './ui/Reveal';

const Expertise: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const steps = [
    {
      id: 'audit',
      icon: Search,
      number: "01",
      title: "Diagnostic",
      subtitle: "Audit & Cartographie",
      desc: "Analyse approfondie de vos processus pour identifier les goulots d'étranglement. Nous scannons votre business pour détecter où l'IA aura le ROI le plus immédiat.",
      tags: ["Audit Data", "Roadmap", "ROI"]
    },
    {
      id: 'strategy',
      icon: Rocket,
      number: "02",
      title: "Stratégie",
      subtitle: "Architecture Solution",
      desc: "Construction du plan de bataille. Sélection des modèles (GPT-4, Claude), sécurisation des données et design de l'infrastructure technique idéale.",
      tags: ["Architecture", "Sécurité", "Stack"]
    },
    {
      id: 'training',
      icon: GraduationCap,
      number: "03",
      title: "Activation",
      subtitle: "Formation Équipes",
      desc: "L'outil n'est rien sans la main. Nous transformons vos collaborateurs en 'Super-Utilisateurs' capables de prompter et d'interagir avec les modèles efficacement.",
      tags: ["Workshops", "Prompting", "Culture"]
    },
    {
      id: 'scale',
      icon: Cpu,
      number: "04",
      title: "Scaling",
      subtitle: "Automatisation",
      desc: "Déploiement d'agents autonomes et de workflows complexes (n8n, Make). Votre entreprise tourne 24/7, sans fatigue, avec une fiabilité industrielle.",
      tags: ["Agents", "n8n/Make", "Scale"]
    }
  ];

  return (
    <section 
      id="expertise" 
      className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FA9A]/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
           <div className="space-y-4">
              <Reveal>
                <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FA9A] animate-pulse"></span>
                    <EditableText value="Méthodologie" storageKey="exp_badge" />
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight">
                    <EditableText value="Protocole AXEM" storageKey="exp_title" />
                </h2>
              </Reveal>
           </div>
           <Reveal delay={0.2} className="md:text-right max-w-sm">
              <p className="text-neutral-500 text-base leading-relaxed">
                <EditableText isTextarea value="Une approche structurée pour transformer le chaos en clarté, et l'intention en automatisation." storageKey="exp_subtitle" />
              </p>
           </Reveal>
        </div>

        {/* Interactive Horizontal Accordion */}
        <div className="flex flex-col lg:flex-row h-[700px] lg:h-[500px] gap-4 w-full">
           {steps.map((step, idx) => {
             const isActive = activeIndex === idx;
             
             return (
               <motion.div 
                 key={idx}
                 layout
                 onClick={() => setActiveIndex(idx)}
                 onMouseEnter={() => setActiveIndex(idx)}
                 className={cn(
                   "relative rounded-3xl border cursor-pointer overflow-hidden transition-colors duration-500 ease-out group",
                   isActive 
                    ? "flex-[3] lg:flex-[2.5] bg-[#0a0a0a] border-[#00FA9A]/40 shadow-[0_0_30px_-10px_rgba(0,250,154,0.15)]" 
                    : "flex-[1] bg-[#080808] border-white/5 hover:border-white/10 hover:bg-[#0c0c0c]"
                 )}
                 transition={{ type: 'spring', stiffness: 200, damping: 25 }}
               >
                 {/* Large Background Icon (Decorative) */}
                 <div className={cn(
                    "absolute -bottom-10 -right-10 text-white/[0.03] transition-all duration-700 pointer-events-none",
                    isActive ? "scale-150 rotate-0 opacity-100" : "scale-100 rotate-12 opacity-0"
                 )}>
                    <step.icon size={300} strokeWidth={1} />
                 </div>

                 {/* Active State Gradient Overlay */}
                 <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-[#00FA9A]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500",
                    isActive && "opacity-100"
                 )} />

                 {/* Content Container */}
                 <div className="relative z-10 w-full h-full p-6 md:p-10 flex flex-col justify-between">
                    
                    {/* Top Section */}
                    <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col gap-2">
                            <span className={cn(
                                "font-mono text-xl md:text-3xl font-bold transition-colors duration-300",
                                isActive ? "text-[#00FA9A]" : "text-neutral-700 group-hover:text-neutral-500"
                            )}>
                                {step.number}
                            </span>
                            
                            {/* Collapsed State: Vertical Text */}
                            {!isActive && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-24 left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center pt-10"
                                >
                                    <h3 className="text-xl font-bold text-neutral-500 [writing-mode:vertical-rl] rotate-180 tracking-wider whitespace-nowrap uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                        <EditableText value={step.title} storageKey={`exp_t_${idx}`} />
                                    </h3>
                                </motion.div>
                            )}
                        </div>

                        {/* Collapsed Icon */}
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                            isActive 
                                ? "bg-[#00FA9A] text-black scale-100" 
                                : "bg-white/5 text-neutral-500 scale-75 lg:mt-auto lg:absolute lg:bottom-10 lg:left-1/2 lg:-translate-x-1/2"
                        )}>
                            <step.icon size={24} />
                        </div>
                    </div>

                    {/* Bottom Section (Visible only when Active) */}
                    <AnimatePresence mode="wait">
                        {isActive && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="mt-auto"
                            >
                                <h3 className="text-3xl md:text-5xl font-medium text-white mb-2 tracking-tight">
                                    <EditableText value={step.title} storageKey={`exp_t_${idx}`} />
                                </h3>
                                <p className="text-[#00FA9A] uppercase tracking-widest text-xs font-bold mb-6">
                                    <EditableText value={step.subtitle} storageKey={`exp_sub_${idx}`} />
                                </p>

                                <p className="text-neutral-400 text-sm md:text-lg leading-relaxed max-w-xl mb-8 border-l-2 border-[#00FA9A]/30 pl-4">
                                    <EditableText isTextarea value={step.desc} storageKey={`exp_desc_${idx}`} />
                                </p>

                                <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                                    {step.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="px-3 py-1.5 text-[10px] md:text-xs uppercase font-semibold tracking-wide text-neutral-300 bg-white/5 border border-white/10 rounded-lg hover:border-[#00FA9A]/40 hover:text-white transition-colors">
                                            <EditableText value={tag} storageKey={`exp_tag_${idx}_${tIdx}`} />
                                        </span>
                                    ))}
                                    <div className="flex-1" />
                                    <div className="hidden md:flex items-center gap-2 text-[#00FA9A] text-sm font-bold uppercase tracking-widest group/btn cursor-pointer">
                                        <span>En savoir plus</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
               </motion.div>
             );
           })}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
