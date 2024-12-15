import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Generate OAS
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Internet Banking doc")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build()
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('doc', app, swaggerDoc)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
