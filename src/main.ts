import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new (AuthGuard('jwt'))());
  app.enableCors(); 
  await app.listen(3000);
}
bootstrap();
