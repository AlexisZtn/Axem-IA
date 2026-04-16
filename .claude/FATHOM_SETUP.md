# Routine Fathom → Email automatisée

Cette routine Claude Code surveille tes meetings Fathom, analyse les transcripts, et prépare des **drafts Gmail personnalisés** par participant, que tu valides un par un avant envoi.

## Ce que ça fait

```
[Fathom API] → [Analyse Claude] → [Draft Gmail] → [Validation Alexis] → [Envoi manuel]
     ↑
  toutes les 10 min (via /loop)
```

Jamais d'envoi automatique. Chaque email est relu et validé deux fois : une fois dans Claude Code, une fois dans Gmail.

## Setup initial (à faire une seule fois)

### 1. Récupérer ta clé API Fathom

1. Va sur https://fathom.video/users/settings/api (requiert un plan Team)
2. Génère une clé API
3. Note aussi l'URL de base de l'API (souvent `https://api.fathom.ai/external/v1` ou `https://api.fathom.video/external/v1` selon ton tenant)

### 2. Configurer la clé dans l'env

Ajoute dans `.env.local` à la racine du projet :

```bash
FATHOM_API_KEY=ta_cle_api_ici
FATHOM_BASE_URL=https://api.fathom.ai/external/v1
```

> `.env.local` est déjà dans `.gitignore` — ta clé ne sera jamais committée.

### 3. Vérifier les endpoints Fathom

L'API Fathom varie légèrement selon les tenants. Teste avec :

```bash
curl -H "X-Api-Key: $FATHOM_API_KEY" https://api.fathom.ai/external/v1/meetings?limit=1
```

Si ça renvoie `401` → la clé est mauvaise.
Si ça renvoie `404` → l'endpoint diffère. Essaie :
- `/calls` au lieu de `/meetings`
- `Authorization: Bearer $FATHOM_API_KEY` au lieu de `X-Api-Key`

Ajuste `.claude/commands/fathom.md` en conséquence (section "Récupérer les nouveaux meetings").

### 4. Initialiser le state file

```bash
cp .claude/fathom-state.example.json .claude/fathom-state.json
```

Au premier lancement, Claude le remplira automatiquement.

## Lancer la routine

### Option A — Manuel (à la demande)

```
/fathom
```

Claude vérifie les meetings depuis le dernier traitement et te propose les drafts un par un.

### Option B — Automatique toutes les 10 minutes (recommandé)

```
/loop 10m /fathom
```

La routine tourne en arrière-plan. Claude te notifiera dès qu'un draft sera prêt à valider.

> Pour arrêter : envoie `stop loop` ou ferme la session.

### Arguments utiles

- `/fathom --dry-run` → simule sans créer aucun draft
- `/fathom --since=2026-04-01T00:00:00Z` → force un point de départ
- `/fathom --limit=3` → ne traite que les 3 prochains meetings

## Ce que Claude te demandera

Pour chaque participant de chaque meeting, Claude te présente :
- Le résumé du meeting concerné
- L'objet et le corps de l'email proposé
- 4 choix :
  1. **Créer le draft** → Gmail aura un brouillon prêt à envoyer
  2. **Modifier** → tu dis ce qui cloche, Claude regénère
  3. **Skip ce participant** → pas d'email pour lui
  4. **Skip tout ce meeting** → passe au suivant

## Troubleshooting

| Symptôme | Cause probable | Fix |
|----------|----------------|-----|
| `FATHOM_API_KEY vide` | `.env.local` absent ou mal formatté | Vérifie la ligne `FATHOM_API_KEY=...` |
| `401 Unauthorized` | Clé expirée ou invalide | Régénère sur fathom.video |
| `429 Too Many Requests` | Trop de polls | Passe `/loop 20m /fathom` |
| Drafts doublons | `fathom-state.json` vidé | Les IDs déjà traités y sont trackés |
| Meeting skippé sans raison | Transcript pas encore prêt côté Fathom | Réessaie à la prochaine itération |

## Fichiers de cette routine

- `.claude/commands/fathom.md` — le prompt de la commande (versionnée)
- `.claude/fathom-state.example.json` — template d'état (versionné)
- `.claude/fathom-state.json` — état local, tracking des meetings déjà traités (gitignoré)
- `.claude/FATHOM_SETUP.md` — ce fichier
