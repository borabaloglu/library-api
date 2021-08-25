import * as validator from 'class-validator';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MissingRecordError } from 'src/shared/errors/database.error';

import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

import { BooksService } from 'src/modules/books/books.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly booksService: BooksService,
	) {}

	async findAll(): Promise<User[]> {
		return this.userModel.find();
	}

	async findOneById(id: number): Promise<User> {
		const user = await this.userModel.findById(id);

		if (!validator.isDefined(user)) {
			throw new MissingRecordError();
		}

		const userBooks = {
			past: await this.booksService.findReturnedBookBorrowingsOfUser(id),
			present: await this.booksService.findActiveBookBorrowingsOfUser(id),
		};

		user.set('books', userBooks, { strict: false });

		return user;
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const createdUser = new this.userModel();

		createdUser.name = createUserDto.name;

		return createdUser.save();
	}
}
