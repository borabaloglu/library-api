export class AlreadyBorrowedError extends Error {
	readonly name = 'AlreadyBorrowedError';
	readonly status = 500;

	constructor() {
		super();
		this.message = `This book is already borrowed`;
	}
}

export class NotBorrowedError extends Error {
	readonly name = 'NotBorrowedError';
	readonly status = 500;

	constructor() {
		super();
		this.message = `This book is not borrowed`;
	}
}
