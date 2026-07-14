# Restovio

> Plateforme de réservation et de gestion hôtelière — projet de fin de
> formation « Développeur Natif IA Web », LeDevFred Academy (2026).

Restovio permet à un hôtel de présenter son offre de chambres, à un client
de rechercher et réserver une chambre en toute fiabilité, et à un
administrateur de piloter l'activité (chambres, réservations, utilisateurs)
depuis un tableau de bord dédié.

## Fonctionnalités

### MVP (Must Have)

- Authentification par identifiants (Auth.js / Credentials) avec rôles
  `CLIENT` / `ADMIN`, middleware de protection des routes `/admin` et
  `/mon-compte`.
- Catalogue public de chambres avec recherche par dates, nombre de
  personnes, catégorie, prix, et pagination côté serveur.
- Page de détail d'une chambre avec disponibilité réelle calculée sur la
  période demandée.
- Création de réservation avec contrôles serveur complets : dates
  cohérentes, capacité respectée, non-chevauchement, authentification
  requise, prix recalculé et vérifié côté serveur.
- Espace client : profil, liste et détail des réservations, annulation.
- Espace admin : CRUD complet des chambres avec upload d'images
  (Cloudinary), gestion des réservations (recherche, filtre par statut,
  confirmation, annulation, suppression), tableau de bord avec les
  indicateurs clés.
- Design responsive (mobile, tablette, desktop) avec menu mobile dédié,
  notifications toast, états de chargement et pages d'erreur/404.

### Fonctionnalités additionnelles réalisées (Should Have)

- Formulaire de contact public, persistant en base.
- Gestion des utilisateurs côté admin (liste, recherche, changement de
  rôle, protection contre l'auto-rétrogradation — RG-11).
- Témoignages clients affichés en page d'accueil.
- Graphique Recharts (réservations / revenus sur 30 jours) sur le tableau
  de bord.
- Micro-animations Framer Motion (section héro), transitions shadcn/ui.
- Vérification de disponibilité en direct sur la fiche chambre, filtre par
  date des réservations côté admin, page de détail de réservation admin.
- Système de réservation avec validation admin : demande client → statut
  "En attente" → validation ou refus par l'administrateur (avec
  re-vérification des conflits de dates) → e-mail de notification (Resend)
  → paiement intégral en ligne via Stripe (mode test) → statut "Payée".
  Suivi de remboursement sous 24h en cas d'annulation d'une réservation
  déjà payée.
- Remise automatique de -30 % sur les séjours de 30 nuits ou plus.
- Nouveaux services mis en avant : petit-déjeuner gratuit, véhicule/chauffeur
  pour les sorties (tarif négocié directement, hors plateforme), salle de
  cinéma (séance chaque vendredi soir), piscines adultes et enfants.
- Page `/restaurant` : menu de l'hôtel (entrées, plats, desserts, boissons)
  géré depuis l'admin, et réservation de table pour un dîner en famille
  vue piscine (créneaux 19h–22h), avec suivi côté client (`/mon-compte/tables`)
  et gestion côté admin (`/admin/tables`).

## Stack technique

| Brique | Choix | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2 |
| Langage | TypeScript | 5 |
| UI | Tailwind CSS v4, shadcn/ui (Base UI) | — |
| Animations | Framer Motion | 12 |
| Base de données | PostgreSQL | 16 |
| ORM | Prisma | 6.19 |
| Authentification | Auth.js (NextAuth v5, Credentials) | 5 beta |
| Validation | Zod | 4 |
| Formulaires | React Hook Form | 7 |
| Upload d'images | Cloudinary | — |
| Notifications | Sonner | — |
| Graphiques | Recharts | 3 |
| Déploiement | Vercel | — |

## Installation locale

Prérequis : Node.js 20+, une base PostgreSQL accessible (locale via Docker
ou distante via Neon/Supabase).

```bash
git clone <url-du-depot>
cd reservia
npm install
cp .env.example .env   # renseigner les variables (voir ci-dessous)
npx prisma migrate dev
npx prisma db seed
npm run dev
```

L'application est alors disponible sur `http://localhost:3000`.

### Base de données locale rapide (Docker)

```bash
docker run -d --name reservia-db \
  -e POSTGRES_USER=reservia -e POSTGRES_PASSWORD=reservia -e POSTGRES_DB=reservia \
  -p 5432:5432 postgres:16-alpine
```

Puis `DATABASE_URL="postgresql://reservia:reservia@localhost:5432/reservia?schema=public"`
dans `.env`.

### Variables d'environnement

Voir `.env.example`. Les variables `CLOUDINARY_*` sont nécessaires pour
que l'upload de photos de chambres fonctionne ; sans elles, la création et
l'édition de chambres restent possibles mais l'ajout de nouvelles photos
échouera (les chambres seedées utilisent des images Unsplash déjà en
place).

Les variables `STRIPE_*` (clés de test — voir
[dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys))
sont nécessaires pour le paiement des réservations validées ; `RESEND_API_KEY`
pour les e-mails de validation/refus. En local, `STRIPE_WEBHOOK_SECRET` est
fourni par `stripe listen --forward-to localhost:3401/api/webhooks/stripe`
(Stripe CLI). Sans ces variables, la création/consultation de réservations
reste fonctionnelle ; seuls le paiement et l'envoi d'e-mail échouent (de
façon non bloquante pour l'e-mail, la réservation reste correctement
validée/refusée).

## Comptes de démonstration

Créés par le script de seed (`npx prisma db seed`) :

| Rôle | E-mail | Mot de passe |
|---|---|---|
| CLIENT | `client@restovio.app` | `Client1234!` |
| ADMIN | `admin@restovio.app` | `Admin1234!` |

Pour tester le paiement (Stripe en mode test) : carte `4242 4242 4242 4242`,
date d'expiration future quelconque, CVC quelconque (ex. `123`). Aucun
montant réel n'est débité.

## Déploiement

Déployé sur Vercel, connecté au dépôt GitHub (déploiement automatique à
chaque push sur `main`). Base de données PostgreSQL hébergée sur Neon.

1. Projet Vercel créé et lié au dépôt GitHub.
2. Base PostgreSQL provisionnée sur Neon (connexion `DATABASE_URL` poolée
   pour l'application + `DIRECT_URL` non-poolée pour les migrations Prisma).
3. Variables d'environnement renseignées dans les paramètres Vercel du
   projet (jamais dans le code).
4. Migrations appliquées avec `npx prisma migrate deploy`, puis
   `npx prisma db seed` pour les comptes de démonstration.
5. Parcours critiques (inscription, connexion, réservation de chambre,
   réservation de table, dashboard admin, autorisations) vérifiés
   directement en production — voir la recette de tests ci-dessous.

> **Lien de production : https://restovio.vercel.app**

### Recette de production effectuée

45 vérifications exécutées directement contre l'environnement de
production (requêtes API réelles, pas seulement en local) : inscription
(validation, unicité email, hashage bcrypt), connexion/déconnexion,
autorisations serveur (client bloqué sur `/admin`, non-connecté bloqué sur
`/mon-compte`, contrôle de propriété des réservations), catalogue et
filtres, CRUD chambres admin, création de réservation avec toutes les
règles de gestion (dates, capacité, chevauchement, calcul du montant),
cycle complet réservation (confirmation, annulation, remboursement),
tableau de bord admin (cohérence des indicateurs avec la base), menu du
restaurant et réservation de table. Toutes les vérifications sont passées.

## Utilisation de l'intelligence artificielle

Ce projet a été développé avec l'appui d'un assistant IA (Claude Code) pour :

- la génération de la structure initiale du projet, des composants, des
  routes API et des pages Next.js à partir du cahier des charges ;
- la conception du schéma Prisma (entités, enums, index) ;
- la génération des schémas de validation Zod, alignés sur les règles de
  gestion du cahier des charges ;
- la détection et la correction de bugs (erreurs de typage TypeScript en
  build, incompatibilités de version Prisma, augmentation de types
  Auth.js) ;
- la vérification des points de contrôle d'accès, de propriété des
  données et de sécurité (rôles, ownership des réservations) ;
- la rédaction de ce README.

Toutes les fonctionnalités ont été testées de bout en bout pendant le
développement (authentification, contrôle de rôle par middleware, création
de réservation avec rejet des conflits/capacité dépassée/accès non
authentifié, CRUD chambres, protection RG-10/RG-11) via des appels API
réels sur une base de données locale, et non uniquement par lecture du
code. Le développeur reste responsable des décisions finales et de la
compréhension du fonctionnement du projet (disponibilité, sécurité, calcul
du prix).

## Choix techniques et limites connues

- **Prisma 6 plutôt que 7** : Prisma 7 (sorti au moment du projet) impose
  une nouvelle architecture par adaptateurs et supprime l'URL de connexion
  du `schema.prisma`. Pour rester sur le flux `migrate`/`seed` classique
  attendu par le cahier des charges dans un délai de 48h, le projet est
  volontairement figé sur Prisma 6.
- **Upload Cloudinary** : l'intégration est fonctionnelle côté code (route
  `/api/upload`, contrôle de type/taille) mais nécessite des identifiants
  Cloudinary réels en variables d'environnement pour fonctionner en
  pratique.
- **Chambre en vedette / témoignages** : page d'accueil revalidée toutes
  les 60 secondes (ISR) plutôt que rendue à chaque requête, ce contenu
  étant peu volatile ; la disponibilité des chambres et les réservations
  ne sont jamais mises en cache.
- **Paiement Stripe en mode test** : le paiement (100 % du montant, plus
  d'acompte) n'intervient qu'après validation de la demande par l'admin,
  via une Checkout Session Stripe. Le montant est calculé côté serveur à
  partir de `booking.totalPrice` en base, jamais transmis par le client.
  Le statut `PAID` n'est positionné que par le webhook Stripe
  (`checkout.session.completed`, signature vérifiée) — aucune route
  cliente ne peut le déclencher directement. Le mode test Stripe est
  utilisé volontairement (établissement fictif, cf. mentions légales) :
  aucune carte réelle n'est débitée, cartes de test uniquement
  (`4242 4242 4242 4242`).
- **E-mails transactionnels réels (Resend)** : notification envoyée au
  client à la validation (résumé + lien de paiement) et au refus d'une
  demande. L'envoi est non bloquant : un échec (ex. restriction du mode
  sandbox Resend, qui limite l'envoi à l'adresse du compte tant qu'aucun
  domaine n'est vérifié) est logué mais n'empêche jamais la mise à jour
  du statut de la réservation.
- **Remboursement sous 24h (simulé)** : uniquement pour une réservation
  déjà payée. L'annulation positionne un statut de remboursement
  (`refundStatus`) et une échéance à 24h (`refundDueAt`) ; l'administrateur
  marque le remboursement comme effectué une fois le virement réalisé hors
  plateforme (aucun remboursement Stripe automatisé — non demandé par le
  cahier des charges d'évolution).
- Le chiffre d'affaires du tableau de bord admin compte uniquement les
  réservations au statut `PAID` (argent réellement perçu via Stripe), pas
  les réservations simplement validées.
- **Désactivation/suppression de compte** (Could Have) non implémentée,
  conformément à la stratégie de repli du cahier des charges en cas de
  contrainte de temps.

## Auteur

Sodokin — Formation Développeur Natif IA Web, LeDevFred Academy, 2026.
