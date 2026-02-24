import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  // Normalizar URL: remover barra final si existe
  const normalizedFrontendUrl = frontendUrl.replace(/\/$/, '');
  
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir el origen configurado (con y sin barra final)
      const allowedOrigins = [
        normalizedFrontendUrl,
        `${normalizedFrontendUrl}/`,
        'http://localhost:5173',
        'http://localhost:5174',
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
