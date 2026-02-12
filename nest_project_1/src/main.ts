import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorHandlingInterceptor } from './utils/interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global error handling interceptor
  app.useGlobalInterceptors(new ErrorHandlingInterceptor());
  app.setGlobalPrefix('api/');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('ruse backend')
    .setDescription('back end te3 el m3allem')
    .setVersion('V spechiilomdichilom')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
