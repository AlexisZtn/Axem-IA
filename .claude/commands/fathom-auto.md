---
description: Version cloud-compatible de /fathom — destinée à être exécutée par une Claude Code Routine (pas de AskUserQuestion, tourne en autonomie).
allowed-tools: Bash, Read, Write, Edit, mcp__ab8bda01-193f-4217-9ff3-ed5c91026709__create_draft, mcp__ab8bda01-193f-4217-9ff3-ed5c91026709__list_drafts, mcp__ab8bda01-193f-4217-9ff3-ed5c91026709__search_threads
---

# /fathom-auto — Routine Fathom autonome (hébergée cloud)

Version **cloud** de la routine Fathom, conçue pour tourner dans une Claude Code Routine sur l'infra Anthropic, sans interaction humaine possible pendant l'exécution.

## Différences avec `/fathom` (version locale)

- Aucun `AskUserQuestion` : la routine cloud ne peut pas demander d'input utilisateur pendant un run.
- **Validation différée via Gmail** : Claude crée les drafts dans Gmail. Alexis les relit et envoie manuellement depuis Gmail → le brouillon EST l'étape de validation.
- **Dédup via Gmail** : plus de `fathom-state.json` (le repo est cloné à neuf à chaque run). Un marker invisible `Réf: FTM-{meeting_id}` est ajouté en bas de chaque email, et Claude cherche dans Gmail avant de créer un draft.
- **Fenêtre temporelle glissante** : la routine fetch les meetings Fathom créés dans les dernières 75 minutes (15 min de buffer par rapport à la cadence horaire).

## Contexte

- **Utilisateur** : Alexis, fondateur d'Axem-IA.
- **Langue des emails** : français par défaut, anglais si le meeting l'était.
- **Ton** : pro, chaleureux, direct. Phrases courtes.
- **Signature exacte** (toujours sur deux lignes, jamais de variante) :
  ```
  Bien à vous,
  Alexis Zeitoun
  ```
- **Règle d'or** : création de DRAFTS uniquement. Ne jamais envoyer. Alexis valide dans Gmail.

## Étapes

### 1. Vérifier la config

Les variables sont injectées par l'environnement cloud de la routine (pas de `.env.local` accessible) :

```bash
: "${FATHOM_API_KEY:?FATHOM_API_KEY non défini dans l'environnement de la routine}"
FATHOM_BASE_URL="${FATHOM_BASE_URL:-https://api.fathom.ai/external/v1}"
```

Si `FATHOM_API_KEY` est absent, arrête immédiatement avec un message d'erreur explicite — Alexis ira ajouter le secret dans l'environnement de la routine sur claude.ai/code/routines.

### 2. Définir la fenêtre temporelle

```bash
# Fenêtre glissante : dernières 75 minutes (15 min de buffer sur une cadence horaire)
SINCE=$(date -u -d '75 minutes ago' +%Y-%m-%dT%H:%M:%SZ)
```

### 3. Lister les nouveaux meetings

```bash
curl -sS -H "X-Api-Key: $FATHOM_API_KEY" \
  "$FATHOM_BASE_URL/meetings?created_after=$SINCE&limit=10"
```

> Si l'API renvoie 404 sur `/meetings`, essayer `/calls`. Si 401 sur `X-Api-Key`, essayer `Authorization: Bearer $FATHOM_API_KEY`. Logue le code HTTP et sors proprement si tout échoue.

S'il n'y a aucun meeting → loggue « Aucun nouveau meeting dans la fenêtre » et termine.

### 4. Pour chaque meeting

#### 4a. Récupérer transcript + participants

```bash
curl -sS -H "X-Api-Key: $FATHOM_API_KEY" \
  "$FATHOM_BASE_URL/meetings/$MEETING_ID/transcript"
```

Extrais : titre, date, participants (nom + email, exclus Alexis), transcript complet, action items.

Si le transcript n'est pas encore prêt (Fathom le process en asynchrone), skip ce meeting — il sera traité au run suivant.

#### 4b. Pour chaque participant externe → vérifier la dédup Gmail

Avant de créer un draft, cherche si un draft ou email existe déjà pour ce meeting + ce participant :

Utilise `mcp__ab8bda01-193f-4217-9ff3-ed5c91026709__search_threads` avec query :
```
to:{participant_email} "Réf: FTM-{meeting_id}"
```

Si un résultat → **skip ce participant** (déjà traité). Sinon continue.

#### 4c. Rédiger le draft

Structure :
- **Objet** : court, contextuel. Ex : « Suite à notre échange — [sujet concret] »
- **Corps** (texte brut, pas d'HTML) :
  ```
  Bonjour {prénom},

  Merci pour l'échange de ce [jour/matin/après-midi].

  [2-3 points clés spécifiques à ce participant, extraits du transcript]

  [Prochaines étapes concrètes côté Alexis si pertinent]

  [Call to action : question, proposition de créneau, doc à envoyer, etc.]

  Bien à vous,
  Alexis Zeitoun

  —
  Réf: FTM-{meeting_id}
  ```

**Règles rédactionnelles** :
- Pas de « J'espère que vous allez bien »
- Pas d'emojis
- Pas de jargon corporate (« synergies », « leverage », etc.)
- Phrases courtes, ton direct
- Le marker `Réf: FTM-{meeting_id}` en fin d'email est OBLIGATOIRE (sert à la dédup). Alexis peut le supprimer avant envoi.

#### 4d. Créer le draft Gmail

Utilise `mcp__ab8bda01-193f-4217-9ff3-ed5c91026709__create_draft` :
- `to` : email du participant
- `subject` : objet rédigé
- `body` : corps complet incluant la signature ET le marker de réf

**Ne jamais utiliser d'outil de send**. Uniquement `create_draft`.

### 5. Résumé du run

Affiche à la fin (visible dans la session cloud sur claude.ai/code/routines) :

```
📊 Routine Fathom — {ISO datetime}
Fenêtre : depuis {SINCE}
• {N} meetings trouvés dans la fenêtre
• {M} drafts Gmail créés
• {K} participants skippés (déjà traités)
• {E} meetings skippés (transcript pas prêt)
```

## Robustesse

- Erreur API Fathom (401/429/5xx) : log + termine proprement, pas d'exception silencieuse
- Participant sans email : log + skip, continue avec les autres
- Transcript vide : skip ce meeting, il sera retraité au run suivant (il n'est pas marqué)
- Limite : max 10 meetings traités par run pour éviter de saturer Gmail
- Aucun `git commit` / `git push` : la routine n'écrit pas dans le repo
