# Utiliser une image Node.js officielle comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./
# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers du projet dans le répertoire de travail
COPY index.js ./
COPY apiKey.js ./ 

COPY test/ ./test/

# Exposer le port que votre application utilise (par exemple, 3000 pour Express)
EXPOSE 3000

# Définir la commande par défaut pour exécuter l'application
CMD [ "node", "index.js" ]