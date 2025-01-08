/* eslint-disable prettier/prettier */
// The entry file of the application which uses the core function NestFactory to create a Nest application instance.
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
//   console.log("Nest Running on Port 3000");
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific configuration
  app.enableCors({
    origin: 'https://duckdb-nestjs.netlify.app', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (e.g., cookies)
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Nest Running on Port ${port}`);
}
bootstrap();
