import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import databaseConfig from './shared/config/database.config';

import { AutoIncrement } from './shared/plugin/auto-increment.plugin';

@Module({
	imports: [
		MongooseModule.forRoot(databaseConfig.uri, {
			connectionFactory: (connection) => {
				AutoIncrement.setPlugin(require('mongoose-sequence')(connection));
				return connection;
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
