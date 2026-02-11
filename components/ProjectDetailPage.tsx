
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Image as ImageIcon, ArrowRight } from 'lucide-react';
import EditableText from './ui/EditableText';

interface ProjectDetailProps {
  projectId: string | number;
  initialData: any;
  onClose: () => void;
  onSave: (id: string | number, newData: any) => void;
}

const ProjectDetailPage: React.FC<ProjectDetailProps> = ({ projectId, initialData, onClose, onSave }) => {
  const [data, setData] = useState(initialData);
  const [content, setContent] = useState(initialData.content || "<h1>Détails du projet</h1><p>Ceci est une page de type Notion. Décrivez le contexte, les objectifs, et les résultats.</p>");

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

      {/* Header Image */}
      <div className="w-full h-[30vh] md:h-[40vh] relative group">
        <img 
            src={data.image} 
            className="w-full h-full object-cover" 
            alt="Cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative -mt-12 md:-mt-20 z-10">
        
        {/* Icon / Avatar */}
        <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-[#050505] shadow-xl flex items-center justify-center mb-8 overflow-hidden">
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
