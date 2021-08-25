import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { BookBorrowing } from 'src/modules/books/schemas/book-borrowing.schema';

export type UserDocument = User & Document;

@Schema({
	versionKey: false,
})
export class User {
	@Prop({ Type: MongooseSchema.Types.Number })
	_id: number;

	@Prop({
		type: MongooseSchema.Types.String,
		required: true,
	})
	name: string;

	books: {
		past: BookBorrowing[];
		present: BookBorrowing[];
	};
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
	transform: function (doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

export { UserSchema };
