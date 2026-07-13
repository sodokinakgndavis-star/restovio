# Script — Vidéo de démonstration Restovio

Durée cible : **5 à 10 minutes**. Enregistre ton écran (OBS, ou l'enregistreur
Windows `Win+Alt+R`) sur `https://restovio.vercel.app`, pas en local — le
jury doit voir la version réellement déployée.

Ouvre deux fenêtres de navigateur à l'avance (une normale, une en navigation
privée) pour basculer rapidement entre les rôles sans te déconnecter/reconnecter
à chaque fois.

---

## 0:00 – 0:45 — Introduction

*(Visage ou juste voix off sur l'écran d'accueil)*

> « Bonjour, je m'appelle Sodokin. Voici Restovio, une plateforme de
> réservation et de gestion hôtelière que j'ai développée en 48 heures dans
> le cadre de ma formation Développeur Natif IA Web chez LeDevFred Academy.
> Le projet est en Next.js, TypeScript, Prisma, PostgreSQL et Auth.js,
> déployé sur Vercel avec une base de données Neon. »

---

## 0:45 – 2:30 — Partie publique

1. Page d'accueil : montre le hero, la présentation, la galerie, **les
   services** (petit-déjeuner gratuit, véhicules pour les sorties, salle de
   cinéma du vendredi soir, piscines adultes/enfants), les témoignages.
2. Clique sur **Chambres** → montre le catalogue.
3. Utilise les **filtres** : dates, catégorie, prix — montre que les
   résultats se mettent à jour.
4. Clique sur une chambre → page de détail : galerie photos, équipements,
   capacité, badge de disponibilité.
5. **Point fonctionnalité additionnelle** : ouvre `/restaurant`, montre le
   menu (entrées/plats/desserts/boissons) et le bloc de réservation de
   table « dîner en famille, vue piscine ».

---

## 2:30 – 4:30 — Parcours client

1. Clique sur **Réserver** sans être connecté → montre la redirection vers
   la connexion (sécurité : impossible de réserver sans compte).
2. Inscris-toi avec un nouveau compte (email jamais utilisé).
3. Retourne sur une chambre, choisis des **dates invalides** (départ avant
   arrivée, ou plus de personnes que la capacité) → montre le message
   d'erreur.
4. Choisis des dates valides → montre l'**estimation en direct** avec
   l'acompte de 50 % et le solde à régler sur place.
5. *(Optionnel, fort effet)* Choisis un séjour de **30 nuits ou plus** →
   montre la remise automatique de -30 % affichée.
6. Valide la réservation → montre la confirmation.
7. Va dans **Mon compte → Mes réservations** → montre le statut « En
   attente », le montant, l'acompte.

---

## 4:30 – 5:30 — Annulation et remboursement

1. Annule la réservation que tu viens de créer.
2. Montre le message : remboursement de l'acompte prévu sous 24h.
3. *(Précise à l'oral)* « Comme le projet n'intègre pas de paiement réel,
   ce remboursement est simulé et suivi dans l'interface — l'administrateur
   le marque comme effectué une fois le virement réalisé hors plateforme. »

---

## 5:30 – 7:30 — Espace administrateur

*(Connecte-toi avec le compte admin dans l'autre fenêtre)*

1. Tableau de bord : montre les indicateurs (chambres, occupation,
   réservations du jour/mois, chiffre d'affaires simulé, graphique).
2. **Chambres** : crée une chambre rapidement avec upload d'une photo,
   montre qu'elle apparaît côté public.
3. **Réservations** : trouve une réservation « En attente », confirme-la.
4. **Menu** : montre l'ajout/modification d'un plat.
5. **Tables** : montre la liste des réservations de table, confirme-en une.
6. **Utilisateurs** : montre la liste, le changement de rôle.

---

## 7:30 – 8:30 — Démonstration de sécurité

1. Dans la fenêtre où tu es connecté en **client**, tape directement l'URL
   `/admin` dans la barre d'adresse.
2. Montre que l'accès est **refusé côté serveur** (redirection immédiate),
   pas juste un lien caché dans l'interface.
3. *(Optionnel)* Ouvre les outils développeur → onglet Réseau, refais
   l'action, montre le code retourné par le serveur (redirection 307) pour
   prouver que la protection n'est pas seulement visuelle.

---

## 8:30 – 9:15 — Responsive

1. Ouvre les outils développeur (`F12`) → mode responsive.
2. Passe rapidement en vue mobile sur la page d'accueil et le catalogue.
3. Montre le menu mobile (☰) qui s'ouvre correctement.

---

## 9:15 – 10:00 — Conclusion

> « Ce projet a été développé avec l'appui de Claude Code comme assistant
> IA, notamment pour la génération de la structure du projet, du schéma
> Prisma, des schémas de validation, et pour la détection de bugs. Chaque
> fonctionnalité a été testée manuellement au fil de l'eau, y compris en
> production après déploiement — 45 vérifications ont été passées avec
> succès directement sur l'environnement en ligne, documentées dans le
> README. Les principales difficultés ont été la configuration initiale
> d'Auth.js et de la base distante avec Prisma. Comme évolution future, on
> pourrait envisager un vrai système de paiement en ligne et l'envoi
> d'e-mails transactionnels réels. Merci de votre attention. »

---

## Checklist avant d'enregistrer

- [ ] Compte client de démo prêt (ou un compte fraîchement créé pendant
      la vidéo, comme montré à l'étape "Parcours client")
- [ ] Compte admin de démo prêt (`admin@restovio.app`)
- [ ] Au moins une chambre avec disponibilité sur des dates proches
- [ ] Micro testé, pas de bruit de fond
- [ ] Fenêtre de navigateur en plein écran, favoris/barres inutiles cachés
- [ ] Vidéo exportée en `.mp4`, durée entre 5 et 10 minutes
