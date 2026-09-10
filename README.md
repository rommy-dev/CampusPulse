# CampusPulse

<div align="center">

![CampusPulse](https://img.shields.io/badge/CampusPulse-ESPA-blue?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

> Plateforme web de collecte et d'analyse des habitudes environnementales, de mobilité et du cadre de vie des étudiants de l'École Supérieure Polytechnique d'Antananarivo (ESPA).

## Sommaire

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
- [Déploiement](#déploiement)
- [Sécurité et confidentialité](#sécurité-et-confidentialité)
- [Base de données](#base-de-données)
- [Contribution](#contribution)
- [Licence](#licence)

## À propos

CampusPulse est une solution de collecte de données et d’analyse décisionnelle destinée à mieux comprendre les conditions de vie et les habitudes environnementales des étudiants sur le campus. L’objectif est de remplacer les rumeurs et impressions subjectives par des données chiffrées, fiables et exploitables.

Le projet permet notamment de mesurer les habitudes liées à :

- la mobilité et les transports,
- la consommation d’eau et des ressources,
- l’alimentation et les habitudes de restauration,
- la technologie et la connectivité,
- les vêtements et le cycle de consommation,
- l’hygiène et les infrastructures,
- la gestion des déchets,
- la perception générale du campus,
- le profil des étudiants et leur répartition par filière.

Cette plateforme aide les décideurs à prendre des décisions éclairées tout en garantissant l’anonymat des réponses et le respect de la vie privée des utilisateurs.

## Fonctionnalités

### 1. Authentification et gestion utilisateur

- inscription et connexion,
- récupération de mot de passe,
- gestion des rôles étudiants/admin,
- profils utilisateurs avec avatar,
- accès sécurisé selon les permissions.

### 2. Questionnaire multi-thématiques

Le questionnaire couvre 9 piliers principaux :

1. Transport et mobilité
2. Budget et eau
3. Alimentation et restauration
4. Technologie et réseaux
5. Vêtements et friperie
6. Hygiène et infrastructures
7. Gestion des déchets
8. Perception du campus
9. Profil et filières

### 3. Dashboard administrateur

- vue d’ensemble des réponses reçues,
- KPIs en temps réel,
- graphiques de progression et de tendances,
- export des données vers Excel,
- suivi de l’avancement de la collecte.

### 4. Analyse statistique détaillée

- vues thématiques par sujet,
- graphiques interatifs (barres, diagrammes circulaires, etc.),
- données publiques agrégées,
- mode de démonstration si la base est vide.

### 5. Landing page publique

- présentation du projet,
- KPIs anonymisés,
- FAQ et guide d’utilisation,
- design moderne et responsive.

### 6. Export de données

- export des données vers Excel,
- structuration intelligente des feuilles,
- formatage automatique des valeurs.

## Architecture technique

### Stack technologique

- Frontend : React 19 + Vite
- Styling : Tailwind CSS
- Routing : React Router 7
- Backend : Supabase
- Base de données : PostgreSQL
- Authentification : Supabase Auth
- Stockage : Supabase Storage
- Visualisation : Recharts
- Export Excel : ExcelJS
- Icônes : Lucide React
- Thème : mode clair / sombre

### Architecture fonctionnelle

Le projet suit une séparation claire entre :

- l’interface utilisateur côté frontend,
- les services d’authentification et de données côté Supabase,
- les vues analytiques et les tableaux de bord en temps réel,
- les composants réutilisables et hooks personnalisés pour la logique métier.

## Structure du projet

```text
campuspulse/
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/        # Composants UI réutilisables
│   │   ├── pages/             # Pages principales
│   │   ├── hooks/             # Hooks personnalisés
│   │   ├── lib/               # Utilitaires, constantes, clients externes
│   │   ├── contexts/          # Contextes React
│   │   └── assets/            # Ressources statiques
│   ├── public/                # Fichiers publics
│   ├── package.json           # Dépendances et scripts
│   ├── vite.config.js         # Configuration Vite
│   └── index.html             # Point d’entrée HTML
├── supabase/
│   ├── config.toml            # Configuration Supabase
│   └── migrations/            # Scripts SQL de migration
├── .env.example               # Exemple de variables environnement
├── README.md                  # Documentation du projet
├── LICENSE                    # Licence MIT
└── .gitignore
```

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- Node.js 18+
- npm ou pnpm
- un compte Supabase
- accès à un projet Supabase configuré

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-utilisateur>/campuspulse.git
cd campuspulse
```

### 2. Installer les dépendances du frontend

```bash
cd frontend
npm install
```

### 3. Lancer l’application en mode développement

```bash
npm run dev
```

L’application sera accessible par défaut via le serveur Vite local.

### 4. Générer un build de production

```bash
npm run build
```

### 5. Prévisualiser le build

```bash
npm run preview
```

## Configuration des variables d’environnement

Créez un fichier `.env` dans le dossier `frontend` à partir de l’exemple fourni :

```bash
cd frontend
cp ../.env.example .env
```

Ensuite, ajoutez vos clés de projet Supabase :

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> Ces variables sont indispensables pour l’authentification, la base de données et les requêtes côté client.

## Déploiement

Le projet est compatible avec les environnements modernes de déploiement comme Vercel, Netlify ou Supabase + frontend statique.

### Déploiement recommandé

- Frontend : Vercel
- Backend / base de données : Supabase
- Variables d’environnement : définies dans l’interface de déploiement

Le dépôt contient aussi une configuration Vercel adaptée pour le frontend.

## Sécurité et confidentialité

CampusPulse met un point d’honneur sur la protection des données. Les décisions de conception préviennent les fuites d’informations sensibles :

- anonymat total des réponses dans les statistiques publiques,
- séparation claire entre données identifiables et agrégations,
- politiques RLS (Row Level Security) sur les tables,
- contrôle d’accès selon le rôle utilisateur,
- stockage sécurisé via Supabase,
- sécurité de la session avec l’authentification de Supabase.

### Rôles et permissions

- Étudiant : accès au formulaire et aux statistiques publiques
- Admin : accès au dashboard, gestion des utilisateurs et export complet

## Base de données

Le schéma principal est centré sur :

- `profiles` : extension de `auth.users`, avec rôle et informations du profil,
- `responses` : réponses du questionnaire, stockées au format JSONB.

Les migrations SQL dans le dossier `supabase/migrations` permettent de gérer le schéma et les politiques de sécurité de manière versionnée.

## Contribution

Les contributions sont les bienvenues.

### Workflow recommandé

1. Créer une branche dédiée
2. Développer la fonctionnalité ou la correction
3. Vérifier le code avec les outils de linting
4. Soumettre une pull request avec une description claire

Exemple :

```bash
git checkout -b feature/nom-fonctionnalite
npm run build
```

## Licence

Ce projet est soumis à une licence de droits réservés.

```text
License

© 2026 CampusPulse. All rights reserved.

This repository is publicly available for viewing and educational/reference purposes only.

No permission is granted to copy, modify, distribute, sublicense, sell, or create derivative works from this source code without prior written permission from the copyright holder.

The CampusPulse source code and associated assets remain the property of their respective copyright holders.
```

## Conclusion

CampusPulse est une plateforme complète qui associe développement web moderne, analyse de données et impact social. En combinant une interface agréable, des outils de collecte performants, des tableaux de bord intelligents et une sécurisation renforcée des données, le projet offre une solution de qualité professionnelle pour soutenir la prise de décision au sein de l’ESPA.

---

Projet développé pour l'École Supérieure Polytechnique d'Antananarivo (ESPA).
