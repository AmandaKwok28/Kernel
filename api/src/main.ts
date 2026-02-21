import { NestFactory } from '@nestjs/core'; // a factory of methods for the Nest application
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],                        // frontend dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],       // allowed CRUD operations
    credentials: true,                                        // allows cookies or auth headers to be sent with the request
  });
  await app.listen(process.env.PORT ?? 3000);
}

// bootstrap = start the app and init everything it needs to run
bootstrap();
