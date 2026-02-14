
import React, { useState, useEffect, useRef } from 'react';
import { AnimatedFolder, Project } from './ui/3d-folder';
import { RotateCcw } from 'lucide-react';
import EditableText from './ui/EditableText';

// --- Default Data Definition with Specific Case Studies ---

const caseStudiesData = [
  {
    title: "FORMATION IA (Upskilling)",
    gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    projects: [
      { 
        id: "case1_old", 
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
      },
      { 
        id: "case1_1", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", 
        title: "Productivité Employés (+40%)",
        category: "Upskilling",
        content: `
          <h1>Productivité Employés (+40%)</h1>
          <p class="text-xl text-neutral-400 mb-8">Optimisation des tâches administratives quotidiennes.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Équipes noyées sous l'admin (emails, CR, tâches répétitives).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Formation express ChatGPT + Prompts métiers prêts à l'emploi.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">40% de temps gagné sur l'administratif dès la semaine 1.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case1_2", 
        image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800", 
        title: "Content Factory Marketing",
        category: "Upskilling",
        content: `
          <h1>Content Factory Marketing</h1>
          <p class="text-xl text-neutral-400 mb-8">Industrialisation de la production de contenu.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Production de contenu lente et coûteuse (agences).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Templates IA pour générer Posts LinkedIn + Visuels en 1 clic.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">10x plus de contenus produits à effectif constant.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case1_3", 
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", 
        title: "Juridique Augmenté",
        category: "Upskilling Expert",
        content: `
          <h1>Juridique Augmenté</h1>
          <p class="text-xl text-neutral-400 mb-8">Assistant IA pour directions juridiques.</p>
          
          <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Juristes saturés par la relecture de contrats simples.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">IA sur-mesure (Harvey/Claude) pour analyse et rédaction contractuelle.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">14h économisées par juriste/semaine. 250k€ d'économies d'avocats.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "CONNEXION (Legacy & ERP)",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    projects: [
      { 
        id: "case2_old", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", 
        title: "Automatisation AS400",
        category: "Legacy",
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
      },
      { 
        id: "case2_1", 
        image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=800", 
        title: "Auto-Facture (PDF → Compta)",
        category: "Connexion",
        content: `
          <h1>Auto-Facture (PDF → Compta)</h1>
          <p class="text-xl text-neutral-400 mb-8">Automatisation de la saisie comptable.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Saisie manuelle des factures fournisseurs (erreurs et temps perdu).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">OCR intelligent connecté directement à Sage/Cegid.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Temps de saisie divisé par 5. Zéro erreur de frappe.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case2_2", 
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800", 
        title: "Sync CRM Totale",
        category: "Connexion",
        content: `
          <h1>Sync CRM Totale</h1>
          <p class="text-xl text-neutral-400 mb-8">Fiabilisation des données commerciales.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Commerciaux qui ne remplissent pas le CRM (données vides).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Connexion invisible Outlook/Gmail ↔ Salesforce/HubSpot.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">100% des échanges capturés automatiquement.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case2_3", 
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800", 
        title: "Pont SAP ↔ E-commerce",
        category: "Connexion",
        content: `
          <h1>Pont SAP ↔ E-commerce</h1>
          <p class="text-xl text-neutral-400 mb-8">Unification des stocks en temps réel.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Stocks faux sur le site web car déconnecté de l'ERP SAP.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Middleware API temps réel unifiant les deux systèmes.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Stocks synchronisés à la seconde. Fin des ventes hors-stock.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "STRATÉGIE COMMERCIALE (RevOps)",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    projects: [
      { 
        id: "case3_2_old", 
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
        id: "case3_1", 
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", 
        title: "Enrichissement de Lead Instantané",
        category: "RevOps",
        content: `
          <h1>Enrichissement de Lead Instantané</h1>
          <p class="text-xl text-neutral-400 mb-8">Qualification automatique des prospects entrants.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Leads entrants incomplets (juste un email).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">API qui trouve auto : LinkedIn, Tel, Poste, Société, CA.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Fiches clients remplies à 100% sans action humaine.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case3_3", 
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800", 
        title: "Relance Commerciale Automatisée",
        category: "RevOps",
        content: `
          <h1>Relance Commerciale Automatisée</h1>
          <p class="text-xl text-neutral-400 mb-8">Maximisation du taux de conversion.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">50% des leads perdus par manque de relance (oubli).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Scénarios de mails automatiques tant que le prospect ne répond pas.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">+35% de réponses. Aucun lead oublié.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case3_4", 
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", 
        title: "Scoring Prédictif",
        category: "RevOps",
        content: `
          <h1>Scoring Prédictif (Machine Learning)</h1>
          <p class="text-xl text-neutral-400 mb-8">Priorisation des opportunités par l'IA.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Les commerciaux perdent du temps sur des prospects qui n'achèteront pas.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Algorithme qui prédit qui va signer et priorise les appels.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Taux de conversion x3. +17% de CA immédiat.</p>
            </div>
          </div>
        `
      }
    ] as Project[]
  },
  {
    title: "AGENTS IA (Travailleurs Autonomes)",
    gradient: "linear-gradient(135deg, #f80759, #bc4e9c)",
    projects: [
      { 
        id: "case4_old", 
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
      },
      { 
        id: "case4_1", 
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", 
        title: "Chatbot Support (FAQ)",
        category: "Agents IA",
        content: `
          <h1>Chatbot Support (FAQ)</h1>
          <p class="text-xl text-neutral-400 mb-8">Désengorgement du service client.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Support client inondé de questions basiques (horaires, suivi colis).</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Agent IA connecté à votre documentation qui répond 24/7.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">-70% de tickets entrants. Réponse immédiate.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case4_2", 
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", 
        title: "Assistant de Réunion",
        category: "Agents IA",
        content: `
          <h1>Assistant de Réunion</h1>
          <p class="text-xl text-neutral-400 mb-8">Automatisation des comptes-rendus.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">Pas de compte-rendu ou oubli des tâches post-réunion.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">IA qui écoute, transcrit et envoie le résumé + to-do list par mail.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">30 min gagnées par réunion. Suivi des actions parfait.</p>
            </div>
          </div>
        `
      },
      { 
        id: "case4_3", 
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", 
        title: "Agent SDR",
        category: "Agents IA",
        content: `
          <h1>Agent SDR (Chasseur Autonome)</h1>
          <p class="text-xl text-neutral-400 mb-8">Prospection automatisée de bout en bout.</p>
          
           <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Problème</h3>
                <p class="text-sm text-neutral-300">La prospection à froid est épuisante et coûteuse.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Solution</h3>
                <p class="text-sm text-neutral-300">Agent autonome qui cherche, qualifie et contacte les prospects seul.</p>
            </div>
            <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 class="text-[#00FA9A] font-bold uppercase tracking-widest text-sm mb-2">Résultat</h3>
                <p class="text-sm text-neutral-300">Agenda rempli automatiquement. Pipeline généré : 2.7M€.</p>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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
    <section 
        id="realisations" 
        className="bg-background relative z-20 py-32 border-t border-white/5 overflow-hidden"
        onMouseMove={handleMouseMove}
        ref={containerRef}
    >
      {/* Green Spotlight Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 250, 154, 0.06), transparent 40%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 text-center mb-24 relative z-10">
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-24 md:gap-40">
            {data.map((folder, folderIdx) => (
            <div key={`case-${folderIdx}`} className="w-full md:w-[calc(50%-80px)] lg:w-[calc(25%-120px)] flex justify-center">
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
