<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="images/nestjs.png" alt="Nest Logo" width="512" /></a>
</p>

<h1 align="center">⭐ Getting movie info from IMDB api⭐</h1>

<p align="center">
  Template for new services based on NestJS with the Best Practices and Ready for Production
</p>

## Goal

Query IMDB api for movie details and generate pdf with relevant information

## 🌟 Stack

1. NestJS
2. ⚡️ Use [Fastify](https://fastify.dev/) as Web Framework for Performance
3. 🐶 Integration with [husky](https://typicode.github.io/husky/) to ensure we have good quality and conventions
4. 🧪 Testing with [Vitest](https://vitest.dev/) and [supertest](https://github.com/ladjs/supertest) for unit and e2e tests.
5. Yarn for performance

## 🧑‍💻 Deploying

First, we will need to create our .env file, we can create a copy from the example one:

```bash
cp .env.example .env
```

The project is fully dockerized 🐳, if we want to start the app in **development mode**, we just need to run:

```bash
docker-compose up -d imdb
```

This development mode will work with **hot-reload** and expose a **debug port**, port `9229`, so later we can connect to it from our editor.

Now, you should be able to start debugging configuring using your IDE. For example, if you are using vscode, you can create a `.vscode/launch.json` file with the following configuration:

```json
{
  "version": "0.1.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to docker",
      "restart": true,
      "port": 9229,
      "remoteRoot": "/app"
    }
  ]
}
```

This service is providing just a health endpoint which you can call to verify the service is working as expected:

```bash
curl --request GET \
  --url http://localhost:3000/health
```

If you want to stop developing, you can stop the service running:

```bash
docker-compose down
```

## ✅ Testing

The service provide different scripts for running the tests, to run all of them you can run:

```bash
yarn test
```

If you are interested just in the unit tests, you can run:

```bash
yarn test:unit
```

Or if you want e2e tests, you can execute:

```bash
yarn test:e2e
```

## 💅 Linting

To run the linter you can execute:

```bash
yarn lint
```

And for trying to fix lint issues automatically, you can run:

```bash
yarn lint:fix
```

## RoadMap

Introduce clickable navigational arrows on pdf which will direct to the next page for a fresh new list

Rate-limiting on api

reconstruct pdf-tool class to be dynamic

testing
