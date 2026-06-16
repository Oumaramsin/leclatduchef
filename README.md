# L'Éclat du Chef - Traiteur Événementiel

Ce projet contient le site web vitrine de L'Éclat du Chef ainsi qu'un serveur backend (en Node.js/TypeScript) pour gérer l'envoi sécurisé des demandes de devis et la vérification du reCAPTCHA.

## Prérequis

- **Node.js** (version 16 ou supérieure recommandée)
- Un compte **Gmail** pour l'envoi des emails
- Une paire de clés **Google reCAPTCHA v2**

## Installation

1. Installez les dépendances du projet :
   ```bash
   npm install
   ```

## Configuration de l'environnement (.env)

Pour des raisons de sécurité, les mots de passe et clés API ne doivent jamais être inscrits en clair dans le code ou partagés publiquement. Ils sont stockés dans un fichier `.env`.

1. Copiez le fichier `.env.example` et renommez-le en `.env`.
2. Ouvrez le fichier `.env` et remplissez les champs suivants :

- `EMAIL_USER` : L'adresse Gmail qui va servir à expédier les emails (ex: `votre_email@gmail.com`).
- `EMAIL_PASS` : Le "Mot de passe d'application" généré depuis votre compte Google (Ce n'est pas le mot de passe habituel de votre boîte mail !).
   - *Pour le créer : Allez dans votre compte Google > Sécurité > Validation en deux étapes > Mots de passe des applications.*
- `RECAPTCHA_SITE_KEY` : Votre clé **Publique** Google reCAPTCHA v2 (aussi appelée Clé du Site).
- `RECAPTCHA_SECRET_KEY` : Votre clé **Secrète** Google reCAPTCHA v2.
   - *Comment les obtenir : Allez sur la [Console Google reCAPTCHA](https://www.google.com/recaptcha/admin/create), créez un nouveau site avec le type "reCAPTCHA v2" (Case à cocher "Je ne suis pas un robot"). Google vous fournira ces 2 clés.*

*(Note : Le serveur backend va automatiquement récupérer la `RECAPTCHA_SITE_KEY` dans votre fichier `.env` pour l'injecter au bon endroit dans le code HTML au moment où un visiteur charge la page, vous n'avez rien à modifier manuellement dans les fichiers du site).*

## Démarrage du projet

Le projet utilise un seul serveur unifié (`contact.ts`) qui se charge à la fois d'afficher le site web et de traiter l'envoi des emails.

### Lancer le site en local (sur votre machine)

1. Ouvrez un terminal dans le dossier du projet.
2. Assurez-vous d'avoir installé les dépendances si ce n'est pas déjà fait (`npm install`).
3. Lancez le serveur unifié avec la commande suivante :
   ```bash
   npx tsx contact.ts
   ```
4. Ouvrez votre navigateur internet et allez sur l'adresse suivante : **[http://localhost:3000](http://localhost:3000)**


