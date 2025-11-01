import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new (AuthGuard('jwt'))());
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    allowedHeaders: ['authorization', 'content-type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
