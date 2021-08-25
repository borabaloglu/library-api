import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import databaseConfig from 'src/shared/config/database.config';

import { AutoIncrement } from 'src/shared/plugin/auto-increment.plugin';

import { BooksModule } from 'src/modules/books/books.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
	imports: [
		MongooseModule.forRoot(databaseConfig.uri, {
			connectionFactory: (connection) => {
				AutoIncrement.setPlugin(require('mongoose-sequence')(connection));
				return connection;
			},
		}),
		BooksModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
