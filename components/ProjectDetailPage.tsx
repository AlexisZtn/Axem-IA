
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Image as ImageIcon, ArrowRight, Loader2, Upload, Trash2, Play } from 'lucide-react';
import EditableText from './ui/EditableText';

interface ProjectDetailProps {
  projectId: string | number;
  initialData: any;
  onClose: () => void;
  onSave: (id: string | number, newData: any) => void;
}

// --- Helper: Read File as Base64 ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// --- Video Thumbnail Generator ---
const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
       // Seek to 1s or middle to capture a meaningful frame
       video.currentTime = Math.min(1.0, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL('image/jpeg', 0.9);
        resolve(url);
        URL.revokeObjectURL(video.src);
      } else {
        reject(new Error("Canvas context error"));
      }
    };
    
    video.onerror = () => {
       reject(new Error("Video load error"));
    };
  });
};

// --- Safe Image Compression ---
const compressImageSafe = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
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
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const ProjectDetailPage: React.FC<ProjectDetailProps> = ({ projectId, initialData, onClose, onSave }) => {
  const [data, setData] = useState(initialData);
  const [content, setContent] = useState(initialData.content || "<h1>Détails du projet</h1><p>Ceci est une page de type Notion. Décrivez le contexte, les objectifs, et les résultats.</p>");
  
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
      const file = e.dataTransfer.files[0];
      setIsProcessing(true);
      
      try {
        if (file.type.startsWith('video/')) {
           // --- VIDEO HANDLING ---
           // 1. Generate Thumbnail for the Marquee/Card view
           const thumbnail = await generateVideoThumbnail(file);
           
           // 2. Handle Video Data
           let videoData = '';
           // LocalStorage has a limit (~5MB). We warn if it's too big but allow temporary preview.
           if (file.size < 4.5 * 1024 * 1024) { 
               videoData = await fileToBase64(file);
           } else {
               alert("Vidéo volumineuse (>4.5Mo). Elle sera affichée temporairement mais ne pourra pas être sauvegardée définitivement dans le navigateur.");
               videoData = URL.createObjectURL(file); 
           }

           const newData = { ...data, image: thumbnail, video: videoData };
           setData(newData);

           // Only save to persistent storage if it's base64 data (small enough)
           if (videoData.startsWith('data:')) {
               onSave(projectId, newData);
           } else {
               // Save only thumbnail to persistent storage if video is too big (blob url)
               // The user keeps the video in current session though.
               onSave(projectId, { ...data, image: thumbnail });
           }

        } else if (file.type.startsWith('image/')) {
           // --- IMAGE HANDLING ---
           const newImage = await compressImageSafe(file);
           // If we upload an image, we clear any existing video
           const newData = { ...data, image: newImage, video: undefined };
           setData(newData);
           onSave(projectId, newData);
        }
      } catch (err) {
        console.error("Drop failed", err);
        alert("Erreur lors du traitement du fichier.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearVideo = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newData = { ...data, video: undefined };
      setData(newData);
      onSave(projectId, newData);
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

      {/* Header Image/Video (Drop Zone) */}
      <div 
         className="w-full h-[30vh] md:h-[40vh] relative group cursor-pointer bg-black"
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop}
      >
        {isProcessing && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-[#00FA9A] animate-spin mb-2" />
                <p className="text-[#00FA9A] text-xs font-mono uppercase tracking-widest">Traitement...</p>
            </div>
        )}
        
        <div className={`absolute inset-0 bg-black/60 z-40 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isDragOver ? 'opacity-100' : 'opacity-0'}`}>
            <Upload className="w-12 h-12 text-[#00FA9A] mb-4 animate-bounce" />
            <p className="text-white font-bold uppercase tracking-widest text-lg">Déposez votre Vidéo ou Image</p>
            <p className="text-neutral-400 text-sm mt-2">MP4, WebM ou JPG/PNG</p>
        </div>

        {/* Video Player or Image */}
        {data.video ? (
            <div className="w-full h-full relative group/video">
                <video 
                    src={data.video} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    controls
                />
                <button 
                    onClick={clearVideo}
                    className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover/video:opacity-100 transition-opacity z-30"
                    title="Supprimer la vidéo"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <>
                <img 
                    src={data.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none"></div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white/70 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2">
                    <Play className="w-3 h-3 fill-current" />
                    Glissez une vidéo pour remplacer
                </div>
            </>
        )}
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative -mt-12 md:-mt-20 z-10">
        
        {/* Icon / Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-[#050505] shadow-xl flex items-center justify-center mb-8 overflow-hidden relative z-20">
             <img src={data.image} className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Editable Title */}
        <div className="mb-8">
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
