# Migration vers une Claude Code Routine (cloud 24/7)

Ce guide migre ta routine `/fathom` d'une exécution locale via `/loop` (besoin du Mac allumé) vers une **Claude Code Routine** hébergée sur l'infra Anthropic (tourne toute seule 24/7).

> 📖 Doc officielle : https://code.claude.com/docs/en/routines

## Pré-requis

- Plan **Pro**, **Max**, **Team** ou **Enterprise** avec Claude Code Web activé
- Une clé API Fathom (tu l'as déjà)
- Ton compte Gmail connecté comme [MCP connector](https://claude.ai/settings/connectors) (si pas déjà fait)

## Différences entre `/loop` et Routine

|  | `/loop 10m /fathom` | Routine cloud |
|---|---|---|
| Tourne sans ton Mac | ❌ | ✅ |
| Intervalle minimum | 1 minute | **1 heure** |
| Confirmation inline | Oui (AskUserQuestion) | Non (routines autonomes) |
| Tes credentials | `.env.local` | Env variables cloud Anthropic |
| Workflow de validation | Tu valides dans Claude Code | **Tu valides dans Gmail (brouillons)** |

Dans les deux cas, **aucun envoi automatique** : c'est toi qui cliques « Envoyer » dans Gmail.

## Étapes de setup (10 minutes, clic-clic)

### 1. Ouvrir la page Routines

→ https://claude.ai/code/routines

Si c'est la première fois, Claude Code te demandera peut-être de connecter ton compte GitHub. Accepte.

### 2. Cliquer « New routine »

### 3. Remplir le formulaire

**Name** :
```
Fathom Follow-up Automation
```

**Prompt** (copie-colle exactement ceci) :
```
Exécute la routine décrite dans .claude/commands/fathom-auto.md de ce repo.

Récapitulatif :
1. Récupère via l'API Fathom (FATHOM_API_KEY en env var) les meetings créés dans les 75 dernières minutes
2. Pour chaque meeting, extrais le transcript et les participants externes (≠ Alexis)
3. Pour chaque participant, cherche dans Gmail si un draft avec le marker "Réf: FTM-{meeting_id}" existe déjà — si oui, skip
4. Sinon, rédige un email de follow-up personnalisé en français (ton pro-chaleureux-direct, terminé EXACTEMENT par la signature sur deux lignes "Bien à vous,\nAlexis Zeitoun") et crée un DRAFT dans Gmail via le connector (NE JAMAIS envoyer)
5. Le corps de l'email DOIT se terminer par "Réf: FTM-{meeting_id}" pour permettre la dédup future
6. À la fin, SI au moins 1 draft a été créé ce run, crée un brouillon RÉCAP adressé à ${ALEXIS_EMAIL} listant tous les drafts préparés (destinataire, objet, aperçu 80 chars) avec marker "Réf: FTM-RECAP-{timestamp}" — ce récap sert de notification perso

Affiche un résumé à la fin : meetings traités, drafts créés, participants skippés, récap envoyé.
```

**Model** : Claude Sonnet 4.6 (largement suffisant pour cette tâche)

**Repositories** :
- Clique « Add repository »
- Choisis `AlexisZtn/Axem-IA`
- Branche : `claude/fathom-meeting-email-automation-SaYhv` (ou `main` si tu as mergé la PR)
- **Allow unrestricted branch pushes** : ❌ laisse décoché (la routine n'écrit pas dans le repo)

**Environment** :
- Clique « New environment » (en haut à droite de la section)
- Nom : `fathom-env`
- **Network access** : `Allow all` (ou au minimum permettre `api.fathom.ai` / `api.fathom.video`)
- **Environment variables** : ajoute 3 lignes
  - `FATHOM_API_KEY` = ta nouvelle clé Fathom *(⚠️ régénère-la depuis fathom.video avant de la coller ici)*
  - `FATHOM_BASE_URL` = `https://api.fathom.ai/external/v1`
  - `ALEXIS_EMAIL` = `zeitoun.alexis@gmail.com` *(c'est là que la routine t'enverra le récap de chaque run)*
- **Setup script** : laisse vide (pas de dépendances npm à installer)
- Sauvegarde, puis sélectionne `fathom-env` dans la liste

**Trigger** :
- Type : **Schedule**
- Fréquence : **Hourly**
- Rappel : le minimum est 1h, pas 10 min

**Connectors** :
- Vérifie que **Gmail** est coché (c'est ce qui permet `create_draft` / `search_threads`)
- Décoche tous les autres connectors inutiles pour cette routine (principle of least privilege)

### 4. Cliquer « Create »

La routine apparaît dans ta liste. Elle se lancera automatiquement à la prochaine heure pleine.

### 5. Tester immédiatement avec « Run now »

Ouvre la page détail de la routine → bouton **« Run now »** → une session cloud démarre. Clique dessus pour voir en live ce que Claude fait (logs, appels API, drafts créés).

## 🔔 Activer les notifications push (à faire APRÈS avoir créé la routine)

Deux canaux complémentaires te préviendront quand des brouillons sont prêts :

### Canal 1 — Brouillon récap à toi-même (automatique, déjà configuré)

À chaque run où au moins 1 draft a été créé, la routine crée en plus **un brouillon récapitulatif** adressé à `${ALEXIS_EMAIL}` avec :
- Subject : `🔔 Fathom — N brouillon(s) en attente`
- Body : liste des drafts préparés avec destinataire, objet, aperçu

Ce récap apparaît en haut de ton Gmail > Brouillons. Tu peux :
- **Soit** le lire directement dans la vue Brouillons comme une to-do list
- **Soit** l'envoyer à toi-même (clic Send) → il arrive dans ton Inbox comme une vraie notif email

### Canal 2 — App mobile Claude + push notifications

1. **Télécharge l'app Claude** :
   - iOS : https://apps.apple.com/app/claude-by-anthropic/id6473753684
   - Android : Play Store → « Claude by Anthropic »

2. **Connecte-toi** avec le même compte que claude.ai

3. **Active les notifs de sessions** :
   - Ouvre **Settings** dans l'app
   - Active **« Routine run notifications »** (nom exact peut varier)
   - Autorise les notifications push au niveau système (iOS Settings > Notifications > Claude)

4. À chaque run de la routine Fathom, tu recevras un push du type :
   > *Claude Code — Routine Fathom terminée, 3 brouillons créés*

5. Tu tapotes → la session cloud s'ouvre avec le résumé complet → tu bascules sur Gmail pour envoyer

**Tips** :
- Si l'app ne propose pas les notifs de routine, active au minimum les notifs de sessions (même effet)
- Les push arrivent ~quelques secondes après la fin du run cloud
- Tu peux aussi activer les notifs web push sur claude.ai/code (icône cloche dans le header) en complément

## Vérification post-setup

Après le premier run réussi :

1. Va dans ta boîte Gmail → **Brouillons**
2. Tu devrais voir 1 draft par participant externe de chaque meeting Fathom récent
3. Chaque draft a un marker `Réf: FTM-{xxx}` en fin de corps → tu peux le supprimer avant d'envoyer, la dédup fonctionne sur tout email déjà envoyé contenant ce marker

## Gestion courante

| Action | Comment |
|---|---|
| Voir les runs passés | https://claude.ai/code/routines → clic sur la routine |
| Pause temporaire | Toggle **Repeats** sur la page détail |
| Changer le prompt ou la fréquence | Icône crayon → **Edit routine** |
| Stopper définitivement | Icône corbeille sur la page détail |
| Ajuster la clé API | Modifier l'environnement `fathom-env` |

## Limites à connaître

- **Minimum 1h entre runs** (pas 10 min comme `/loop`)
- **Plafond quotidien de runs par compte** — à vérifier sur https://claude.ai/settings/usage
- **Research preview** : la feature peut changer, Anthropic le signale dans la doc
- **Fresh clone à chaque run** : la routine ne voit que ce qui est committé sur GitHub. Tout secret doit passer par l'environnement, jamais dans le repo.

## Coexistence avec `/loop`

Tu peux garder les deux :
- **Routine cloud** : tourne en arrière-plan 24/7, fait le gros du travail
- **`/loop 10m /fathom`** : à lancer ponctuellement quand tu veux un cycle rapide pendant une journée intense de meetings

Les deux partagent la même logique de dédup Gmail, donc pas de doublons.

## Si ça ne marche pas

- **Erreur `FATHOM_API_KEY non défini`** → vérifie l'environnement `fathom-env` sur la routine
- **404 sur l'API Fathom** → l'endpoint exact de ton tenant n'est pas `/meetings`. Édite le prompt de la routine pour essayer `/calls` et/ou `Authorization: Bearer` au lieu de `X-Api-Key`
- **Aucun draft créé** → vérifie que le connector Gmail est bien activé dans la routine
- **Runs qui échouent silencieusement** → ouvre la session du run depuis la page Routines, les logs complets y sont visibles
