# 🎲 BetPote

> Pariez entre amis, sans argent. Le gagnant choisit le restau.

**Stack :** React + Vite · Tailwind CSS · Supabase · Netlify

---

## 🚀 Mise en route en 5 étapes

### 1. Clone & install
```bash
git clone https://github.com/TON-USER/betpote.git
cd betpote
npm install
```

### 2. Crée le projet Supabase
1. Va sur [supabase.com](https://supabase.com) → New project
2. Dans **SQL Editor**, exécute le schema complet qui se trouve dans `src/lib/supabase.js` (section commentée)
3. Copie ton **Project URL** et ton **anon public key** depuis Settings → API

### 3. Configure les variables d'environnement
```bash
cp .env.example .env
# Remplis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

### 4. Lance en local
```bash
npm run dev
# → http://localhost:5173
```

### 5. Déploie sur Netlify
1. Push sur GitHub
2. Netlify → New site from Git → choisis ton repo
3. Build command: `npm run build` · Publish dir: `dist`
4. Dans **Site settings → Environment variables** : ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
5. 🎉 Deploy !

---

## 📁 Structure

```
src/
├── pages/
│   ├── Home.jsx        # Landing page avec ticker animé
│   ├── CreateBet.jsx   # Formulaire 3 étapes
│   ├── BetDetail.jsx   # Vue du pari + vote
│   └── Success.jsx     # Page de partage post-création
├── components/
│   ├── Navbar.jsx
│   ├── PillDivider.jsx
│   ├── VoteBar.jsx
│   └── ShareButtons.jsx
├── hooks/
│   ├── useBet.js         # Fetch pari + votes, realtime
│   └── useVoterToken.js  # Identité anonyme via localStorage
└── lib/
    └── supabase.js       # Client + schema SQL commenté
```

---

## 🗃️ Schéma Supabase

| Table     | Colonnes clés                                              |
|-----------|------------------------------------------------------------|
| `bets`    | id, title, creator, gain, end_date                        |
| `choices` | id, bet_id, label, position                               |
| `votes`   | id, bet_id, choice_id, voter_name, voter_token (unique)   |

Le `voter_token` est un UUID généré côté client (localStorage) pour empêcher le double-vote sans compte.

---

## 💡 Fonctionnalités

- ✅ Création de pari en 3 étapes (titre + choix / gain / date)
- ✅ Partage WhatsApp en 1 tap + copie du lien
- ✅ Vote sans inscription (token anonyme)
- ✅ Résultats masqués jusqu'au vote (anti-influence)
- ✅ Mise à jour en temps réel (Supabase Realtime)
- ✅ Responsive mobile-first
- ✅ Design inspiré Lydia (blanc, bleu #3D6EFF, Plus Jakarta Sans)
