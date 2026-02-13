
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import EditableText from './EditableText';

// --- Interfaces & Constants ---

export interface Project {
  id: string;
  image: string; // The cover image
  title: string;
  category?: string;
  gallery?: string[]; // Array of images if multiple are uploaded
  content?: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

// --- Internal Components ---

interface ProjectCardProps {
  project: Project;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    
    const rotation = factor * 25; 
    const translationX = factor * 85; 
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 cursor-pointer group/card",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
      >
        <div className={cn(
          "w-full h-full rounded-lg overflow-hidden shadow-xl bg-card border border-white/5 relative bg-black",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:shadow-accent/40 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:scale-125"
        )}>
          <img 
            src={project.image || PLACEHOLDER_IMAGE} 
            key={project.image}
            alt={project.title} 
            className="w-full h-full object-contain bg-black"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          
          {/* Multi-image indicator */}
          {project.gallery && project.gallery.length > 1 && (
             <div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm rounded-full p-0.5">
                <Layers className="w-3 h-3 text-white" />
             </div>
          )}
          
          <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">
            {project.title}
          </p>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: Project[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
  onOpenDetail: (index: number) => void;
  onUpdateText: (index: number, newTitle: string) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
  onOpenDetail,
  onUpdateText
}) => {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];
  
  const galleryImages = currentProject?.gallery || [currentProject?.image];
  const totalGalleryImages = galleryImages.length;
  const hasGalleryNext = currentGalleryIndex < totalGalleryImages - 1;
  const hasGalleryPrev = currentGalleryIndex > 0;

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setCurrentGalleryIndex(0);
        setIsSliding(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setCurrentGalleryIndex(0);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (hasGalleryNext) {
        setCurrentGalleryIndex(prev => prev + 1);
        return;
    }
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate, hasGalleryNext]);

  const navigatePrev = useCallback(() => {
    if (hasGalleryPrev) {
        setCurrentGalleryIndex(prev => prev - 1);
        return;
    }
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate, hasGalleryPrev]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 500);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      
      // Use a slightly simplified animation trigger to ensure it fires reliably
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
      
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return;
    onNavigate(idx);
  };

  const handleOpenDetailClick = () => {
      onOpenDetail(internalIndex);
  };

  if (!shouldRender || !currentProject) return null;

  // Simplified initial styles to be more robust
  const getInitialStyles = (): React.CSSProperties => {
    if (sourceRect) {
        // FLIP animation if rect exists
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const targetWidth = Math.min(800, viewportWidth - 32);
        // Estimate height based on aspect ratio or fixed constraint
        const targetHeight = Math.min(viewportHeight * 0.8, 600); 
        
        const targetX = (viewportWidth - targetWidth) / 2;
        const targetY = (viewportHeight - targetHeight) / 2;
        
        const scaleX = sourceRect.width / targetWidth;
        const scaleY = sourceRect.height / targetHeight;
        
        // Use uniform scale to prevent distortion during transit
        const scale = Math.max(scaleX, scaleY); 
        
        const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2);
        const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2);

        return {
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          opacity: 0,
        };
    }
    
    // Fallback if no rect (clean zoom in)
    return {
      transform: `scale(0.8)`,
      opacity: 0,
    };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
  });

  const currentStyles = animationPhase === "initial" && !isClosing ? getInitialStyles() : getFinalStyles();
  
  // Combine prev/next logic visually
  const canGoLeft = hasPrev || hasGalleryPrev;
  const canGoRight = hasNext || hasGalleryNext;

  return (
    <div
      className={cn("fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 cursor-default")}
      onClick={handleClose}
      style={{
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500"
        style={{
          opacity: (animationPhase === "initial" || isClosing) ? 0 : 1,
        }}
      />
      
      {/* Close Button - High Contrast */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[210] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group"
      >
        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
      </button>

      {/* Nav Buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
        disabled={!canGoLeft || isSliding}
        className={cn(
          "absolute left-2 md:left-8 z-[210] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#00FA9A] text-white hover:text-black border border-white/10 hover:border-[#00FA9A] backdrop-blur-md transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110",
        )}
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); navigateNext(); }}
        disabled={!canGoRight || isSliding}
        className={cn(
          "absolute right-2 md:right-8 z-[210] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/50 hover:bg-[#00FA9A] text-white hover:text-black border border-white/10 hover:border-[#00FA9A] backdrop-blur-md transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110",
        )}
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
      </button>

      {/* Main Content Card */}
      <div
        ref={containerRef}
        className="relative z-[205] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transition: "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease-out",
        }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
            
          {/* Image Area */}
          <div className="relative overflow-hidden aspect-[16/10] md:aspect-[16/9] bg-black group/image">
            <div
              className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
              }}
            >
              {projects.map((project, idx) => {
                 const pGallery = project.gallery || [project.image];
                 return (
                <div key={project.id} className="min-w-full h-full relative">
                    {/* Only render content if active or adjacent for performance */}
                    {Math.abs(idx - internalIndex) <= 1 && (
                        idx === internalIndex ? (
                           <div className="w-full h-full relative">
                              {pGallery.map((imgSrc, gIdx) => (
                                 <img
                                    key={gIdx}
                                    src={imgSrc || PLACEHOLDER_IMAGE}
                                    alt={`${project.title} - ${gIdx}`}
                                    className={cn(
                                        "absolute inset-0 w-full h-full object-contain bg-black select-none transition-opacity duration-500",
                                        gIdx === currentGalleryIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                                    )}
                                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                                />
                              ))}
                           </div>
                        ) : (
                            <img
                                src={project.image || PLACEHOLDER_IMAGE}
                                alt={project.title}
                                className="w-full h-full object-contain bg-black select-none opacity-50"
                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                            />
                        )
                    )}
                  
                  {/* Gallery Indicators */}
                  {pGallery.length > 1 && idx === internalIndex && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5">
                        {pGallery.map((_, dotIdx) => (
                             <div 
                                key={dotIdx} 
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    dotIdx === currentGalleryIndex ? "bg-[#00FA9A] w-6" : "bg-white/40"
                                )}
                             />
                        ))}
                    </div>
                  )}

                </div>
              )})}
            </div>
          </div>
          
          {/* Footer Info Area */}
          <div className="p-6 md:p-8 bg-[#0a0a0a] border-t border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
                       <EditableText value={currentProject?.title} onSave={(val) => onUpdateText(internalIndex, val)} />
                    </h3>
                    {totalGalleryImages > 1 && (
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            Img {currentGalleryIndex + 1}/{totalGalleryImages}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-4">
                   <p className="text-sm text-[#00FA9A] uppercase tracking-widest font-medium">
                       {currentProject?.category || "Étude de cas"}
                   </p>
                   <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
                   <p className="text-xs text-neutral-500 font-mono">
                      Projet {internalIndex + 1} / {totalProjects}
                   </p>
                </div>
              </div>

              {/* ACTION BUTTON - KEY FOR USABILITY */}
              <button 
                onClick={handleOpenDetailClick}
                className={cn(
                    "w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4",
                    "bg-[#00FA9A] hover:bg-[#00d180] text-black font-bold uppercase tracking-widest text-sm",
                    "rounded-xl shadow-[0_0_20px_rgba(0,250,154,0.2)] hover:shadow-[0_0_30px_rgba(0,250,154,0.4)]",
                    "transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <span>Voir le projet complet</span>
                <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface AnimatedFolderProps {
  title: string;
  projects: Project[];
  className?: string;
  gradient?: string;
  onFolderUpdate?: (newImages: string[]) => void;
  onProjectUpdate?: (projectIndex: number, newImages: string[]) => void;
  onTitleUpdate?: (newTitle: string) => void;
  onProjectTitleUpdate?: (projectIndex: number, newTitle: string) => void;
  onOpenDetail?: (index: number) => void;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ 
  title, 
  projects, 
  className, 
  gradient, 
  onFolderUpdate, 
  onProjectUpdate, 
  onTitleUpdate, 
  onProjectTitleUpdate,
  onOpenDetail 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Only show first 5 projects in the folder view to avoid visual clutter
  const previewProjects = projects.slice(0, 5);

  const handleProjectClick = (project: Project, index: number) => {
    // Stop hovering effect immediately to freeze position
    setIsHovered(false);
    
    const cardEl = cardRefs.current[index];
    if (cardEl) {
        setSourceRect(cardEl.getBoundingClientRect());
    } else {
        setSourceRect(null); // Fallback to center zoom
    }
    setSelectedIndex(index);
    setHiddenCardId(project.id);
  };

  const handleCloseLightbox = () => { 
      setSelectedIndex(null); 
      setSourceRect(null); 
      // Re-enable hover effects after close
      // setIsHovered(false); // Already false
  };
  
  const handleCloseComplete = () => { 
      setHiddenCardId(null); 
  };
  
  const handleNavigate = (newIndex: number) => { 
      setSelectedIndex(newIndex); 
      setHiddenCardId(projects[newIndex]?.id || null); 
  };
  
  const handleOpenDetail = (index: number) => {
      // Close lightbox immediately when going to detail to avoid weird overlaps
      setSelectedIndex(null);
      if (onOpenDetail) onOpenDetail(index);
  };

  const backBg = gradient || "linear-gradient(135deg, var(--folder-back) 0%, var(--folder-tab) 100%)";
  const tabBg = gradient || "var(--folder-tab)";
  const frontBg = gradient || "linear-gradient(135deg, var(--folder-front) 0%, var(--folder-back) 100%)";

  return (
    <>
      <div
        className={cn(
            "relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer bg-card border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group",
            "border-border hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/40",
            className
        )}
        style={{ 
            minWidth: "280px", 
            minHeight: "320px", 
            perspective: "1200px", 
            transform: (isHovered && selectedIndex === null) ? "scale(1.04) rotate(-1.5deg)" : "scale(1) rotate(0deg)" 
        }}
        onMouseEnter={() => { if (selectedIndex === null) setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-700"
          style={{ background: gradient ? `radial-gradient(circle at 50% 70%, ${gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || 'var(--accent)'} 0%, transparent 70%)` : "radial-gradient(circle at 50% 70%, var(--accent) 0%, transparent 70%)", opacity: isHovered ? 0.12 : 0 }}
        />
        <div className="relative flex items-center justify-center mb-4" style={{ height: "160px", width: "200px" }}>
          <div className="absolute w-32 h-24 rounded-lg shadow-md border border-white/10" style={{ background: backBg, filter: gradient ? "brightness(0.9)" : "none", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute w-12 h-4 rounded-t-md border-t border-x border-white/10" style={{ background: tabBg, filter: gradient ? "brightness(0.85)" : "none", top: "calc(50% - 48px - 12px)", left: "calc(50% - 64px + 16px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
            {previewProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                ref={(el) => { cardRefs.current[index] = el; }} 
                project={project}
                delay={index * 50} 
                isVisible={isHovered} 
                index={index} 
                totalCount={previewProjects.length} 
                onClick={() => handleProjectClick(project, index)} 
                isSelected={hiddenCardId === project.id} 
              />
            ))}
          </div>
          <div className="absolute w-32 h-24 rounded-lg shadow-lg border border-white/20" style={{ background: frontBg, top: "calc(50% - 48px + 4px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 30 }} />
          <div className="absolute w-32 h-24 rounded-lg overflow-hidden pointer-events-none" style={{ top: "calc(50% - 48px + 4px)", background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 31 }} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mt-4 transition-all duration-500" style={{ transform: isHovered ? "translateY(2px)" : "translateY(0)", letterSpacing: isHovered ? "-0.01em" : "0" }}>
              {onTitleUpdate ? (
                  <EditableText value={title} onSave={onTitleUpdate} />
              ) : title}
          </h3>
          <p className="text-sm font-medium text-muted-foreground transition-all duration-500" style={{ opacity: isHovered ? 0.8 : 1 }}>{projects.length} {projects.length === 1 ? 'projet' : 'projets'}</p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 transition-all duration-500" style={{ opacity: isHovered ? 0 : 1, transform: isHovered ? "translateY(10px)" : "translateY(0)" }}>
          <span>Survoler</span>
        </div>
      </div>
      <ImageLightbox 
        projects={projects} 
        currentIndex={selectedIndex ?? 0} 
        isOpen={selectedIndex !== null} 
        onClose={handleCloseLightbox} 
        sourceRect={sourceRect} 
        onCloseComplete={handleCloseComplete} 
        onNavigate={handleNavigate} 
        onOpenDetail={handleOpenDetail}
        onUpdateText={(idx, txt) => onProjectTitleUpdate && onProjectTitleUpdate(idx, txt)}
      />
    </>
  );
};
