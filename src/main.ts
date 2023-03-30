import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DOCUMENTACIÓN')
    .setDescription(
      'Documentación de proyecto para gestión de estudiantes de medicina en internado',
    )
    .setVersion('1.0')
    .addTag('API')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api_documentation', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
