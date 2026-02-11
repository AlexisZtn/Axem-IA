import React, { useState, useEffect } from 'react';
import { Upload, RotateCcw, Loader2 } from 'lucide-react';
import EditableText from './ui/EditableText';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  content?: string; // HTML content for the detail page
}

// --- Default Data with Rich Content for Detail View ---

const defaultProjectsRow1: Project[] = [
  { 
    id: 1, 
    title: 'Vidéos Avatar', 
    category: 'Production SaaS B2B', 
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    content: `
      <h1 class="text-3xl font-bold mb-2">Le Projet</h1>
      <p class="lead text-xl text-neutral-300 mb-8">Accompagner la direction des Ressources Humaines d'<strong>Orange</strong> dans la communication interne de leurs nouveaux outils digitaux.</p>
      
      <div class="bg-[#1a1a1a] p-6 rounded-xl border-l-4 border-[#FF7900] mb-8">
        <h3 class="text-[#FF7900] font-bold uppercase tracking-widest text-sm mb-2">L'enjeu</h3>
        <p class="text-neutral-300">Présenter de manière claire, rapide et engageante les nouvelles fonctionnalités de leur plateforme collaborateur.</p>
      </div>

      <hr class="border-white/10 my-8" />

      <h2 class="text-2xl font-bold mb-4">La Problématique</h2>
      <p class="mb-8">Comment produire une série de vidéos tutoriels de haute qualité, tout en respectant une charte graphique stricte, avec un budget maîtrisé et des délais de déploiement très courts ?</p>

      <h2 class="text-2xl font-bold mb-4">Notre Solution : La Production Vidéo par IA</h2>
      <p class="mb-4">Pour répondre à ce défi, nous avons mis en place un workflow de production basé sur l'Intelligence Artificielle générative, permettant une flexibilité totale :</p>
      
      <ul class="space-y-4 mb-12">
        <li class="flex gap-3">
            <span class="text-[#00FA9A] font-bold">•</span>
            <div>
                <strong class="text-white">Avatars Vidéo Réalistes :</strong> Utilisation de porte-paroles numériques animés par IA pour incarner les messages RH de manière humaine et chaleureuse sans tournage physique.
            </div>
        </li>
        <li class="flex gap-3">
            <span class="text-[#00FA9A] font-bold">•</span>
            <div>
                <strong class="text-white">Personnalisation Marque :</strong> Intégration complète de l'identité visuelle d'Orange (respect du code couleur <span style="color:#FF7900">#FF7900</span>, typographie et insertion du logo).
            </div>
        </li>
        <li class="flex gap-3">
            <span class="text-[#00FA9A] font-bold">•</span>
            <div>
                <strong class="text-white">Adaptabilité Maximale :</strong> Possibilité de mettre à jour le script ou les fonctionnalités présentées en quelques clics, sans avoir à ré-enregistrer une séquence.
            </div>
        </li>
      </ul>

      <h2 class="text-2xl font-bold mb-6">Les Bénéfices Clients</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div class="bg-white/5 p-5 rounded-lg border border-white/10 text-center">
            <div class="text-[#00FA9A] font-bold text-lg mb-2">Agilité</div>
            <p class="text-sm text-neutral-400">Production 5x plus rapide qu'un tournage classique.</p>
         </div>
         <div class="bg-white/5 p-5 rounded-lg border border-white/10 text-center">
            <div class="text-[#FF7900] font-bold text-lg mb-2">Identité</div>
            <p class="text-sm text-neutral-400">Respect rigoureux de la charte graphique Orange.</p>
         </div>
         <div class="bg-white/5 p-5 rounded-lg border border-white/10 text-center">
            <div class="text-blue-400 font-bold text-lg mb-2">Efficacité</div>
            <p class="text-sm text-neutral-400">Taux d'engagement des collaborateurs en hausse sur l'intranet.</p>
         </div>
      </div>
    `
  },
  { 
    id: 2, 
    title: 'Reels & Shorts', 
    category: 'Social Marketing', 
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop',
    content: `
      <h1>Factory Reels & Shorts</h1>
      <p class="lead">Dominez TikTok, Instagram et YouTube Shorts avec une cadence industrielle.</p>
      <hr />
      <h3>La Stratégie</h3>
      <p>L'IA découpe vos longs contenus (podcasts, webinaires) en clips viraux, ajoute des sous-titres dynamiques (style Alex Hormozi) et des B-Rolls pertinents automatiquement.</p>
      <div style="display:flex; gap:20px; margin-top:20px;">
         <div style="flex:1; background:#1a1a1a; padding:20px; border-radius:12px;">
            <h4>Input</h4>
            <p style="font-size:0.9em; color:#888;">1h de vidéo brute</p>
         </div>
         <div style="flex:1; background:#1a1a1a; padding:20px; border-radius:12px;">
            <h4>Output IA</h4>
            <p style="font-size:0.9em; color:#00FA9A;">12 Shorts viraux prêts à poster</p>
         </div>
      </div>
    `
  },
  { 
    id: 3, 
    title: 'Voix Synthétiques', 
    category: 'Podcast & Contenu', 
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    content: `
      <h1>Design Sonore & Voix IA</h1>
      <p class="lead">Donnez une voix à votre marque. Littéralement.</p>
      <hr />
      <h3>Cas d'usage</h3>
      <p>Création de podcasts internes, doublage automatique de vidéos marketing, ou assistants vocaux interactifs.</p>
      <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80" alt="Waveform" style="width:100%; border-radius:12px; margin-top:20px;" />
    `
  },
  { 
    id: 4, 
    title: 'Photos Produit HD', 
    category: 'E-commerce', 
    image: 'https://images.unsplash.com/photo-1606778302084-38538518843d?q=80&w=2670&auto=format&fit=crop',
    content: `
      <h1>Studio Photo Virtuel</h1>
      <p class="lead">Des shootings produits infinis pour 1/10ème du coût.</p>
      <hr />
      <h3>La Méthode</h3>
      <p>Nous entraînons un modèle (LoRA) sur votre produit spécifique. Ensuite, nous pouvons le placer dans n'importe quel décor, sur n'importe quel mannequin, avec n'importe quel éclairage.</p>
    `
  },
  { 
    id: 5, 
    title: 'Identité Visuelle', 
    category: 'Branding Startup', 
    image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2576&auto=format&fit=crop',
    content: `
      <h1>Identité & Charte Graphique IA</h1>
      <p class="lead">Générez une cohérence visuelle parfaite sur tous vos supports.</p>
      <hr />
      <p>Logos, palettes de couleurs, typographies et variations de brand assets générés par IA pour tester 50 directions artistiques en une après-midi.</p>
    `
  },
];

const defaultProjectsRow2: Project[] = [
  { 
    id: 6, 
    title: 'Slides Pro', 
    category: 'Consulting Business', 
    image: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=2670&auto=format&fit=crop',
    content: `
      <h1>Génération de Présentations (Decks)</h1>
      <p class="lead">Transformez un document Word en une présentation PowerPoint design en 2 minutes.</p>
      <hr />
      <h3>Livrables</h3>
      <p>Templates PowerPoint/Google Slides intelligents qui s'adaptent à votre contenu. Idéal pour les consultants et les équipes commerciales.</p>
      <img src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&q=80" alt="Slides" style="width:100%; border-radius:12px; margin-top:20px;" />
    `
  },
  { 
    id: 7, 
    title: 'Contenu SEO', 
    category: 'SaaS Marketing', 
    image: 'https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2670&auto=format&fit=crop',
    content: `
      <h1>Rédaction SEO Programmatique</h1>
      <p class="lead">Occupez la première page de Google sur des milliers de mots-clés.</p>
      <hr />
      <p>Nous connectons les données de votre marché à des modèles de langage pour générer des articles de blog experts, factuellement justes et optimisés pour le référencement.</p>
    `
  },
  { 
    id: 8, 
    title: 'Tableaux & Outils', 
    category: 'Sales Ops', 
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop',
    content: `
      <h1>Dashboards & Outils Internes</h1>
      <p class="lead">Vos données Excel transformées en applications web utilisables.</p>
      <hr />
      <p>Création d'interfaces simples pour vos équipes commerciales afin de suivre les leads, les stocks ou les projets sans casser vos formules Excel complexes.</p>
    `
  },
  { 
    id: 9, 
    title: 'Veille Structurée', 
    category: 'Competitive Intelligence', 
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    content: `
      <h1>Système de Veille Automatisé</h1>
      <p class="lead">Ne manquez plus jamais une news critique de votre secteur.</p>
      <hr />
      <p>Agents IA qui scannent le web 24/7, résument les articles pertinents, analysent les sentiments et vous envoient un digest matinal sur Slack ou par email.</p>
    `
  },
  { 
    id: 10, 
    title: 'Landing Pages', 
    category: 'SaaS Launch', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    content: `
      <h1>Générateur de Landing Pages</h1>
      <p class="lead">Testez une nouvelle offre par jour.</p>
      <hr />
      <p>Design, Copywriting et Intégration générés automatiquement pour A/B tester vos propositions de valeur à la vitesse de l'éclair.</p>
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Landing Page" style="width:100%; border-radius:12px; margin-top:20px;" />
    `
  },
];

// --- Utility: Safe Image Compression for LocalStorage ---
const compressImageSafe = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Max Quality settings: 4K limit
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
        
        // Quality 1.0 (Maximum)
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface CardProps {
  project: Project;
  onUpdateImage: (id: number, newImage: string) => void;
  onUpdateText: (id: number, field: 'title' | 'category', value: string) => void;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ project, onUpdateImage, onUpdateText, onClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      const file = files.find(f => f.type.startsWith('image/'));
      
      if (file) {
        setIsProcessing(true);
        try {
          const base64 = await compressImageSafe(file);
          onUpdateImage(project.id, base64);
        } catch (err) {
          console.error("Failed to process image", err);
          alert("Erreur lors du traitement de l'image.");
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  return (
    <div 
      className={`relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/card transition-all duration-300 bg-black ${isDragOver ? 'scale-105 ring-4 ring-[#00FA9A] z-20 shadow-2xl' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onClick}
    >
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
           <Loader2 className="w-10 h-10 text-[#00FA9A] animate-spin mb-2" />
           <p className="text-[#00FA9A] text-xs font-mono uppercase tracking-widest">Traitement...</p>
        </div>
      )}

      <img 
        src={project.image} 
        key={project.image} 
        className="w-full h-full object-cover md:object-contain bg-black transition-transform duration-700 group-hover/card:scale-105" 
        alt={project.title} 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isDragOver ? 'opacity-100' : 'opacity-0'}`}>
         <Upload className="w-12 h-12 text-[#00FA9A] mb-2 animate-bounce" />
         <p className="text-white font-bold uppercase tracking-widest text-sm">Déposer pour changer</p>
      </div>

      <div className="absolute bottom-6 left-6 z-20" onClick={(e) => e.stopPropagation()}>
        <div className="text-2xl font-bold tracking-tighter uppercase mb-1 text-white">
          <EditableText value={project.title} onSave={(val) => onUpdateText(project.id, 'title', val)} />
        </div>
        <div className="text-xs text-neutral-400 uppercase tracking-widest">
           <EditableText value={project.category} onSave={(val) => onUpdateText(project.id, 'category', val)} />
        </div>
      </div>
    </div>
  );
};

interface MarqueeSectionProps {
  onOpenProject?: (id: number, data: Project, saveCallback: (id: number | string, data: Project) => void) => void;
}

const MarqueeSection: React.FC<MarqueeSectionProps> = ({ onOpenProject }) => {
  const [row1, setRow1] = useState<Project[]>(defaultProjectsRow1);
  const [row2, setRow2] = useState<Project[]>(defaultProjectsRow2);
  const [hasCustomData, setHasCustomData] = useState(false);

  useEffect(() => {
    try {
      const savedRow1 = localStorage.getItem('axem_marquee_row1');
      const savedRow2 = localStorage.getItem('axem_marquee_row2');
      
      if (savedRow1) {
        setRow1(JSON.parse(savedRow1));
        setHasCustomData(true);
      }
      if (savedRow2) {
        setRow2(JSON.parse(savedRow2));
        setHasCustomData(true);
      }
    } catch (e) {
      console.error("Failed to load marquee data", e);
    }
  }, []);

  const saveToStorage = (r1: Project[], r2: Project[]) => {
    localStorage.setItem('axem_marquee_row1', JSON.stringify(r1));
    localStorage.setItem('axem_marquee_row2', JSON.stringify(r2));
    setHasCustomData(true);
  };

  const handleUpdateImage = (rowId: 1 | 2, projectId: number, newImage: string) => {
    const updateList = (list: Project[]) => list.map(p => p.id === projectId ? { ...p, image: newImage } : p);
    
    if (rowId === 1) {
      const newRow1 = updateList(row1);
      setRow1(newRow1);
      saveToStorage(newRow1, row2);
    } else {
      const newRow2 = updateList(row2);
      setRow2(newRow2);
      saveToStorage(row1, newRow2);
    }
  };

  const handleUpdateText = (rowId: 1 | 2, projectId: number, field: 'title' | 'category', value: string) => {
    const updateList = (list: Project[]) => list.map(p => p.id === projectId ? { ...p, [field]: value } : p);
    
    if (rowId === 1) {
      const newRow1 = updateList(row1);
      setRow1(newRow1);
      saveToStorage(newRow1, row2);
    } else {
      const newRow2 = updateList(row2);
      setRow2(newRow2);
      saveToStorage(row1, newRow2);
    }
  };

  const handleCardClick = (rowId: 1 | 2, project: Project) => {
    if (onOpenProject) {
        // We pass the full project object, including the HTML content we just added
        onOpenProject(project.id, project, (id, newData) => {
            // Callback to save changes coming from Detail Page (e.g. edited text)
            const updateList = (list: Project[]) => list.map(p => p.id === id ? { ...p, ...newData } : p);
             if (rowId === 1) {
                const newRow1 = updateList(row1);
                setRow1(newRow1);
                saveToStorage(newRow1, row2);
            } else {
                const newRow2 = updateList(row2);
                setRow2(newRow2);
                saveToStorage(row1, newRow2);
            }
        });
    }
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser les images du portfolio par défaut ?")) {
      setRow1(defaultProjectsRow1);
      setRow2(defaultProjectsRow2);
      localStorage.removeItem('axem_marquee_row1');
      localStorage.removeItem('axem_marquee_row2');
      setHasCustomData(false);
    }
  };

  return (
    <section className="z-10 overflow-hidden border-white/5 border-t pt-24 pb-24 relative" id="projects">
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
        <div>
          <p className="text-[10px] text-[#00FA9A] uppercase tracking-[0.2em] font-medium mb-2">
              <EditableText value="Portfolio" storageKey="marquee_badge" />
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
              <EditableText value="Livrables Production" storageKey="marquee_title" />
          </h2>
          <p className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FA9A] animate-pulse"></span>
            <EditableText value="Glissez une image pour mettre à jour, cliquez pour voir le détail." storageKey="marquee_subtitle" />
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
             {hasCustomData && (
                <button 
                  onClick={handleReset}
                  className="text-xs flex items-center gap-1 uppercase tracking-widest text-neutral-500 hover:text-white transition-colors pb-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
             )}
            <a href="#" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 hidden md:block">
                 <EditableText value="Voir tous les projets" storageKey="marquee_see_all" />
            </a>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden mb-8 group">
        <div className="flex gap-6 animate-marquee flex-shrink-0 px-3 min-w-full">
           {row1.map(p => <Card key={`r1-${p.id}-a`} project={p} onClick={() => handleCardClick(1, p)} onUpdateImage={(id, img) => handleUpdateImage(1, id, img)} onUpdateText={(id, f, v) => handleUpdateText(1, id, f, v)} />)}
           {row1.map(p => <Card key={`r1-${p.id}-b`} project={p} onClick={() => handleCardClick(1, p)} onUpdateImage={(id, img) => handleUpdateImage(1, id, img)} onUpdateText={(id, f, v) => handleUpdateText(1, id, f, v)} />)}
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <div className="flex gap-6 animate-marquee-reverse flex-shrink-0 px-3 min-w-full">
           {row2.map(p => <Card key={`r2-${p.id}-a`} project={p} onClick={() => handleCardClick(2, p)} onUpdateImage={(id, img) => handleUpdateImage(2, id, img)} onUpdateText={(id, f, v) => handleUpdateText(2, id, f, v)} />)}
           {row2.map(p => <Card key={`r2-${p.id}-b`} project={p} onClick={() => handleCardClick(2, p)} onUpdateImage={(id, img) => handleUpdateImage(2, id, img)} onUpdateText={(id, f, v) => handleUpdateText(2, id, f, v)} />)}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;