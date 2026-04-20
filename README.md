# otoCI — Plateforme d'inscription

Mouvement collectif pour un financement oto direct en Côte d'Ivoire, sans les 18% des banques.

## Architecture sécurisée

```
Navigateur → POST /api/inscription → Serveur Next.js → Supabase
```

Les clés Supabase ne sont **jamais** exposées au navigateur. Elles vivent uniquement dans les variables d'environnement serveur.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (base de données PostgreSQL)
- **Vercel** (hébergement gratuit)
- **TypeScript**

---

## 1. Préparer Supabase

### Créer la table

Dans **Supabase Dashboard → SQL Editor → New Query**, exécutez :

```sql
CREATE TABLE inscriptions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_number   TEXT UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  statut       TEXT DEFAULT 'en_attente'
               CHECK (statut IN ('en_attente','valide','rejete','incomplet')),
  prenom              TEXT NOT NULL,
  nom                 TEXT NOT NULL,
  date_naissance      DATE NOT NULL,
  sexe                TEXT,
  telephone           TEXT NOT NULL,
  email               TEXT NOT NULL,
  ville               TEXT NOT NULL,
  situation_familiale TEXT,
  type_contrat        TEXT NOT NULL,
  secteur             TEXT NOT NULL,
  poste               TEXT NOT NULL,
  anciennete          TEXT NOT NULL,
  salaire_net          INTEGER NOT NULL,
  autres_revenus       INTEGER DEFAULT 0,
  charges_mensuelles   INTEGER DEFAULT 0,
  budget_vehicule      TEXT NOT NULL,
  duree_remboursement  TEXT,
  apport_personnel     TEXT,
  taux_acceptable      TEXT,
  marque_preferee      TEXT,
  type_vehicule        TEXT,
  motorisation         TEXT,
  delai_achat          TEXT NOT NULL,
  commentaire          TEXT
);

-- Sécurité
ALTER TABLE inscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertion publique" ON inscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture admin" ON inscriptions
  FOR SELECT USING (auth.role() = 'authenticated');
```

### Récupérer la clé service_role

**Supabase Dashboard → Settings → API → service_role** (la clé secrète, pas la clé anon)

---

## 2. Développement local

```bash
# Cloner le projet
git clone https://github.com/utuezi-code/otoCi.git
cd otoCi

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env.local
```

Éditez `.env.local` avec vos vraies valeurs :

```env
SUPABASE_URL=https://rrjvxoqntkyhssyfzfmr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

```bash
# Lancer en développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## 3. Déploiement sur Vercel (gratuit)

### Option A — Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com) → **New Project**
2. Importez le repo GitHub `utuezi-code/otoCi`
3. Dans **Environment Variables**, ajoutez :
   - `SUPABASE_URL` → `https://rrjvxoqntkyhssyfzfmr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` → votre clé service_role
4. Cliquez **Deploy**

### Option B — Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel vous demandera d'entrer les variables d'environnement.

---

## Structure du projet

```
otoCi/
├── app/
│   ├── api/
│   │   └── inscription/
│   │       └── route.ts        ← API sécurisée (serveur uniquement)
│   ├── components/
│   │   └── InscriptionForm.tsx ← Formulaire client
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── supabase.ts             ← Client Supabase (serveur uniquement)
├── .env.example                ← Template variables d'environnement
├── .env.local                  ← VOS VRAIES CLÉS (jamais commité)
├── .gitignore
└── README.md
```

## Sécurité

- `.env.local` est dans `.gitignore` → jamais commité sur GitHub
- La clé `service_role` n'est accessible que dans les API routes Next.js
- Le navigateur n'a accès à aucune clé Supabase
- RLS activé sur la table : insertion publique, lecture admin uniquement
