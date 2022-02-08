# Secret sharing server with Nuxt and Express.js 

> [ExpressJS](http://expressjs.com/) + [Nuxt.js](https://nuxtjs.org) = 😁

## Installation

docker-compose:
check to have docker installed, for Windows and Mac docker desktop includes docker compose.
for linux please follow the instructions at https://docs.docker.com/compose/install/

after cloning the repository and pasting the .env file, app can start with

```bash
 docker-compose up
```

Docker

An old fashioned Dockerfile is also provided - from my experience running the image from docker desktop resulted 
in better performance for it is a production build of the project. for this path

```bash
docker build . -t napermial/secret-server-task
```
this will create the image named napermial/secret-server-task and it will be available to run with

```bash
docker run -it -p 5000:5000 napermial/secret-server-task
```

in both cases the app is available from localhost:3000


## Licenses

- [ExpressJS license](https://github.com/expressjs/express/blob/master/LICENSE)
- [NuxtJS license](https://github.com/nuxt/nuxt.js/blob/master/LICENSE.md)
- [VueJS license](https://github.com/vuejs/vue/blob/master/LICENSE)


