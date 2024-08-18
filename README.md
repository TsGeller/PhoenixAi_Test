# Image Resizer API

## Description

Cette application Express permet de redimensionner des images en utilisant la bibliothèque [Sharp](https://github.com/lovell/sharp). L'application offre des endpoints pour redimensionner des images et tester les fonctionnalités via une clé API.

## Fonctionnalités

- Redimensionner des images au format JPEG, PNG ou GIF.
- Protéger certaines routes avec une clé API.
- Tester les routes de l'API avec [AVA](https://github.com/avajs/ava) et [Supertest](https://github.com/visionmedia/supertest).

## Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation

## Installer les dépendances

- npm install

## Démarrer le serveur

- node .

## Créer l'image Docker

- docker build -t image-resizer .

## Lancer le conteneur

- docker run -p 3000:3000 image-resizer

## Lancer les tests

- npm test

## Routes accessibles

- '/'
- '/image'
- '/imageWithKey
