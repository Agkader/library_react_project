# 📚 Ma Biblio - Application de Recherche de Livres

* Projet : Ma Biblio - Application de Recherche de Livres react 
* Date : 31 Janvier 2026
* Présenté par : Abdoul Gamiyou , Abdoul Rahim 
* lien github :

Une application React moderne permettant de rechercher, filtrer et consulter les détails de millions de livres via l'API OpenLibrary, enrichie par les contenus encyclopédiques de Wikipedia.

Ce projet a été réalisé dans le cadre du module Frontend.

##  Fonctionnalités

* Page d'accueil dynamique : Affichage des livres "Tendances du jour".
* Recherche Rapide (Quick Search) : Barre de recherche avec autocomplétion instantanée (Debounce).
* Recherche Avancée : Filtres par Titre, Auteur, Sujet (Genre) et ISBN.
* Fiche Détaillée : Affichage de la couverture, des informations bibliographiques ET du résumé provenant de Wikipedia.
* Performance :Utilisation de cache (TanStack Query) pour éviter les rechargements inutiles.

## Technologies Utilisées

* React + TypeScript (Vite) : Pour la robustesse et la rapidité.
* TanStack Query (React Query) : Gestion du cache serveur et des états de chargement.
* React Router DOM : Gestion de la navigation (SPA).
* Vitest : Tests unitaires et d'intégration.
* API OpenLibrary & Wikipedia :Sources de données.

---

## Installation et Lancement

Suivez ces étapes pour lancer le projet sur votre machine.

### 1. Prérequis
Assurez-vous d'avoir **Node.js** installé sur votre ordinateur.

### 2. Installation
Ouvrez un terminal à la racine du projet et installez les dépendances :

```bash
npm install
```
## Tests 
Le projet inclut des tests d'intégration pour valider le fonctionnement des composants critiques sans dépendre de la connexion internet.

* Lancer les tests
Pour exécuter la suite de tests avec Vitest :

```Bash
npm run test
```
* Ce qui est testé
Nous nous concentrons sur les tests d'intégration de la page de détail (BookPage). Le test vérifie le scénario utilisateur suivant :

Affichage de l'état de chargement (Loading state).

Récupération et affichage des données du livre (Mocking OpenLibrary).

Récupération séquentielle et affichage de la description (Mocking Wikipedia).

Les appels API sont mockés (simulés) grâce à vi.mock, ce qui garantit que les tests sont rapides et stables.
