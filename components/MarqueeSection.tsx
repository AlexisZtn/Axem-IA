import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import EditableText from './ui/EditableText';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  gallery?: string[];
  content?: string; // HTML content for the detail page
}

// --- Default Data with Rich Content for Detail View ---

const defaultProjectsRow1: Project[] = [
  { 
    id: 1, 
    title: 'Vidéos Avatar', 
    category: 'Production SaaS B2B', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Avatar%20IA%20heygen.png?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Avatar%20IA%20heygen.png?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/dca30ed01b094720e8af05a490a200b356bdb87d/Images/video%20avatar%20Orange%20RH.mp4?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/dca30ed01b094720e8af05a490a200b356bdb87d/Images/cr%C3%A9er%20votre%20avatar.jpeg?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Vidéo IA & Avatars : Communication Digitale Agile</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous transformons vos communications complexes en capsules vidéo impactantes grâce à la technologie des avatars hyper-réalistes. Plus besoin de matériel de tournage, de studio ou de casting : votre porte-parole numérique est prêt en quelques clics.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Avatars Vidéo Réalistes</strong>
                    <span class="text-neutral-300">Nous générons des présentateurs humains animés par IA qui incarnent vos messages de manière chaleureuse et professionnelle, éliminant les contraintes de tournage physique.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Personnalisation Identitaire</strong>
                    <span class="text-neutral-300">Chaque vidéo est conçue sur mesure pour refléter votre ADN (intégration de votre logo, respect de vos codes couleurs et de votre typographie).</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Agilité Editoriale</strong>
                    <span class="text-neutral-300">Vous changez de script ? Nous mettons à jour la vidéo instantanément. Cette flexibilité permet une réactivité totale pour vos tutoriels ou vos annonces internes.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Business</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Formation & Onboarding</h3>
            <p class="text-neutral-300">Transformez vos documents PDF en tutoriels vidéo dynamiques pour former vos nouveaux collaborateurs de manière engageante.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Communication Interne</h3>
            <p class="text-neutral-300">Présentez vos nouveaux outils digitaux ou vos actualités RH via des messages vidéo personnalisés et faciles à consommer.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Support Client & FAQ</h3>
            <p class="text-neutral-300">Créez une bibliothèque de réponses vidéo pour guider vos utilisateurs pas à pas dans l'utilisation de vos services.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Les Bénéfices</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Vitesse de Production</div>
            <p class="text-sm text-neutral-400">Un déploiement 5x plus rapide qu’une production vidéo classique.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Identité Maîtrisée</div>
            <p class="text-sm text-neutral-400">Une cohérence graphique absolue sur l'ensemble de vos contenus.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Engagement Boosté</div>
            <p class="text-sm text-neutral-400">Un format vidéo qui génère un taux de mémorisation et d'adhésion bien supérieur au texte simple.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Nous industrialisons votre production vidéo pour vous permettre de communiquer plus souvent, plus vite et avec un impact maximal."</p>
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
    category: 'Automatisation & Relation Client', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/f910bd10a749e053c7a1a513df12d5209365106d/Images/Voix%20Synthe%CC%81tique.png?raw=true',
    content: `
      <h1 class="text-3xl font-bold mb-8">Design Sonore & Voix IA : Automatisation & Relation Client</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous transformons votre relation client en créant des agents vocaux intelligents et des interfaces sonores sur mesure. L'objectif : automatiser les tâches répétitives tout en offrant une expérience fluide, humaine et disponible 24h/24.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Conception d'Agents Conversationnels</strong>
                    <span class="text-neutral-300">Nous créons des voix IA capables de comprendre et de répondre aux requêtes complexes (suivi de commande, gestion de SAV, prise de rendez-vous).</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Identité Vocale Signature</strong>
                    <span class="text-neutral-300">Finies les voix robotiques impersonnelles. Nous développons une voix spécifique à votre entreprise, chaleureuse et professionnelle, qui rassure vos clients.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Intégration Systèmes</strong>
                    <span class="text-neutral-300">Nos voix IA se connectent à vos outils (CRM, bases de données) pour fournir des réponses précises et personnalisées en temps réel.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Business</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Gestion des Commandes & SAV</h3>
            <p class="text-neutral-300">Automatisation du traitement des appels pour le suivi de colis, les demandes de remboursement ou la modification de commandes, sans attente pour le client.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Standard Vocal Intelligent (IVR)</h3>
            <p class="text-neutral-300">Orientation précise des clients vers le bon service grâce à une compréhension naturelle du langage, remplaçant les menus numériques fastidieux ("Tapez 1...").</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Assistance Proactive</h3>
            <p class="text-neutral-300">Rappels de rendez-vous, confirmations de paiement ou alertes de livraison via des appels automatisés ultra-réalistes.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Pourquoi intégrer la Voix IA ?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Disponibilité Totale</div>
            <p class="text-sm text-neutral-400">Un service client performant 24h/7j, capable de gérer des centaines d'appels simultanés.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Réduction Coûts</div>
            <p class="text-sm text-neutral-400">Désengorgez vos équipes humaines des demandes à faible valeur ajoutée.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Expérience Premium</div>
            <p class="text-sm text-neutral-400">Une réponse instantanée avec une voix fluide qui renforce la confiance.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Nous ne créons pas seulement une voix, nous bâtissons un collaborateur virtuel capable de gérer vos opérations de front-office avec une efficacité inégalée."</p>
      </div>
    `
  },
  { 
    id: 4, 
    title: 'Studio Photo Virtuel', 
    category: 'E-commerce', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/b7f9ed78093123481320a0495bf708c7d1bd8381/components/photo%20ia%20produit%20parfum.jpg?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/b7f9ed78093123481320a0495bf708c7d1bd8381/components/photo%20ia%20produit%20parfum.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/1d4d567d3e8c0ed244636560c43e6a697a3040c7/components/photo%20ia%20produit%20montre.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/946937bfb4bc79260f7cfb24563078d7e87a96a6/components/photo%20produit%20cosm%C3%A9tique.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/666848800fd3ebd6e4696cc10eb8d1d7f31dd2c5/components/photo%20produit%20chassure.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/f910bd10a749e053c7a1a513df12d5209365106d/Images/Photo%20Produit%20Bougie.png?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/f910bd10a749e053c7a1a513df12d5209365106d/Images/Photo%20Produit%20Burger.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/f910bd10a749e053c7a1a513df12d5209365106d/Images/Photo%20produit%20Poulet.jpg?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Studio Photo Virtuel</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous remplaçons les séances photo complexes et coûteuses par un Studio Virtuel ultra-réaliste. Plus besoin d'envoyer vos produits à l'autre bout du monde ou de louer un studio : nous créons vos visuels marketing directement via l'Intelligence Artificielle.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Entraînement de précision (LoRA)</strong>
                    <span class="text-neutral-300">Nous "apprenons" à notre IA chaque détail de votre flacon (forme, étiquette, texture du verre). Cela garantit que votre produit est parfaitement reconnaissable et identique sur chaque image.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Shooting Illimité</strong>
                    <span class="text-neutral-300">Une fois le modèle entraîné, nous pouvons placer votre produit dans n'importe quel décor (nature, intérieur design, studio épuré) avec n'importe quel type d'éclairage.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Mise en situation humaine</strong>
                    <span class="text-neutral-300">Nous intégrons votre produit entre les mains de mannequins virtuels créés sur mesure pour correspondre à votre cible, sans frais de casting ni de droits à l'image.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Pourquoi choisir le Virtuel ?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Coûts réduits</div>
            <p class="text-sm text-neutral-400">Divisez votre budget de production par 10.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Rapidité</div>
            <p class="text-sm text-neutral-400">Obtenez des dizaines de visuels HD en quelques jours seulement.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Liberté Créative</div>
            <p class="text-sm text-neutral-400">Changez d'ambiance, de saison ou de décor en un clic.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Vous nous confiez votre produit, nous vous livrons des shootings complets, variés et professionnels, prêts à l'emploi pour votre site web et vos réseaux sociaux."</p>
      </div>
    `
  },
  { 
    id: 5, 
    title: 'Identité Visuelle', 
    category: 'Branding Startup', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/d174f0079c35272e3029e0aae7b9009392bba60b/Images/Photo%20logo.jpg?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/d174f0079c35272e3029e0aae7b9009392bba60b/Images/Photo%20logo.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/d174f0079c35272e3029e0aae7b9009392bba60b/Images/Photo%20logo%20Pirla.webp?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/d174f0079c35272e3029e0aae7b9009392bba60b/Images/Photo%20logo%20nutrivel.webp?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/d174f0079c35272e3029e0aae7b9009392bba60b/Images/photo%20logo%20aura.jpg?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Branding Startup : Identité & Charte Graphique IA</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous propulsons l'identité visuelle des startups en combinant créativité stratégique et puissance de l'IA. Finis les allers-retours interminables : nous générons une cohérence visuelle complète et professionnelle en un temps record.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Exploration Créative Accélérée</strong>
                    <span class="text-neutral-300">Grâce à nos modèles d'IA, nous explorons jusqu'à 50 directions artistiques en une seule après-midi. Cela vous permet de visualiser immédiatement le potentiel de votre marque sous différents angles.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Système de Marque Intelligent</strong>
                    <span class="text-neutral-300">Nous ne créons pas juste un logo. Nous générons un écosystème complet : palettes de couleurs harmonieuses, typographies complémentaires et assets graphiques déclinables.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Brand Assets Prêts à l'Emploi</strong>
                    <span class="text-neutral-300">Nous produisons instantanément toutes les variations nécessaires (favicon, bannières réseaux sociaux, mockups) pour garantir une image unifiée sur tous vos supports.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Startup</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Lancement de MVP</h3>
            <p class="text-neutral-300">Obtenez une identité visuelle crédible et "investor-ready" en quelques jours pour lancer votre produit sur le marché.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Pivot & Rebranding</h3>
            <p class="text-neutral-300">Testez une nouvelle image de marque sans engager des mois de travail, afin de valider l'adhésion de votre nouvelle cible.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Campagnes Marketing Flash</h3>
            <p class="text-neutral-300">Générez des déclinaisons graphiques spécifiques pour des landing pages ou des publicités sociales tout en restant fidèle à votre charte.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Les Avantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Vitesse Inégalée</div>
            <p class="text-sm text-neutral-400">Passez de l'idée au kit de marque complet en un temps record.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Précision Chirurgicale</div>
            <p class="text-sm text-neutral-400">Une cohérence parfaite entre votre logo, votre site web et vos supports de communication.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Liberté de Choix</div>
            <p class="text-sm text-neutral-400">Ne vous limitez pas à 3 propositions ; explorez un champ de possibilités infini avant de choisir la direction finale.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Nous donnons aux startups les outils visuels des plus grands groupes, avec l'agilité et le coût d'une structure légère."</p>
      </div>
    `
  },
];

const defaultProjectsRow2: Project[] = [
  { 
    id: 6, 
    title: 'Conception de Slides & Présentations Pro', 
    category: 'Impact visuel et narration stratégique assistée par IA', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Slides%20deck%201.jpg?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Slides%20deck%201.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Slides%20deck%202.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Slides%20deck%203.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/3d55609ae97219c0b684ec60f7ab91c353cb542f/Images/Slides%20deck%204.jpg?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Conception de Slides & Présentations Pro</h1>

      <div class="mb-12">
        <p class="text-lg text-neutral-300">Nous transformons vos données et vos idées en présentations percutantes qui captivent votre audience. Que ce soit pour un pitch investisseur, une conférence ou un rapport interne, nous utilisons l'IA pour générer des slides au design d'agence en un temps record.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Structuration Narrative (Storytelling)</strong>
                    <span class="text-neutral-300">Nous utilisons l'IA pour organiser vos idées de manière logique et persuasive, créant un fil conducteur qui maintient l'attention du début à la fin.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Design & Infographies Sur Mesure</strong>
                    <span class="text-neutral-300">Finis les thèmes PowerPoint par défaut. Nous générons des visuels, des schémas complexes et des illustrations uniques qui renforcent votre message et respectent votre charte graphique.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Mise en Page Intelligente</strong>
                    <span class="text-neutral-300">Nous automatisons l'alignement, la hiérarchie visuelle et l'équilibre des slides pour un rendu professionnel, épuré et moderne.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Business</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Pitch Decks Startup</h3>
            <p class="text-neutral-300">Créez des présentations "investor-ready" avec des visuels qui valorisent votre vision et des graphiques clairs pour vos metrics.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Keynotes & Conférences</h3>
            <p class="text-neutral-300">Concevez des supports de scène immersifs et visuels, conçus pour soutenir votre discours sans le surcharger.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Rapports Stratégiques & Boards</h3>
            <p class="text-neutral-300">Transformez vos données brutes et vos analyses complexes en tableaux de bord visuels digestes et élégants pour vos réunions de direction.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Les Avantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Gain de Temps Radical</div>
            <p class="text-sm text-neutral-400">Passez du brouillon à la présentation finale 5x plus vite qu'avec une méthode traditionnelle.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Cohérence Esthétique</div>
            <p class="text-sm text-neutral-400">Une unité visuelle parfaite sur 10, 50 ou 100 slides, garantissant le sérieux de votre marque.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Flexibilité Totale</div>
            <p class="text-sm text-neutral-400">Livrées dans vos formats habituels (PowerPoint, Keynote, Google Slides), vos présentations restent 100% modifiables.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Nous donnons à vos idées le support qu'elles méritent : des présentations claires, mémorables et visuellement irréprochables, conçues pour convaincre."</p>
      </div>
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
    title: 'Automatisation IA', 
    category: 'Connectez vos outils, libérez votre temps', 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/59e16b35d50ffa26289fc087d95172a0d64763c0/Images/Workflow%20Make.jpg?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/59e16b35d50ffa26289fc087d95172a0d64763c0/Images/Workflow%20Make.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/59e16b35d50ffa26289fc087d95172a0d64763c0/Images/Workflow%20N8N%202.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/59e16b35d50ffa26289fc087d95172a0d64763c0/Images/Workflow%20N8N.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/59e16b35d50ffa26289fc087d95172a0d64763c0/Images/Workflow%20Zapier.jpg?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Automatisation IA : Connectez vos outils, libérez votre temps</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous concevons des ponts intelligents entre tous vos logiciels pour éliminer les tâches manuelles répétitives. Que vos outils soient de dernière génération (SaaS) ou des systèmes "Legacy" plus anciens, nous automatisons vos flux de travail de bout en bout.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Agnosticisme Technologique</strong>
                    <span class="text-neutral-300">Nous maîtrisons les meilleurs outils d'orchestration du marché (n8n, Make) pour créer des automatisations sur mesure, stables et évolutives.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Compatibilité Totale (Modern & Legacy)</strong>
                    <span class="text-neutral-300">Nous ne nous limitons pas aux API modernes. Nous sommes capables de faire communiquer vos outils récents avec vos anciens systèmes (ex: ERP sous WinDev, vieux logiciels propriétaires) pour qu'aucune donnée ne reste isolée.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">IA Opérationnelle</strong>
                    <span class="text-neutral-300">Nous intégrons des couches d'Intelligence Artificielle au cœur de vos processus pour trier des emails, extraire des données de factures, ou qualifier automatiquement des leads dans votre CRM.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Business</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Synchronisation CRM & ERP</h3>
            <p class="text-neutral-300">Automatisez la création de factures et la mise à jour des stocks dès qu'une vente est conclue, sans aucune saisie manuelle.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Traitement de Données Multi-Sources</h3>
            <p class="text-neutral-300">Centralisez les informations provenant de formulaires web, de fichiers Excel et de vieux logiciels internes vers un tableau de bord unique.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">SAV & Support Automatisé</h3>
            <p class="text-neutral-300">Analyse automatique de l'urgence des tickets, résumé des demandes par l'IA et routage vers le bon interlocuteur dans vos outils de gestion.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Les Avantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Zéro Saisie Manuelle</div>
            <p class="text-sm text-neutral-400">Réduisez le risque d'erreur humaine et libérez vos équipes pour des tâches à haute valeur ajoutée.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Rentabilisation de l'Existant</div>
            <p class="text-sm text-neutral-400">Donnez une seconde jeunesse à vos anciens logiciels en les connectant aux technologies de demain.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Scalabilité</div>
            <p class="text-sm text-neutral-400">Gérez une augmentation de volume d'activité sans avoir à recruter pour des tâches administratives.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Peu importe votre stack technique, nous créons un écosystème fluide où vos données circulent librement et intelligemment."</p>
      </div>
    `
  },
  { 
    id: 10, 
    title: 'Landing Pages Haute Conversion', 
    category: "De l'idée au Live en 24h", 
    image: 'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%201.jpg?raw=true',
    gallery: [
      'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%201.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%202.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%203.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%204.jpg?raw=true',
      'https://github.com/AlexisZtn/Axem-IA/blob/761975549b573abc9141b2d50c7434c92b2beb64/Images/Landing%20Page%20MP4.mp4?raw=true'
    ],
    content: `
      <h1 class="text-3xl font-bold mb-8">Landing Pages Haute Conversion : De l'idée au Live en 24h</h1>

      <div class="mb-12">
        <h2 class="text-2xl font-bold mb-4">Le Concept</h2>
        <p class="text-lg text-neutral-300">Nous concevons des pages de destination optimisées pour la conversion en utilisant la puissance de l'IA générative. Que ce soit pour valider un nouveau concept, lancer un produit ou capturer des leads, nous créons des structures de vente percutantes alliées à un design irréprochable.</p>
      </div>

      <div class="bg-[#1a1a1a] p-8 rounded-xl border-l-4 border-[#00FA9A] mb-12">
        <h2 class="text-2xl font-bold mb-6 text-white">Notre Méthode</h2>
        <ul class="space-y-6">
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Copywriting Stratégique</strong>
                    <span class="text-neutral-300">Nous utilisons l'IA pour générer des argumentaires basés sur les frameworks de vente les plus efficaces (AIDA, PAS), adaptés précisément à votre cible.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Design & Visuels Uniques</strong>
                    <span class="text-neutral-300">Pas de templates vus partout. Nous générons des images, des icônes et des mises en page sur mesure qui respectent votre identité de marque.</span>
                </div>
            </li>
            <li class="flex gap-4">
                <div class="min-w-[4px] h-full bg-[#00FA9A] rounded-full mt-1.5"></div>
                <div>
                    <strong class="text-[#00FA9A] block mb-1 text-lg">Itération Ultra-Rapide (A/B Testing)</strong>
                    <span class="text-neutral-300">Grâce à notre workflow, nous pouvons déployer 3 variantes d'une même page en un temps record pour tester différents messages et maximiser votre ROI.</span>
                </div>
            </li>
        </ul>
      </div>

      <h2 class="text-2xl font-bold mb-6">Cas d'Usage Business</h2>
      <div class="space-y-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Lancement de Produit / MVP</h3>
            <p class="text-neutral-300">Créez une page professionnelle en quelques heures pour tester l'intérêt du marché avant même d'avoir fini de développer votre offre.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Campagnes Publicitaires (Ads)</h3>
            <p class="text-neutral-300">Déployez des landing pages spécifiques pour chaque segment d'audience de vos campagnes Google ou Meta Ads afin d'augmenter votre score de qualité.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 class="text-[#00FA9A] font-bold text-lg mb-2">Capture de Leads B2B</h3>
            <p class="text-neutral-300">Mise en place de pages de téléchargement de livres blancs ou d'inscription à des webinaires avec formulaires connectés à votre CRM.</p>
         </div>
      </div>

      <h2 class="text-2xl font-bold mb-6">Les Avantages</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Time-to-Market Record</div>
            <p class="text-sm text-neutral-400">Ne laissez pas une idée refroidir, mettez-la en ligne le jour même.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Optimisation SEO & Mobile</div>
            <p class="text-sm text-neutral-400">Des pages légères, ultra-rapides au chargement et parfaitement lisibles sur smartphone.</p>
         </div>
         <div class="bg-white/5 p-6 rounded-lg border border-white/10 hover:border-[#00FA9A]/50 transition-colors">
            <div class="text-[#00FA9A] font-bold text-lg mb-3">Évolutivité</div>
            <p class="text-sm text-neutral-400">Des pages facilement modifiables et connectables à vos outils d'automatisation (Make, n8n) pour traiter les leads instantanément.</p>
         </div>
      </div>
      
      <div class="mt-8 p-6 bg-[#00FA9A]/10 rounded-xl border border-[#00FA9A]/20 text-center">
         <p class="text-white text-lg font-medium">"Nous ne créons pas juste des sites, nous créons des machines à convertir, conçues pour transformer vos visiteurs en clients sans les délais d'une agence web traditionnelle."</p>
      </div>
    `
  },
];

interface CardProps {
  project: Project;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group/card transition-all duration-300 bg-black"
      onClick={onClick}
    >
      <img 
        src={project.image} 
        key={project.image} 
        className="w-full h-full object-cover md:object-contain bg-black transition-transform duration-700 group-hover/card:scale-105" 
        alt={project.title} 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 pointer-events-none"></div>
      
      <div className="absolute bottom-6 left-6 z-20" onClick={(e) => e.stopPropagation()}>
        <div className="text-2xl font-bold tracking-tighter uppercase mb-1 text-white">
          <EditableText value={project.title} storageKey={`marquee_proj_${project.id}_title`} />
        </div>
        <div className="text-xs text-neutral-400 uppercase tracking-widest">
           <EditableText value={project.category} storageKey={`marquee_proj_${project.id}_category`} />
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
      // Changed to v18 to force refresh of the Vidéos Avatar content
      const savedRow1 = localStorage.getItem('axem_marquee_row1_v18');
      const savedRow2 = localStorage.getItem('axem_marquee_row2_v18');
      
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

  const handleCardClick = (rowId: 1 | 2, project: Project) => {
    if (onOpenProject) {
        onOpenProject(project.id, project, (id, newData) => {
           // We keep the structure to allow text updates via Detail Page if implemented there,
           // even if drag and drop is disabled here.
        });
    }
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser les images du portfolio par défaut ?")) {
      setRow1(defaultProjectsRow1);
      setRow2(defaultProjectsRow2);
      localStorage.removeItem('axem_marquee_row1_v18');
      localStorage.removeItem('axem_marquee_row2_v18');
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
            <EditableText value="Cliquez pour voir le détail." storageKey="marquee_subtitle" />
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
           {row1.map(p => <Card key={`r1-${p.id}-a`} project={p} onClick={() => handleCardClick(1, p)} />)}
           {row1.map(p => <Card key={`r1-${p.id}-b`} project={p} onClick={() => handleCardClick(1, p)} />)}
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <div className="flex gap-6 animate-marquee-reverse flex-shrink-0 px-3 min-w-full">
           {row2.map(p => <Card key={`r2-${p.id}-a`} project={p} onClick={() => handleCardClick(2, p)} />)}
           {row2.map(p => <Card key={`r2-${p.id}-b`} project={p} onClick={() => handleCardClick(2, p)} />)}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;