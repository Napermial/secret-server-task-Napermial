FROM node:16.13.2-alpine3.14 AS base

# Create app directory
RUN mkdir -p /usr/src/app/.nuxt
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/

# BUILD STAGE
FROM base AS BUILD

# Install all dependencies
RUN npm i

# Set environment variables
ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

# Bundle app source
COPY . /usr/src/app

# Build command
RUN npm run build

# PRODUCTION STAGE
FROM base AS prod
COPY --from=BUILD /usr/src/app/.nuxt/ /usr/src/app/.nuxt/

# Set environment variables again to ensure
ENV NODE_ENV production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000

# Bundle app source
COPY . /usr/src/app

# Installing needed packages only and clearing cache
RUN npm install --only=production && \
    npm cache clean --force
EXPOSE 3000
CMD [ "npm", "start" ]
