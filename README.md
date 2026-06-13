# Bob.io 🤖

Transforme une longue vidéo en clips courts viraux (TikTok / Reels / Shorts).
Gratuit pour les créateurs. Clone amical de Klap.app.

## Comment ça marche (le moteur)

1. **Source** — lien YouTube (yt-dlp) ou fichier importé
2. **Audio** — extrait par ffmpeg
3. **Transcription** — Groq Whisper (horodatage mot à mot)
4. **Détection des moments forts** — Claude choisit les meilleurs extraits
5. **Découpe** — ffmpeg coupe, recadre en 9:16 et incruste les sous-titres
6. **Galerie** — clips réels téléchargeables

## Démarrage

### 1. Ajouter les clés API

Ouvre `bob-io/.env.local` et colle tes deux clés :

```
GROQ_API_KEY=gsk_...          # gratuit : https://console.groq.com/keys
ANTHROPIC_API_KEY=sk-ant-...  # https://console.anthropic.com/settings/keys
```

### 2. Lancer

```bash
npm run dev
```

Puis ouvre http://localhost:3000 (page d'accueil) ou http://localhost:3000/app (atelier).

## Notes

- Les binaires `ffmpeg` et `yt-dlp` sont fournis via npm (`ffmpeg-static`, `youtube-dl-exec`) — rien à installer côté système.
- Les clips générés sont écrits dans `public/clips/<jobId>/` et servis statiquement (non commités).
- Le suivi des jobs est en mémoire : adapté à un serveur Node persistant (local / VPS). Pour un déploiement serverless (ex. Vercel), il faudra une file d'attente + un stockage objet (étape ultérieure).
- Modèles configurables via `BOB_GROQ_MODEL` et `BOB_CLAUDE_MODEL`.
