import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ReturnBookDto } from 'src/modules/books/dto/return-book.dto';

import { User } from 'src/modules/users/schemas/user.schema';

import { BooksService } from 'src/modules/books/books.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly booksService: BooksService,
	) {}

	@Get('/')
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get('/:id')
	async findOneById(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.usersService.findOneById(id);
	}

	@Post('/')
	async create(@Body() createUserDto: CreateUserDto): Promise<void> {
		await this.usersService.create(createUserDto);
	}

	@Post('/:userId/borrow/:bookId')
	@HttpCode(204)
	async borrowBook(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('bookId', ParseIntPipe) bookId: number,
	): Promise<void> {
		await this.booksService.borrow(bookId, userId);
	}

	@Post('/:userId/return/:bookId')
	@HttpCode(204)
	async returnBook(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('bookId', ParseIntPipe) bookId: number,
		@Body() returnBookDto: ReturnBookDto,
	): Promise<void> {
		await this.booksService.return(bookId, userId, returnBookDto);
	}
}
