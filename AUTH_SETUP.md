# Activer les comptes utilisateurs (Supabase)

Bob.io utilise Supabase pour l'authentification (email/mot de passe + Google) et
pour stocker l'historique « Mes clips ». Gratuit, sans carte bancaire.

## 1. Créer le projet Supabase

1. Crée un compte sur https://supabase.com → **New project**.
2. Note le mot de passe de la base, choisis une région proche (Europe).
3. Une fois le projet prêt : **Project Settings → API**. Récupère :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Créer la table des clips

**SQL Editor** → colle et exécute :

```sql
create table public.clips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id text,
  title text,
  caption text,
  url text not null,
  duration text,
  start_label text,
  score int,
  hashtags text[],
  created_at timestamptz default now()
);

alter table public.clips enable row level security;

create policy "lire ses propres clips"
  on public.clips for select
  using (auth.uid() = user_id);
```

## 3. Régler l'authentification

- **Authentication → Providers → Email** : activé (par défaut).
  - Pour une inscription sans email de confirmation (plus simple au début) :
    **Authentication → Sign In / Providers → Email → désactive "Confirm email"**.
- **URL Configuration** : ajoute ton URL de prod (`https://bob-io.onrender.com`)
  dans **Site URL**, et `https://bob-io.onrender.com/auth/callback` dans
  **Redirect URLs**.

### Google (optionnel)

1. **Authentication → Providers → Google** → active.
2. Crée des identifiants OAuth sur https://console.cloud.google.com
   (APIs & Services → Credentials → OAuth client ID → Web application).
3. **Authorized redirect URI** : `https://<projet>.supabase.co/auth/v1/callback`
   (Supabase te donne l'URL exacte à copier).
4. Colle le **Client ID** et **Client secret** dans Supabase → Save.

## 4. Mettre les 3 variables sur Render

Service `bob-io` → **Environment** → ajoute :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ton Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ta clé anon |
| `SUPABASE_SERVICE_ROLE_KEY` | ta clé service_role (secret) |

**Save** → Render redéploie. L'atelier demandera alors une connexion, et chaque
utilisateur retrouvera ses clips.
