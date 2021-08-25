import * as validator from 'class-validator';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AlreadyBorrowedError, NotBorrowedError } from 'src/shared/errors/book.error';
import { MissingRecordError } from 'src/shared/errors/database.error';

import { CreateBookDto } from 'src/modules/books/dto/create-book.dto';
import { ReturnBookDto } from 'src/modules/books/dto/return-book.dto';

import { Book, BookDocument } from 'src/modules/books/schemas/book.schema';
import {
	BookBorrowing,
	BookBorrowingDocument,
} from 'src/modules/books/schemas/book-borrowing.schema';

@Injectable()
export class BooksService {
	constructor(
		@InjectModel(Book.name) private bookModel: Model<BookDocument>,
		@InjectModel(BookBorrowing.name) private bookBorrowingModel: Model<BookBorrowingDocument>,
	) {}

	async findAll(): Promise<Book[]> {
		return this.bookModel.find().select(['-score', '-numberOfScores']);
	}

	async findOneById(id: number): Promise<Book> {
		const book = await this.bookModel.findById(id);

		if (!validator.isDefined(book)) {
			throw new MissingRecordError();
		}

		return book;
	}

	async findReturnedBookBorrowingsOfUser(userId: number): Promise<BookBorrowing[]> {
		const bookBorrowings = await this.bookBorrowingModel
			.find({ userId, isReturned: true })
			.select(['-isReturned', '-userId'])
			.populate('book', ['name']);

		return bookBorrowings.map((bookBorrowing) => {
			const bookName = (bookBorrowing.book as Book).name;
			bookBorrowing.set('name', bookName, { strict: false });
			bookBorrowing.set('book', undefined);
			return bookBorrowing;
		});
	}

	async findActiveBookBorrowingsOfUser(userId: number): Promise<BookBorrowing[]> {
		const bookBorrowings = await this.bookBorrowingModel
			.find({ userId, isReturned: false })
			.select(['-userScore', '-isReturned', '-userId'])
			.populate('book', ['name']);

		return bookBorrowings.map((bookBorrowing) => {
			const bookName = (bookBorrowing.book as Book).name;
			bookBorrowing.set('name', bookName, { strict: false });
			bookBorrowing.set('book', undefined);
			return bookBorrowing;
		});
	}

	async create(createBookDto: CreateBookDto): Promise<Book> {
		const createdBook = new this.bookModel();

		createdBook.name = createBookDto.name;

		return createdBook.save();
	}

	async updateScore(bookId: number, userScore: number): Promise<void> {
		const book = (await this.findOneById(bookId)) as BookDocument;

		const incrementedNumberOfScores = book.numberOfScores + 1;
		book.score = (book.score * book.numberOfScores + userScore) / incrementedNumberOfScores;
		book.numberOfScores = incrementedNumberOfScores;

		await book.save();
	}

	async canUserBorrowBook(bookId: number, userId: number): Promise<void> {
		const borrowedBook = await this.bookBorrowingModel.findOne({ book: bookId, userId });
		if (validator.isDefined(borrowedBook) && !borrowedBook.isReturned) {
			throw new AlreadyBorrowedError();
		}
	}

	async borrow(bookId: number, userId: number): Promise<BookBorrowing> {
		const book = await this.findOneById(bookId);
		await this.canUserBorrowBook(bookId, userId);

		const bookBorrowing = new this.bookBorrowingModel();

		bookBorrowing.userId = userId;
		bookBorrowing.book = book;

		return bookBorrowing.save();
	}

	async return(
		bookId: number,
		userId: number,
		returnBookDto: ReturnBookDto,
	): Promise<BookBorrowing> {
		const bookBorrowing = await this.bookBorrowingModel.findOne({
			book: bookId,
			userId,
			isReturned: false,
		});

		if (!validator.isDefined(bookBorrowing)) {
			throw new NotBorrowedError();
		}

		bookBorrowing.isReturned = true;
		bookBorrowing.userScore = returnBookDto.score;

		await bookBorrowing.save();

		await this.updateScore(bookId, bookBorrowing.userScore);

		return bookBorrowing;
	}
}
