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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // إعداد Swagger
  const config = new DocumentBuilder()
    .setTitle('')
    .setDescription('SAC Registration API documentation')
    .setVersion('0.1')
    .addBearerAuth() // نصيحة: أضف هذا إذا كنت ستستخدم JWT لاحقاً
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // تغيير المسار إلى 'docs' لتجنب التداخل مع 'api'
  SwaggerModule.setup('docs', app, document);

  // تصحيح استدعاء المنفذ: نداء واحد فقط يكفي
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`📑 Swagger UI available on: http://localhost:${port}/docs`);
}

bootstrap();
