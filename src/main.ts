import { NestFactory } from '@nestjs/core';

import envConfig from 'src/shared/configs/env.config';

import { GlobalExceptionFilter } from 'src/shared/filters/global-exception.filter';
import { GlobalValidationPipe } from 'src/shared/pipes/global-validation.pipe';

import { AppModule } from 'src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalFilters(GlobalExceptionFilter);
	app.useGlobalPipes(GlobalValidationPipe);

	await app.listen(envConfig.port);
}
bootstrap();
