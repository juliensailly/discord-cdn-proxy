FROM node:14

# Installer git
RUN apt-get update && apt-get install -y git

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Cloner le dépôt Git
RUN git clone https://github.com/juliensailly/proxy-app-no-restrictions.git .

# Installer les dépendances
RUN npm install

# Exposer le port 80
EXPOSE 80

# Démarrer l'application
CMD ["node", "server.js"]