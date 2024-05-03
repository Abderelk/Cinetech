# Cinetech 🎬🍿

Cinetech est un projet passionnant qui vise à créer une plateforme de gestion de films complète. Il permet d'importer et de synchroniser des films à partir d'un fichier Excel dans une base de données MongoDB, ainsi que de gérer les utilisateurs, les films et les fonctionnalités associées via une API REST en Node.js.

## Fonctionnalités 🕹️

- Importation et synchronisation de films à partir d'un fichier Excel.
- API RESTful pour la gestion des utilisateurs et des films.
- Système de connexion/inscription sécurisé.
- Ajout de films dans différentes catégories telles que favoris, vus, à voir.
- Système de suggestions de films basé sur la géolocalisation.

## Configuration ⚙️

Avant de lancer le projet, assurez-vous de suivre ces étapes de configuration :

1. **Génération de la clé API TMDB** : Obtenez votre clé API TMDB sur [TMDB](https://www.themoviedb.org/). Cette clé est nécessaire pour accéder aux données de films.

2. **Création du fichier `.env`** : Ajoutez un fichier `.env` dans le dossier backend avec les variables suivantes :
PORT= // Port du serveur backend
TOKEN=YOUR_TOKEN // Clé API TMDB
MONGO_URI=YOUR_MONGO_URI // URI de la base de données MongoDB

3. **Installation des dépendances :
Utilisez npm install dans le dossier backend pour installer les dépendances nécessaires au serveur. Répétez cette étape dans le dossier frontend pour installer les dépendances du client.

## Lancement du projet 🚀

Pour lancer le serveur backend, exécutez la commande suivante dans le dossier backend :
npm start 

Pour lancer le client frontend, exécutez la commande suivante dans le dossier frontend :
npm run dev

## Besoin d'aide ? 😁

Si vous avez des questions ou besoin d'aide, n'hésitez pas à me contacter par email à abderrahmanelkafif@gmail.com. Je serai ravi de vous aider !
