import React, { useEffect, useRef, useState } from 'react';
import { Users, Lightbulb, Cpu, Briefcase, Loader2, Upload } from 'lucide-react';
import EditableText from './ui/EditableText';

// Use static paths instead of imports to avoid module resolution errors with spaces
const clementSrc = 'components/photo%20clement.png';
const alexisSrc = 'https://res.cloudinary.com/dafa3vxgb/image/upload/v1770836602/photo_alexis_puwpu0.png';

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

  // Image States - Initialized with imported assets
  const [clementImage, setClementImage] = useState<string>(clementSrc);
  const [alexisImage, setAlexisImage] = useState<string>(alexisSrc);

  // Editable Content State (initialized with defaults for animation logic)
  const defaultTextContent = "La rencontre de deux mondes : L'Excellence Technique & La Stratégie Business. Nous ne sommes pas juste une agence, nous sommes le pont entre la complexité des machines et la réalité de votre croissance.";
  const [mainTextContent, setMainTextContent] = useState(defaultTextContent);

  // Loading & Drag States
  const [processingState, setProcessingState] = useState<{target: 'clement' | 'alexis' | null}>({ target: null });
  const [dragOverState, setDragOverState] = useState<{target: 'clement' | 'alexis' | null}>({ target: null });

  useEffect(() => {
    // Load saved images ONLY if they are base64 data (user uploads).
    const savedClement = localStorage.getItem('axem_philosophy_clement');
    const savedAlexis = localStorage.getItem('axem_philosophy_alexis');
    
    if (savedClement && savedClement.startsWith('data:')) {
        setClementImage(savedClement);
    }
    if (savedAlexis && savedAlexis.startsWith('data:')) {
        setAlexisImage(savedAlexis);
    }

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
      const files = Array.from(e.dataTransfer.files) as File[];
      const file = files.find(f => f.type.startsWith('image/'));
      
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

  return (
    <section id="qui-sommes-nous" className="relative z-10 py-32 border-t border-white/5 bg-[#050505] min-h-[90vh] flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 text-center md:text-left w-full">
        <span className="inline-block px-3 py-1 mb-8 text-[10px] tracking-widest text-[#00FA9A] border border-[#00FA9A]/20 rounded-full bg-[#00FA9A]/5 uppercase">
            <EditableText value="Qui sommes-nous ?" storageKey="philo_badge" />
        </span>
        
        <div className="relative group">
            <p ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.3] text-neutral-500 mb-20 relative">
            {mainTextContent.split(' ').map((word, i) => (
                <span key={i} className="transition-opacity duration-300">{word} </span>
            ))}
             <div className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer z-10">
                 <div className="w-full">
                    <EditableText 
                        value={mainTextContent} 
                        storageKey="philo_main_text" 
                        isTextarea 
                        onSave={setMainTextContent}
                        className="text-xl md:text-3xl text-white bg-black/90 min-h-[200px]"
                    />
                 </div>
             </div>
            </p>
        </div>
        
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
              <h3 className="md:text-3xl text-2xl italic text-white tracking-wide font-playfair">
                  <EditableText value="AXEM IA" storageKey="philo_diagram_root" />
              </h3>
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
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 bg-[#050505] px-2 relative z-10 -mt-2">
                    <EditableText value="Tech & Système" storageKey="philo_left_tag" />
                </span>
                
                {/* Image Avatar */}
                <div 
                  className={`w-20 h-20 rounded-full bg-neutral-800 border border-white/10 overflow-hidden mb-2 relative group cursor-pointer transition-all duration-300
                    ${dragOverState.target === 'clement' ? 'ring-2 ring-[#00FA9A] scale-110' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, 'clement')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'clement')}
                  title="Glissez une photo ici pour mettre à jour"
                >
                     {processingState.target === 'clement' && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                         <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
                       </div>
                     )}
                     
                     <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 transition-opacity duration-300 ${dragOverState.target === 'clement' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <Upload className="w-5 h-5 text-white mb-1" />
                        <span className="text-[8px] text-white uppercase tracking-widest font-bold">Changer</span>
                     </div>

                     <img src={clementImage} alt="Clément" className="opacity-90 w-full h-full object-cover" />
                </div>

                <div className="text-xl md:text-2xl font-medium text-white/90">
                    <EditableText value="Clément" storageKey="philo_left_name" />
                </div>
                <div className="text-xs text-[#00FA9A] uppercase tracking-widest font-bold">
                    <EditableText value="Télécom Paris" storageKey="philo_left_role_v3" />
                </div>
                <p className="text-center text-sm text-neutral-400 max-w-[200px]">
                   <EditableText isTextarea value="L'architecte. Celui qui fait parler les machines, du vieil AS400 aux derniers modèles LLM." storageKey="philo_left_desc" />
                </p>

                <div className="h-8 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-6 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-[#00FA9A]" />
                    <span className="text-sm md:text-base font-medium text-white">
                        <EditableText value="Expertise Tech" storageKey="philo_left_skill" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Branch - Alexis */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 bg-[#050505] px-2 relative z-10 -mt-2">
                    <EditableText value="Stratégie & Business" storageKey="philo_right_tag" />
                </span>
                
                {/* Image Avatar */}
                <div 
                  className={`w-20 h-20 rounded-full bg-neutral-800 border border-white/10 overflow-hidden mb-2 relative group cursor-pointer transition-all duration-300
                    ${dragOverState.target === 'alexis' ? 'ring-2 ring-[#00FA9A] scale-110' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, 'alexis')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'alexis')}
                  title="Glissez une photo ici pour mettre à jour"
                >
                    {processingState.target === 'alexis' && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                         <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
                       </div>
                     )}

                     <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 transition-opacity duration-300 ${dragOverState.target === 'alexis' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <Upload className="w-5 h-5 text-white mb-1" />
                        <span className="text-[8px] text-white uppercase tracking-widest font-bold">Changer</span>
                     </div>
                     
                    <img src={alexisImage} alt="Alexis" className="opacity-90 w-full h-full object-cover" />
                </div>

                <div className="text-xl md:text-2xl font-medium text-white/90">
                    <EditableText value="Alexis" storageKey="philo_right_name" />
                </div>
                <div className="text-xs text-[#00FA9A] uppercase tracking-widest font-bold">
                    <EditableText value="ESSEC" storageKey="philo_right_role" />
                </div>
                <p className="text-center text-sm text-neutral-400 max-w-[200px]">
                   <EditableText isTextarea value="Le stratège. Celui qui traduit la technologie en rentabilité et en leviers de croissance." storageKey="philo_right_desc" />
                </p>

                <div className="h-8 w-px border-l border-dashed border-white/20 my-2"></div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A]/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative px-6 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-[#00FA9A]" />
                    <span className="text-sm md:text-base font-medium text-white">
                        <EditableText value="Vision Business" storageKey="philo_right_skill" />
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