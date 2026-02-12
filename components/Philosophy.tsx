
import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Briefcase } from 'lucide-react';
import EditableText from './ui/EditableText';

const Philosophy: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Image States
  const [clementImage, setClementImage] = useState<string>("https://github.com/AlexisZtn/Axem-IA/blob/c803ba324e9ab3d7feca2b40566356fb2405cb21/components/Gemini_Generated_Image_s55lmls55lmls55l.jpg?raw=true");
  const [alexisImage, setAlexisImage] = useState<string>("https://github.com/AlexisZtn/Axem-IA/blob/30e13194199c1c6c681954979c90242b710eebe1/components/Photo%20Alexis.png?raw=true");

  // Editable Content State
  const defaultTextContent = "La rencontre de deux mondes : L'Excellence Technique & La Stratégie Business. Nous ne sommes pas juste une agence, nous sommes le pont entre la complexité des machines et la réalité de votre croissance.";
  const [mainTextContent, setMainTextContent] = useState(defaultTextContent);

  useEffect(() => {
    // Load saved images
    const savedClement = localStorage.getItem('axem_philosophy_clement');
    const savedAlexis = localStorage.getItem('axem_philosophy_alexis');
    if (savedClement) setClementImage(savedClement);
    if (savedAlexis) setAlexisImage(savedAlexis);

    // Load saved main text
    const savedText = localStorage.getItem('philo_main_text');
    if (savedText) setMainTextContent(savedText);

    const handleScroll = () => {
      // Text Highlight Logic
      if (textRef.current) {
        const spans = textRef.current.querySelectorAll('span');
        const windowHeight = window.innerHeight;
        const centerPoint = windowHeight / 2;

        spans.forEach(span => {
          const rect = span.getBoundingClientRect();
          const spanCenter = rect.top + (rect.height / 2);
          const distanceFromCenter = Math.abs(spanCenter - centerPoint);
          let opacity = 1 - (distanceFromCenter / 300);
          opacity = Math.max(0.2, Math.min(1, opacity));
          
          span.style.opacity = opacity.toString();
          span.style.color = opacity > 0.8 ? '#ffffff' : 'inherit';
          span.style.textShadow = opacity > 0.8 ? '0 0 20px rgba(255,255,255,0.3)' : 'none';
        });
      }
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
    <section id="qui-sommes-nous" className="relative z-10 py-24 border-t border-white/5 bg-[#050505] min-h-[90vh] flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex justify-center md:justify-center">
            <span className="inline-block px-3 py-1 mb-8 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
                <EditableText value="Qui sommes-nous ?" storageKey="philo_badge" />
            </span>
        </div>
        
        {/* Main Text - Centered, Wider, Bigger Font */}
        {/* Increased margin-bottom from mb-16 to mb-36 to add space before the diagram */}
        <div className="relative group mb-36 w-full">
            <p ref={textRef} className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.2] text-neutral-500 relative cursor-default text-center w-full">
            {mainTextContent.split(' ').map((word, i) => (
                <span key={i} className="transition-opacity duration-300">{word} </span>
            ))}
            </p>
        </div>
        
        {/* Diagram */}
        <div 
          className="w-full max-w-6xl mx-auto mb-10 flex flex-col items-center scale-105"
        >
          {/* Root Node */}
          <div className="flex flex-col w-full items-center">
            <div className="z-10 bg-neutral-900/80 border-white/10 border rounded-2xl pt-6 pr-12 pb-6 pl-12 shadow-[0_0_50px_-15px_rgba(255,255,255,0.15)] backdrop-blur-md">
              <h3 className="md:text-6xl text-4xl italic text-white tracking-wide font-playfair font-medium">
                  <EditableText value="AXEM IA" storageKey="philo_diagram_root" />
              </h3>
            </div>
            {/* Vertical Connector */}
            <div className="h-16 w-px bg-gradient-to-b from-white/30 to-white/10"></div>
            
            {/* Branch Splitter */}
            <div className="w-[70%] md:w-[60%] h-px bg-white/10 relative">
              <div className="absolute left-0 top-0 h-10 w-px bg-white/10 origin-top"></div>
              <div className="absolute right-0 top-0 h-10 w-px bg-white/10 origin-top"></div>
            </div>
          </div>

          {/* Children Nodes */}
          <div className="grid grid-cols-2 gap-8 md:gap-32 w-full mt-10">
            
            {/* Left Branch - Clément (Strategy & ESSEC) */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 bg-[#050505] px-4 relative z-10 -mt-3">
                    <EditableText value="Stratégie & Business" storageKey="philo_left_tag_v3" />
                </span>
                
                {/* Image Avatar - Clément */}
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-neutral-800 border-2 border-white/10 overflow-hidden mb-4 relative shadow-2xl hover:scale-105 transition-transform duration-500">
                    <img src={clementImage} alt="Clément" className="opacity-100 w-full h-full object-cover" />
                </div>

                <div className="text-3xl md:text-5xl font-medium text-white">
                    <EditableText value="Clément" storageKey="philo_left_name_v3" />
                </div>
                <div className="text-sm md:text-lg text-[#00FA9A] uppercase tracking-widest font-bold">
                    <EditableText value="ESSEC" storageKey="philo_left_role_v3" />
                </div>
                <p className="text-center text-base md:text-xl text-neutral-400 max-w-[320px] leading-relaxed">
                   <EditableText isTextarea value="Le stratège. Celui qui traduit la technologie en rentabilité et en leviers de croissance." storageKey="philo_left_desc_v3" />
                </p>

                <div className="h-10 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-8 py-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center gap-4">
                    <Briefcase className="w-6 h-6 text-[#00FA9A]" />
                    <span className="text-base md:text-xl font-medium text-white">
                        <EditableText value="Vision Business" storageKey="philo_left_skill_v3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Branch - Alexis (Tech & Télécom) */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 bg-[#050505] px-4 relative z-10 -mt-3">
                    <EditableText value="Tech & Système" storageKey="philo_right_tag_v3" />
                </span>
                
                {/* Image Avatar - Alexis */}
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-neutral-800 border-2 border-white/10 overflow-hidden mb-4 relative shadow-2xl hover:scale-105 transition-transform duration-500">
                     <img src={alexisImage} alt="Alexis" className="opacity-100 w-full h-full object-cover" />
                </div>

                <div className="text-3xl md:text-5xl font-medium text-white">
                    <EditableText value="Alexis" storageKey="philo_right_name_v3" />
                </div>
                <div className="text-sm md:text-lg text-[#00FA9A] uppercase tracking-widest font-bold">
                    <EditableText value="Télécom Paris" storageKey="philo_right_role_v3" />
                </div>
                <p className="text-center text-base md:text-xl text-neutral-400 max-w-[320px] leading-relaxed">
                   <EditableText isTextarea value="L'ingénieur. Celui qui forge les systèmes et automatise l'intelligence pour transformer la vision en moteur de production." storageKey="philo_right_desc_v3" />
                </p>

                <div className="h-10 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-8 py-4 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center gap-4">
                    <Cpu className="w-6 h-6 text-[#00FA9A]" />
                    <span className="text-base md:text-xl font-medium text-white">
                        <EditableText value="Expertise Tech" storageKey="philo_right_skill_v3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Philosophy;
