
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Image as ImageIcon, ArrowRight, Upload, Loader2, Video } from 'lucide-react';
import EditableText from './ui/EditableText';

interface ProjectDetailProps {
  projectId: string | number;
  initialData: any;
  onClose: () => void;
  onSave: (id: string | number, newData: any) => void;
}

// --- Utilities for Handling File Drops ---

const extractVideoFrame = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            // Seek to 1s or 20% to avoid black frame
            video.currentTime = Math.min(1.0, video.duration * 0.2);
        };
        
        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            } else {
                reject(new Error("Canvas context failed"));
            }
        };

        video.onerror = () => reject(new Error("Video load failed"));
        video.src = URL.createObjectURL(videoFile);
    });
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 3840;
        const MAX_HEIGHT = 3840;
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
        
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};


const ProjectDetailPage: React.FC<ProjectDetailProps> = ({ projectId, initialData, onClose, onSave }) => {
  const [data, setData] = useState(initialData);
  const [content, setContent] = useState(initialData.content || "<h1>Détails du projet</h1><p>Ceci est une page de type Notion. Décrivez le contexte, les objectifs, et les résultats.</p>");
  
  // Drag & Drop States
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    const newData = { ...data, content: newContent };
    setData(newData);
    onSave(projectId, newData);
  };

  const updateField = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave(projectId, newData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files) as File[];
        const file = files[0]; // Handle single file for header
        setIsProcessing(true);

        try {
            let base64 = "";
            
            if (file.type.startsWith('video/')) {
                // Magic: Extract frame from video
                base64 = await extractVideoFrame(file);
            } else if (file.type.startsWith('image/')) {
                // Standard: Compress image
                base64 = await compressImage(file);
            }

            if (base64) {
                const newData = { ...data, image: base64 };
                setData(newData);
                onSave(projectId, newData); // This propagates to MarqueeSection via App
            }
        } catch (err) {
            console.error("Error processing file drop:", err);
            alert("Erreur lors du traitement du fichier. Assurez-vous qu'il s'agit d'une image ou d'une vidéo valide.");
        } finally {
            setIsProcessing(false);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto animate-reveal">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour
        </button>
        <div className="text-xs text-neutral-500 font-mono">
           {data.category || "Projet"} / {data.title}
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-[#00FA9A] flex items-center gap-1">
                <Save className="w-3 h-3" />
                Sauvegardé
            </span>
        </div>
      </div>

      {/* Header Image (Read Only) */}
      <div className="w-full h-[30vh] md:h-[40vh] relative">
        <img 
            src={data.image} 
            className="w-full h-full object-cover opacity-60 transition-opacity duration-300" 
            alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative -mt-32 md:-mt-40 z-10">
        
        {/* Icon / Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-[#050505] shadow-xl flex items-center justify-center mb-8 overflow-hidden relative">
             <img src={data.image} className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Editable Title */}
        <div className="mb-12">
            <EditableText 
                value={data.title} 
                onSave={(val) => updateField('title', val)} 
                className="text-4xl md:text-6xl font-bold tracking-tight text-white block mb-4 border-none hover:bg-transparent px-0"
                placeholder="Sans titre"
            />
            <div className="flex items-center gap-4 text-neutral-500">
                <EditableText 
                    value={data.category || "Catégorie"} 
                    onSave={(val) => updateField('category', val)} 
                    className="text-lg uppercase tracking-widest border-b border-white/10"
                />
            </div>
        </div>

        {/* MEDIA DROP ZONE - Before Text */}
        <div 
            className={`w-full aspect-video rounded-xl border-2 border-dashed relative overflow-hidden group transition-all duration-300 mb-12 cursor-pointer
                ${isDragOver ? 'border-[#00FA9A] bg-[#00FA9A]/10 scale-[1.01] shadow-[0_0_30px_rgba(0,250,154,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
             {isProcessing && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-[#00FA9A] animate-spin mb-2" />
                    <p className="text-[#00FA9A] text-xs font-mono uppercase tracking-widest">Traitement Média...</p>
                </div>
             )}

             <img src={data.image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition-opacity" />
             
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                 <div className={`p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 transition-transform duration-300 mb-4 ${isDragOver ? 'scale-110 ring-2 ring-[#00FA9A]' : 'group-hover:scale-110'}`}>
                    {isDragOver ? <Video className="w-8 h-8 text-[#00FA9A] animate-bounce" /> : <Upload className="w-8 h-8 text-white" />}
                 </div>
                 <h3 className={`text-lg font-bold uppercase tracking-widest mb-1 ${isDragOver ? 'text-[#00FA9A]' : 'text-white'}`}>
                    {isDragOver ? "Lâchez pour remplacer" : "Média du projet"}
                 </h3>
                 <p className="text-sm text-neutral-400 max-w-sm">
                    Glissez une <strong>image</strong> ou une <strong>vidéo</strong> ici pour mettre à jour la couverture et l'aperçu dans le portfolio.
                 </p>
             </div>
        </div>

        <div className="h-px w-full bg-white/10 mb-12"></div>

        {/* WYSIWYG Content Area */}
        <div 
            className="prose prose-invert prose-lg max-w-none focus:outline-none min-h-[30vh]"
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* CTA SECTION - STATIC & CLEAN */}
        <div className="mt-20 pt-16 border-t border-white/5 flex flex-col items-center">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FA9A] to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative">
                    <a 
                        href="https://calendly.com/clem-pred/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#00FA9A] text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,250,154,0.3)] flex items-center gap-3"
                    >
                        <span>Projet similaire ? Prendre rendez-vous</span>
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
      
      </div>
    </div>
  );
};

export default ProjectDetailPage;
