# Mettre Bob.io en ligne (Render — gratuit)

Bob a besoin d'un **serveur persistant** (il télécharge/découpe des vidéos).
Render propose une offre gratuite parfaite pour démarrer.

## Étape 1 — Pousser le code sur GitHub

Crée un dépôt **privé** vide sur https://github.com/new (nom : `bob-io`,
sans README ni .gitignore). Puis, dans le dossier `bob-io/` :

```bash
git init
git add -A
git commit -m "Bob.io"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/bob-io.git
git push -u origin main
```

> Tes clés (`.env.local`) ne sont **jamais** envoyées : elles sont ignorées par git.

## Étape 2 — Déployer sur Render

1. Va sur https://render.com et connecte-toi avec GitHub.
2. Clique **New +** → **Blueprint**.
3. Choisis ton dépôt `bob-io`. Render lit automatiquement `render.yaml`.
4. Render te demande les **secrets** — saisis :
   - `GROQ_API_KEY` → ta clé Groq (`gsk_...`)
   - `ADMIN_PASSWORD` → un mot de passe admin solide (≠ bob-admin)
   - `ANTHROPIC_API_KEY` → laisse vide (optionnel)
5. Clique **Apply**. Render installe, build, et démarre Bob (~3-5 min).
6. Tu obtiens une URL publique : `https://bob-io.onrender.com` 🎉

## Bon à savoir (offre gratuite)

- **Mise en veille** après 15 min d'inactivité : le 1er chargement suivant
  prend ~1 min (le temps que le serveur se réveille).
- **Liens YouTube** : souvent bloqués depuis un serveur cloud (YouTube filtre
  les datacenters). L'**import de fichiers** fonctionne de manière fiable.
- **Clips temporaires** : effacés au redémarrage du serveur. Pour les rendre
  permanents, il faudra plus tard un stockage objet (ex. Cloudflare R2).
- **Mémoire 512 Mo** : convient aux vidéos courtes/moyennes.

## Mettre à jour le site plus tard

Chaque `git push` sur `main` redéploie Bob automatiquement.
