import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({
	versionKey: false,
	collection: 'books',
})
export class Book {
	id: number;

	@Prop({ Type: MongooseSchema.Types.Number })
	_id: number;

	@Prop({ type: MongooseSchema.Types.String, required: true })
	name: string;

	@Prop({ type: MongooseSchema.Types.Number, required: true, default: -1 })
	score: number;

	@Prop({ type: MongooseSchema.Types.Number, required: true, default: 0 })
	numberOfScores: number;
}

const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.set('toJSON', {
	transform: function (doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

export { BookSchema };
