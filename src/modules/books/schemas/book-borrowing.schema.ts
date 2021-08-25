import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Book } from 'src/modules/books/schemas/book.schema';

export type BookBorrowingDocument = BookBorrowing & Document;

@Schema({
	versionKey: false,
	collection: 'book_borrowing',
})
export class BookBorrowing {
	@Prop({ Type: MongooseSchema.Types.Number })
	_id: number;

	@Prop({ type: MongooseSchema.Types.Number, required: true })
	userId: number;

	@Prop({ type: MongooseSchema.Types.Number, ref: Book.name })
	book: Book | number;

	name: string;

	@Prop({ type: MongooseSchema.Types.Boolean, required: true, default: false })
	isReturned: boolean;

	@Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
	userScore: number;
}

const BookBorrowingSchema = SchemaFactory.createForClass(BookBorrowing);

BookBorrowingSchema.set('toJSON', {
	transform: function (doc, ret) {
		delete ret._id;
	},
});

export { BookBorrowingSchema };
