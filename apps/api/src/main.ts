/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  // =========================
  // SECURITY MIDDLEWARES
  // =========================
  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 min
  app.use(cookieParser());

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // =========================
  // VALIDATION PIPE
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =========================
  // STATIC FILES (UPLOADS)
  // =========================
  // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // =========================
  // SWAGGER SETUP
  // =========================
  const config = new DocumentBuilder()
    .setTitle('PRMS API')
    .setDescription('SAC Registration API documentation')
    .setVersion('0.1')
    .addBearerAuth() // نصيحة: أضف هذا إذا كنت ستستخدم JWT لاحقاً
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // تغيير المسار إلى 'docs' لتجنب التداخل مع 'api'
  SwaggerModule.setup('docs', app, document);

  // =========================
  // CORS ENABLED
  // =========================
  app.enableCors({
    origin: ['http://localhost:3001'], // السماح فقط من هذا المصدر
    credentials: true, // السماح بإرسال الكوكيز
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // السماح بكل الطرق
  });

  // =========================
  // START SERVER
  // =========================
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`📑 Swagger UI available on: http://localhost:${port}/docs`);
}

bootstrap();
