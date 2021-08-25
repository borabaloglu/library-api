import { NestFactory } from '@nestjs/core';

import envConfig from './shared/config/env.config';

import { AppModule } from 'src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	await app.listen(envConfig.port);
}
bootstrap();
