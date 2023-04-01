FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./

## dev ##
FROM base AS dev
RUN npm i --frozen-lockfile
COPY . .
CMD ["npm", "run", "start:dev"]


## prod ##
FROM base AS prod
RUN npm ci --frozen-lockfile
COPY . .
RUN npm run build 
CMD ["npm", "run", "start:prod"]