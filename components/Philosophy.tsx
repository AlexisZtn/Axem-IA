
import React, { useEffect, useRef, useState } from 'react';
import { Users, Lightbulb, Cpu, Briefcase, Loader2, Upload } from 'lucide-react';

// --- Utility: Safe Image Compression ---
const compressImageSafe = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Smaller max width for avatars
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Philosophy: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [showDiagram, setShowDiagram] = useState(false);

  // Image States
  const [clementImage, setClementImage] = useState<string>("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200");
  const [alexisImage, setAlexisImage] = useState<string>("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200");

  // Loading & Drag States
  const [processingState, setProcessingState] = useState<{target: 'clement' | 'alexis' | null}>({ target: null });
  const [dragOverState, setDragOverState] = useState<{target: 'clement' | 'alexis' | null}>({ target: null });

  useEffect(() => {
    // Load saved images
    const savedClement = localStorage.getItem('axem_philosophy_clement');
    const savedAlexis = localStorage.getItem('axem_philosophy_alexis');
    if (savedClement) setClementImage(savedClement);
    if (savedAlexis) setAlexisImage(savedAlexis);

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

      // Diagram Reveal Logic
      if (diagramRef.current) {
        const rect = diagramRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setShowDiagram(true);
        }
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

  const handleDragOver = (e: React.DragEvent, target: 'clement' | 'alexis') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverState({ target });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverState({ target: null });
  };

  const handleDrop = async (e: React.DragEvent, target: 'clement' | 'alexis') => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverState({ target: null });

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Cast e.dataTransfer.files to unknown first to avoid iterable iterator issues if config is strict,
      // but Array.from usually works. The error suggests inference failure.
      // Explicitly typing 'f' as File solves it.
      const file = Array.from(e.dataTransfer.files).find((f: File) => f.type.startsWith('image/'));
      if (file) {
        setProcessingState({ target });
        try {
          const base64 = await compressImageSafe(file);
          if (target === 'clement') {
            setClementImage(base64);
            localStorage.setItem('axem_philosophy_clement', base64);
          } else {
            setAlexisImage(base64);
            localStorage.setItem('axem_philosophy_alexis', base64);
          }
        } catch (err) {
          console.error("Failed to update image", err);
        } finally {
          setProcessingState({ target: null });
        }
      }
    }
  };

  const textContent = "La rencontre de deux mondes : L'Excellence Technique & La Stratégie Business. Nous ne sommes pas juste une agence, nous sommes le pont entre la complexité des machines et la réalité de votre croissance.";

  return (
    <section id="qui-sommes-nous" className="relative z-10 py-32 border-t border-white/5 bg-[#050505] min-h-[90vh] flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 text-center md:text-left w-full">
        <span className="inline-block px-3 py-1 mb-8 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">Qui sommes-nous ?</span>
        
        <p ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.3] text-neutral-500 mb-20">
          {textContent.split(' ').map((word, i) => (
            <span key={i} className="transition-opacity duration-300">{word} </span>
          ))}
        </p>
        
        {/* Diagram */}
        <div 
          ref={diagramRef}
          className={`transition-all duration-1000 w-full max-w-4xl mr-auto mb-20 ml-auto flex flex-col items-center
            ${showDiagram ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Root Node */}
          <div className="flex flex-col w-full items-center">
            <div className="z-10 bg-neutral-900/50 border-white/10 border rounded-xl pt-4 pr-8 pb-4 pl-8 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] backdrop-blur-md">
              <h3 className="md:text-3xl text-2xl italic text-white tracking-wide font-playfair">AXEM IA</h3>
            </div>
            {/* Vertical Connector */}
            <div className="h-12 w-px bg-gradient-to-b from-white/20 to-white/10"></div>
            
            {/* Branch Splitter */}
            <div className="w-[60%] md:w-[70%] h-px bg-white/10 relative">
              <div className="absolute left-0 top-0 h-8 w-px bg-white/10 origin-top"></div>
              <div className="absolute right-0 top-0 h-8 w-px bg-white/10 origin-top"></div>
            </div>
          </div>

          {/* Children Nodes */}
          <div className="grid grid-cols-2 gap-8 md:gap-24 w-full mt-8">
            
            {/* Left Branch - Clément */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 bg-[#050505] px-2 relative z-10 -mt-2">Tech & Système</span>
                
                {/* Image Avatar */}
                <div 
                  className={`w-20 h-20 rounded-full bg-neutral-800 border border-white/10 overflow-hidden mb-2 relative group cursor-pointer transition-all duration-300
                    ${dragOverState.target === 'clement' ? 'ring-2 ring-[#00FA9A] scale-110' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, 'clement')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'clement')}
                >
                     {processingState.target === 'clement' && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                         <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
                       </div>
                     )}
                     
                     <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-10 transition-opacity duration-300 ${dragOverState.target === 'clement' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <Upload className="w-5 h-5 text-white" />
                     </div>

                     <img src={clementImage} alt="Clément" className="opacity-90 w-full h-full object-cover" />
                </div>

                <div className="text-xl md:text-2xl font-medium text-white/90">Clément</div>
                <div className="text-xs text-[#00FA9A] uppercase tracking-widest font-bold">Ingénieur Télécom</div>
                <p className="text-center text-sm text-neutral-400 max-w-[200px]">
                   L'architecte. Celui qui fait parler les machines, du vieil AS400 aux derniers modèles LLM.
                </p>

                <div className="h-8 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-6 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-[#00FA9A]" />
                    <span className="text-sm md:text-base font-medium text-white">Expertise Tech</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Branch - Alexis */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 bg-[#050505] px-2 relative z-10 -mt-2">Stratégie & Business</span>
                
                {/* Image Avatar */}
                <div 
                  className={`w-20 h-20 rounded-full bg-neutral-800 border border-white/10 overflow-hidden mb-2 relative group cursor-pointer transition-all duration-300
                    ${dragOverState.target === 'alexis' ? 'ring-2 ring-[#00FA9A] scale-110' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, 'alexis')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'alexis')}
                >
                    {processingState.target === 'alexis' && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                         <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
                       </div>
                     )}

                     <div className={`absolute inset-0 bg-black/50 flex items-center justify-center z-10 transition-opacity duration-300 ${dragOverState.target === 'alexis' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <Upload className="w-5 h-5 text-white" />
                     </div>
                     
                    <img src={alexisImage} alt="Alexis" className="opacity-90 w-full h-full object-cover" />
                </div>

                <div className="text-xl md:text-2xl font-medium text-white/90">Alexis</div>
                <div className="text-xs text-[#00FA9A] uppercase tracking-widest font-bold">ESSEC</div>
                <p className="text-center text-sm text-neutral-400 max-w-[200px]">
                   Le stratège. Celui qui traduit la technologie en rentabilité et en leviers de croissance.
                </p>

                <div className="h-8 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-6 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-[#00FA9A]" />
                    <span className="text-sm md:text-base font-medium text-white">Vision Business</span>
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
