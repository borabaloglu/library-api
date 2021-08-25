import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AutoIncrement } from 'src/shared/plugin/auto-increment.plugin';

import { UsersController } from 'src/modules/users/users.controller';

import { BooksModule } from 'src/modules/books/books.module';

import { User, UserSchema } from 'src/modules/users/schemas/user.schema';

import { UsersService } from 'src/modules/users/users.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema;
					schema.plugin(AutoIncrement.plugin, { inc_field: '_id', id: 'users_id_seq' });
					return schema;
				},
			},
		]),
		BooksModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
