FROM node:16
LABEL maintainer="Chaima saadallah <chaima.saadallah@esprit.tn>" 
#les cordonnées d'author" 
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
USER node
COPY package*.json ./
RUN npm install --production
COPY  . .
EXPOSE 9090
CMD ["node" , "server.js"]