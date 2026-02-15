import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new (AuthGuard('jwt'))());
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['authorization', 'content-type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Limitly API')
    .setDescription('The Limitly API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
