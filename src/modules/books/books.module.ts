import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AutoIncrement } from 'src/shared/plugin/auto-increment.plugin';

import { BooksController } from 'src/modules/books/books.controller';

import { Book, BookSchema } from 'src/modules/books/schemas/book.schema';
import {
	BookBorrowing,
	BookBorrowingSchema,
} from 'src/modules/books/schemas/book-borrowing.schema';

import { BooksService } from 'src/modules/books/books.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Book.name,
				useFactory: () => {
					const schema = BookSchema;
					schema.plugin(AutoIncrement.plugin, { inc_field: '_id', id: 'books_id_seq' });
					return schema;
				},
			},
			{
				name: BookBorrowing.name,
				useFactory: () => {
					const schema = BookBorrowingSchema;
					schema.plugin(AutoIncrement.plugin, { inc_field: '_id', id: 'book_borrowing_id_seq' });
					return schema;
				},
			},
		]),
	],
	controllers: [BooksController],
	providers: [BooksService],
	exports: [BooksService],
})
export class BooksModule {}
