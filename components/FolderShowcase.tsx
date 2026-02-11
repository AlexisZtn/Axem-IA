import React, { useState, useEffect } from 'react';
import { AnimatedFolder, Project } from './ui/3d-folder';
import { RotateCcw } from 'lucide-react';
import EditableText from './ui/EditableText';

// --- Default Data Definition with Specific Case Studies ---

const caseStudiesData = [
  {
    title: "Formation IA Marketing",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    projects: [
      { 
        id: "case1", 
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", 
        title: "Formation Équipe Marketing",
        category: "Formation",
        content: `
          <h1>Formation IA pour une équipe Marketing</h1>
          <p class="text-xl text-neutral-400 mb-8">Comment une équipe de 10 personnes a divisé son temps de production par 3.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Contexte</h3>
                <p class="text-sm text-neutral-300">Équipe débordée, création de contenu lente et processus créatifs freinés par des tâches répétitives.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Atelier 2 jours, création de bibliothèques de prompts templates, et automatisation de la génération de visuels.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">+300% de contenu produit sans recrutement supplémentaire. Adoption totale des outils par l'équipe.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "Connexion ERP & Legacy",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    projects: [
      { 
        id: "case2", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", 
        title: "Automatisation AS400",
        category: "Automatisation & Legacy",
        content: `
          <h1>Connexion ERP Historique & E-commerce</h1>
          <p class="text-xl text-neutral-400 mb-8">Fin de la double saisie manuelle entre un vieil AS400 et Shopify.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Contexte</h3>
                <p class="text-sm text-neutral-300">Un grossiste industriel perdait 15h/semaine à recopier des commandes de son site web vers son vieux logiciel de gestion (AS400). Erreurs de stock fréquentes.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Mise en place d'un tunnel sécurisé via n8n. L'IA lit la commande web, la reformate pour l'AS400 et l'injecte sans intervention humaine.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">0 erreur de saisie, gain de 60h/mois, stocks à jour en temps réel.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "Stratégie Commerciale",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    projects: [
      { 
        id: "case3_2", 
        image: "https://images.unsplash.com/photo-1570172619380-2126adbc894c?auto=format&fit=crop&q=80&w=800", 
        title: "Clinique Expert : Scale local",
        category: "Audit & Stratégie",
        content: `
          <h1>Stratégie & Marketing : Objectif "Clinique Expert"</h1>
          <p class="text-xl text-neutral-400 mb-8">Transformation d'un business esthétique local prometteur en une marque digitale structurée prête pour l'hyper-croissance.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Contexte</h3>
                <p class="text-sm text-neutral-300">Gestion "artisanale" (WhatsApp/Cash). Business prometteur (~14k€ CA 2025) mais freiné par des processus manuels et un marketing basé uniquement sur le bouche-à-oreille.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Audit & Benchmark, "Menu Engineering" (Protocoles Signature), Rebranding Premium et mise en place d'un écosystème technique de réservation/paiement automatisé.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Sortie de l'artisanat vers un modèle "Clinique Expert". Socle technique prêt pour le scale, l'ouverture d'un cabinet physique et l'internationalisation.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case3", 
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", 
        title: "Restructuration Process",
        category: "Audit & Stratégie",
        content: `
          <h1>Restructuration Process Commercial PME</h1>
          <p class="text-xl text-neutral-400 mb-8">De la perte de leads à un taux de conversion record.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Contexte</h3>
                <p class="text-sm text-neutral-300">Une agence immo recevait trop de leads mais ne les traitait pas assez vite. Pas de CRM structuré, suivi sur Excel chaotique.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Audit des flux. Implémentation d'un CRM léger + IA de qualification. L'IA répond instantanément aux leads, qualifie le besoin et booke le RDV pour l'humain.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">+40% de CA en 3 mois, équipes commerciales concentrées uniquement sur les RDV qualifiés.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "Agent IA Support",
    gradient: "linear-gradient(135deg, #f80759, #bc4e9c)",
    projects: [
      { 
        id: "case4", 
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800", 
        title: "Support Client Autonome",
        category: "Solutions IA",
        content: `
          <h1>Agent IA de Support Client Autonome</h1>
          <p class="text-xl text-neutral-400 mb-8">Support client 24/7 sans augmenter l'effectif.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Contexte</h3>
                <p class="text-sm text-neutral-300">Service client saturé par des questions récurrentes (suivi colis, facture). Temps de réponse > 48h.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Création d'un Agent IA entraîné sur la base de connaissances de l'entreprise. Il gère 80% des tickets niveau 1 et escalade les cas complexes aux humains.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Réponse immédiate 24/7, satisfaction client en hausse, équipe support soulagée.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  }
];

interface FolderShowcaseProps {
  onOpenProject?: (id: number | string, data: Project, saveCallback: (id: number | string, data: Project) => void) => void;
}

const FolderShowcase: React.FC<FolderShowcaseProps> = ({ onOpenProject }) => {
  // State for data
  const [data, setData] = useState(caseStudiesData);
  const [hasCustomData, setHasCustomData] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCases = localStorage.getItem('axem_cases_data');
      if (storedCases) {
        setData(JSON.parse(storedCases));
        setHasCustomData(true);
      }
    } catch (e) {
      console.error("Failed to load data from storage", e);
    }
  }, []);

  const saveData = (newData: any) => {
    setData(newData);
    localStorage.setItem('axem_cases_data', JSON.stringify(newData));
    setHasCustomData(true);
  };

  const updateFolderContents = (folderIndex: number, newImages: string[]) => {
    const newData = [...data];
    const targetFolder = { ...newData[folderIndex] };
    const targetProjects = [...targetFolder.projects];

    if (targetProjects.length > 0) {
        targetProjects[0] = {
            ...targetProjects[0],
            image: newImages[0],
            gallery: newImages
        };
    } else {
         targetProjects.push({
            id: `case-${folderIndex}-new`,
            title: "Nouveau Cas",
            image: newImages[0],
            gallery: newImages
         });
    }

    targetFolder.projects = targetProjects;
    newData[folderIndex] = targetFolder;
    saveData(newData);
  };

  const handleTitleUpdate = (folderIndex: number, newTitle: string) => {
    const newData = [...data];
    newData[folderIndex] = { ...newData[folderIndex], title: newTitle };
    saveData(newData);
  };

  const handleOpenDetail = (folderIndex: number, projectIndex: number) => {
    const project = data[folderIndex].projects[projectIndex];
    
    if (onOpenProject) {
        onOpenProject(project.id, project, (id, newDataFromDetail) => {
            const currentData = [...data];
            const projects = [...currentData[folderIndex].projects];
            projects[projectIndex] = { ...projects[projectIndex], ...newDataFromDetail };
            currentData[folderIndex] = { ...currentData[folderIndex], projects };
            saveData(currentData);
        });
    }
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous réinitialiser les études de cas ?")) {
        localStorage.removeItem('axem_cases_data');
        setData(caseStudiesData);
        setHasCustomData(false);
    }
  };

  return (
    <section id="realisations" className="bg-background relative z-10 py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <span className="inline-block px-3 py-1 mb-6 text-[10px] tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5 uppercase">
            <EditableText value="Réalisations" storageKey="showcase_badge" />
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
          <EditableText value="Nos" storageKey="showcase_title_1" /> <span className="font-playfair italic text-neutral-400"><EditableText value="Études de Cas" storageKey="showcase_title_2" /></span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
          <EditableText value="Découvrez comment nous avons transformé les processus de nos clients." storageKey="showcase_desc" />
          <br/><span className="text-xs text-neutral-600"><EditableText value="Cliquez sur un dossier pour voir les détails." storageKey="showcase_hint" /></span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {data.map((folder, folderIdx) => (
            <div key={`case-${folderIdx}`} className="w-full md:w-[calc(50%-32px)] lg:w-[calc(25%-48px)] flex justify-center">
                <AnimatedFolder 
                    title={folder.title} 
                    projects={folder.projects} 
                    gradient={folder.gradient}
                    className="w-full max-w-[300px]"
                    onFolderUpdate={(imgs) => updateFolderContents(folderIdx, imgs)}
                    onTitleUpdate={(t) => handleTitleUpdate(folderIdx, t)}
                    onOpenDetail={(pIdx) => handleOpenDetail(folderIdx, pIdx)}
                />
            </div>
            ))}
        </div>

        {hasCustomData && (
            <div className="flex justify-center pt-16">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Réinitialiser les cas
                </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default FolderShowcase;