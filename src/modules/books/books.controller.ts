import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CreateBookDto } from 'src/modules/books/dto/create-book.dto';

import { Book } from 'src/modules/books/schemas/book.schema';

import { BooksService } from 'src/modules/books/books.service';

@Controller('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Get('/')
	async findAll(): Promise<Book[]> {
		return this.booksService.findAll();
	}

	@Get('/:id')
	async findOneById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
		return this.booksService.findOneById(id);
	}

	@Post('/')
	async create(@Body() createBookDto: CreateBookDto): Promise<void> {
		await this.booksService.create(createBookDto);
	}
}
