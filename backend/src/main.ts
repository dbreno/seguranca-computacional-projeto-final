import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

/**
 * Função principal para inicializar a aplicação NestJS.
 * 
 * Esta função realiza as seguintes operações:
 * - Cria uma instância da aplicação utilizando o módulo principal `AppModule`.
 * - Habilita o CORS (Cross-Origin Resource Sharing) para permitir requisições de diferentes origens.
 * - Configura a documentação da API utilizando o Swagger, incluindo:
 *   - Título, descrição e versão da API.
 *   - Autenticação via Bearer Token.
 *   - Tema personalizado para a interface do Swagger.
 * - Define o endpoint `/api` para acessar a documentação da API.
 * - Inicia o servidor na porta especificada pela variável de ambiente `PORT` ou na porta padrão 3000.
 * 
 * @async
 * @function bootstrap
 * @returns {Promise<void>} Uma Promise que é resolvida quando o servidor é iniciado.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Brute Force Blocker')
    .setDescription('The Brute Force Blocker description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    customSiteTitle: 'Brute Force Blocker',
  };
  SwaggerModule.setup('api', app, document, options);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
