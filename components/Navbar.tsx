
import React, { useState, useEffect } from 'react';
import AxemLogo from './AxemLogo';
import { Loader2, Save, Copy, CheckCircle, Upload } from 'lucide-react';

interface NavbarProps {
  customLogo?: string | null;
  onUpdateLogo?: (newLogo: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ customLogo, onUpdateLogo }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'copied'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        if (currentScrollY > lastScrollY) {
          setIsHidden(true);
          setIsScrolledUp(false);
        } else {
          setIsHidden(false);
          setIsScrolledUp(true);
        }
      } else {
        setIsHidden(false);
        setIsScrolledUp(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (onUpdateLogo && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setIsProcessing(true);
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            onUpdateLogo(result);
            setIsProcessing(false);
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error("Logo processing failed", err);
          setIsProcessing(false);
        }
      }
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // --- THE MAGIC SAVE FUNCTION ---
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    
    // 1. Gather all data currently in LocalStorage (what you see on screen)
    const data: Record<string, any> = {};
    
    // Create a new timestamp. This is CRUCIAL. 
    // This number tells the other computer "I am a newer version".
    data['config_timestamp'] = Date.now(); 

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Filter for our app keys
      if (key && (
        key.startsWith('hero_') || 
        key.startsWith('philo_') || 
        key.startsWith('expertise_') || 
        key.startsWith('pricing_') || 
        key.startsWith('marquee_') || 
        key.startsWith('showcase_') || 
        key.startsWith('axem_')
      )) {
        const val = localStorage.getItem(key);
        try {
          data[key] = JSON.parse(val || "");
        } catch {
          data[key] = val;
        }
      }
    }
    
    // Save to local storage as well to keep the timestamp updated locally
    localStorage.setItem('config_timestamp', data['config_timestamp'].toString());

    // 2. Generate the TypeScript code string
    const fileContent = `const content = ${JSON.stringify(data, null, 2)};\n\nexport default content;`;

    // 3. Copy to Clipboard
    try {
        await navigator.clipboard.writeText(fileContent);
        setSaveStatus('copied');
        
        // 4. Instructions
        alert(
            "✅ SAUVEGARDE POUR GITHUB PRÊTE !\n\n" +
            "Les images que vous avez glissées (Drag & Drop) ont été converties en code.\n" +
            "C'est la seule méthode pour enregistrer des fichiers depuis un navigateur web sécurisé.\n\n" +
            "POUR VALIDER LES CHANGEMENTS SUR GITHUB :\n" +
            "1. Le code complet est copié dans votre presse-papiers.\n" +
            "2. Ouvrez le fichier 'src/data/defaultContent.ts' dans votre éditeur.\n" +
            "3. Remplacez tout le contenu (Ctrl+A -> Suppr -> Ctrl+V).\n" +
            "4. Faites un 'git push' pour envoyer les images sur le repo."
        );

        setTimeout(() => setSaveStatus('idle'), 5000);
    } catch (err) {
        console.error("Failed to copy", err);
        alert("Erreur lors de la copie. Vérifiez les permissions.");
        setSaveStatus('idle');
    }
  };

  return (
    <nav 
      className={`fixed z-50 flex md:px-10 transition-all duration-300 pt-8 pr-6 pb-8 pl-6 top-0 right-0 left-0 items-center justify-between
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        ${isScrolledUp ? 'bg-[#050505]/80 backdrop-blur-md py-4 border-b border-white/5' : ''}
      `}
    >
      {/* Logo Area */}
      <div 
        className={`group relative cursor-pointer transition-all duration-300 rounded-2xl p-2 -ml-2
          ${isDragOver ? 'ring-2 ring-[#00FA9A] bg-[#00FA9A]/10 scale-110 shadow-[0_0_30px_rgba(0,250,154,0.4)]' : 'hover:bg-white/5'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Glissez votre logo ici pour le changer"
      >
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded-xl">
            <Loader2 className="w-6 h-6 text-[#00FA9A] animate-spin" />
          </div>
        )}
        
        {/* Hover Overlay to indicate editability */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-2xl backdrop-blur-[2px] z-10 pointer-events-none">
            <Upload className="w-5 h-5 text-[#00FA9A]" />
        </div>

        <AxemLogo src={customLogo} className="h-10 md:h-12 w-auto relative z-0" />
      </div>

      {/* Right Column Stack */}
      <div className="flex items-center gap-8">
        <div className="hidden md:flex gap-6 items-center">
          <a href="#expertise" onClick={(e) => scrollToSection(e, 'expertise')} className="nav-link">Expertise</a>
          <a href="#qui-sommes-nous" onClick={(e) => scrollToSection(e, 'qui-sommes-nous')} className="nav-link">Qui sommes-nous</a>
          <a href="#realisations" onClick={(e) => scrollToSection(e, 'realisations')} className="nav-link">Réalisations</a>
        </div>

        {/* The Magic Copy Button */}
        <button
          onClick={handleSaveChanges}
          disabled={saveStatus !== 'idle'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,250,154,0.2)]
            ${saveStatus === 'copied' 
              ? 'bg-white text-green-600 cursor-default scale-100' 
              : 'bg-[#00FA9A] text-black hover:bg-white hover:scale-105 cursor-pointer'}
          `}
          title="Générer le code pour partager avec l'équipe"
        >
          {saveStatus === 'saving' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saveStatus === 'copied' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          
          <span className="hidden sm:inline">
            {saveStatus === 'saving' ? 'Génération...' : saveStatus === 'copied' ? 'Code Copié !' : 'Sauvegarder pour GitHub'}
          </span>
          <span className="sm:hidden">
             {saveStatus === 'copied' ? 'OK' : 'Save'}
          </span>
        </button>
      </div>
      
      <style>{`
        .nav-link {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.1em;
            color: #d4d4d4;
            text-transform: uppercase;
            cursor: pointer;
            transition: color 0.2s;
        }
        .nav-link:hover {
            color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
