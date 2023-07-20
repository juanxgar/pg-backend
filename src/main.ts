import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('GRADUATION PROJECT DOCUMENTATION')
    .setDescription(
      'Project documentation for the management of medical students in internships. \nMade by Juan Diego Garcia Escoobar',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api_documentation', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationSorter: 'alpha',
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
