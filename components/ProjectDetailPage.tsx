
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Image as ImageIcon, ArrowRight, Loader2, Upload, Trash2, Play, FileVideo, FileText, MonitorPlay } from 'lucide-react';
import EditableText from './ui/EditableText';

interface ProjectDetailProps {
  projectId: string | number;
  initialData: any;
  onClose: () => void;
  onSave: (id: string | number, newData: any) => void;
}

// --- Helpers ---

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 1; // Capture frame at 1s

    video.onloadeddata = () => {
       // Wait a bit ensuring frame is ready
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Add a play icon overlay to the thumbnail
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        
        // Draw Play Icon roughly
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 20, canvas.height / 2 - 30);
        ctx.lineTo(canvas.width / 2 + 30, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 - 20, canvas.height / 2 + 30);
        ctx.fillStyle = '#00FA9A';
        ctx.fill();

        const url = canvas.toDataURL('image/jpeg', 0.8);
        resolve(url);
        URL.revokeObjectURL(video.src);
      } else {
        reject(new Error("Canvas context error"));
      }
    };
    
    video.onerror = () => reject(new Error("Video load error"));
  });
};

const generatePDFThumbnail = (): Promise<string> => {
    // Generate a simple placeholder image for PDF
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 800, 600);
            
            // Draw border
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 20;
            ctx.strokeRect(0,0,800,600);

            ctx.fillStyle = '#00FA9A';
            ctx.font = 'bold 60px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("DOCUMENT", 400, 280);
            ctx.font = 'normal 40px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("PDF INTERACTIF", 400, 350);
            
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
            resolve('');
        }
    });
};

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
  
  // Drag States
  const [isCoverDragOver, setIsCoverDragOver] = useState(false);
  const [isMediaDragOver, setIsMediaDragOver] = useState(false);
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

  // --- COVER IMAGE (Top Header) HANDLERS ---
  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsCoverDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
         setIsProcessing(true);
         try {
            const newImage = await compressImageSafe(file);
            const newData = { ...data, image: newImage };
            setData(newData);
            onSave(projectId, newData);
         } catch(err) { console.error(err); } 
         finally { setIsProcessing(false); }
      }
    }
  };

  // --- UNIVERSAL MEDIA PLAYER HANDLERS ---
  const handleMediaDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsMediaDragOver(true);
  };
  const handleMediaDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsMediaDragOver(false);
  };
  
  const handleMediaDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsMediaDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setIsProcessing(true);

      try {
        let mediaData = '';
        let mediaType = '';
        let thumbnail = '';

        // Check size limit for LocalStorage (~5MB usually)
        const isTooBig = file.size > 4.5 * 1024 * 1024;
        
        if (isTooBig) {
             alert("Fichier volumineux (>4.5Mo). Il sera visible pour cette session mais risque de ne pas être sauvegardé définitivement dans le navigateur.");
             mediaData = URL.createObjectURL(file);
        } else {
             mediaData = await fileToBase64(file);
        }

        if (file.type.startsWith('video/')) {
            mediaType = 'video';
            thumbnail = await generateVideoThumbnail(file);
        } else if (file.type.startsWith('image/')) {
            mediaType = 'image';
            thumbnail = await compressImageSafe(file);
            // If dragging image to media player, use same image for data
            mediaData = thumbnail; 
        } else if (file.type === 'application/pdf') {
            mediaType = 'pdf';
            thumbnail = await generatePDFThumbnail();
        } else {
            alert("Format non supporté. Utilisez Vidéo, Image ou PDF.");
            setIsProcessing(false);
            return;
        }

        const newData = { 
            ...data, 
            mediaType: mediaType,
            mediaData: mediaData,
            image: thumbnail // SYNC: This updates the marquee image automatically
        };
        
        setData(newData);
        
        // Save to persistent storage if size permits
        if (!isTooBig) {
            onSave(projectId, newData);
        } else {
            // If too big, we still save the thumbnail (image) so the homepage looks good
            onSave(projectId, { ...data, image: thumbnail });
        }

      } catch (err) {
         console.error(err);
         alert("Erreur lors du traitement du fichier.");
      } finally {
         setIsProcessing(false);
      }
    }
  };

  const clearMedia = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newData = { ...data, mediaData: undefined, mediaType: undefined };
      setData(newData);
      onSave(projectId, newData);
  };

  const renderMediaPlayer = () => {
      if (!data.mediaData) return null;

      switch(data.mediaType) {
          case 'video':
              return (
                <video 
                    src={data.mediaData} 
                    className="w-full h-full object-cover" 
                    controls 
                    playsInline
                    autoPlay
                    loop
                    muted
                />
              );
          case 'image':
              return (
                <img 
                    src={data.mediaData} 
                    className="w-full h-full object-contain bg-black" 
                    alt="Media content"
                />
              );
          case 'pdf':
              return (
                <iframe 
                    src={data.mediaData} 
                    className="w-full h-[600px] bg-white"
                    title="PDF Viewer"
                />
              );
          default:
              return null;
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

      {/* HEADER: Cover Image (Visual Only) */}
      <div 
         className="w-full h-[30vh] md:h-[40vh] relative group cursor-pointer bg-black"
         onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsCoverDragOver(true); }}
         onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsCoverDragOver(false); }}
         onDrop={handleCoverDrop}
      >
        <div className={`absolute inset-0 bg-black/60 z-40 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isCoverDragOver ? 'opacity-100' : 'opacity-0'}`}>
            <ImageIcon className="w-12 h-12 text-[#00FA9A] mb-4 animate-bounce" />
            <p className="text-white font-bold uppercase tracking-widest text-lg">Changer la bannière</p>
        </div>

        <img 
            src={data.image} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" 
            alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 pb-20 relative -mt-32 z-10">
        
        {/* Icon / Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-[#050505] shadow-xl flex items-center justify-center mb-8 overflow-hidden relative z-20">
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

        {/* --- UNIVERSAL MEDIA PLAYER SECTION (Drop Zone) --- */}
        <div className="mb-12">
            {isProcessing && (
                <div className="w-full h-48 flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-black/50 mb-4">
                    <Loader2 className="w-8 h-8 text-[#00FA9A] animate-spin mb-2" />
                    <p className="text-[#00FA9A] text-xs uppercase tracking-widest">Traitement & Sauvegarde...</p>
                </div>
            )}

            {data.mediaData ? (
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl group/media">
                    
                    {renderMediaPlayer()}

                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/media:opacity-100 transition-opacity z-30">
                        <button 
                            onClick={clearMedia}
                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-colors"
                            title="Supprimer le média"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer
                        ${isMediaDragOver ? 'border-[#00FA9A] bg-[#00FA9A]/10 scale-[1.02]' : 'border-white/10 hover:border-white/20 bg-white/5'}
                    `}
                    onDragOver={handleMediaDragOver}
                    onDragLeave={handleMediaDragLeave}
                    onDrop={handleMediaDrop}
                >
                    <div className="flex gap-4 mb-4 pointer-events-none">
                        <div className="p-3 rounded-full bg-black/40"><FileVideo className="w-6 h-6 text-neutral-400" /></div>
                        <div className="p-3 rounded-full bg-black/40"><ImageIcon className="w-6 h-6 text-neutral-400" /></div>
                        <div className="p-3 rounded-full bg-black/40"><FileText className="w-6 h-6 text-neutral-400" /></div>
                    </div>
                    <p className={`text-lg font-medium ${isMediaDragOver ? 'text-[#00FA9A]' : 'text-neutral-200'}`}>
                        Déposer un média ici
                    </p>
                    <p className="text-sm text-neutral-500 mt-2">MP4, JPG, PNG ou PDF</p>
                    <p className="text-xs text-neutral-600 mt-4 max-w-md text-center">
                        Le fichier sera sauvegardé et une miniature sera automatiquement synchronisée sur la page d'accueil.
                    </p>
                </div>
            )}
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

        {/* CTA SECTION */}
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
