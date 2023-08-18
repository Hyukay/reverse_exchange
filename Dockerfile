FROM node:latest as builder

# Spécifier la localisation du working directory dans le container
WORKDIR /usr/src

# Copy du fichier package.json and yarn.lock dans le working directory du container
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add @thirdweb-dev/sdk@latest
COPY . .

RUN yarn build

FROM node:latest as runner

# Spécifier la localisation du working directory dans le container
WORKDIR /usr/src

COPY --from=builder /usr/src/package.json .
COPY --from=builder /usr/src/yarn.lock .
COPY --from=builder /usr/src/next.config.js ./
COPY --from=builder /usr/src/public ./public
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/public ./.next

# Enlever la Télémétrie pour rendre le build plus rapide
ENV NEXT_TELEMETRY_DISABLED 1

# Exposition des ports que Next.js utilise
EXPOSE 3000

# Start l'application
CMD ["yarn", "start"]
#
#FROM node:latest
#
## Spécifier la localisation du working directory dans le container
#WORKDIR /usr/src/app
#
## Copy du fichier package.json and yarn.lock dans le working directory du container
#COPY package.json yarn.lock ./
#
## Installatio ndes dépendences
#RUN yarn install
#
## Copy le reste du code de l'application dans le working directory du container
#COPY . .
#
## Enlever la Télémétrie pour rendre le build plus rapide
#ENV NEXT_TELEMETRY_DISABLED 1
#
## Build l'appli Next.js
##RUN yarn build
#
## Exposition des ports que Next.js utilise
#EXPOSE 3000
#
## Start l'application
#CMD ["yarn", "start"]