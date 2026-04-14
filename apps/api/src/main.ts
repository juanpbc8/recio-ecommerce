import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Recio Ecommerce API')
    .setDescription('Documentación de la API para el ecommerce Recio')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ruta donde se verá la documentación: http://localhost:PORT/docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
