export class InvalidInputError extends Error {
	readonly name = 'InvalidInputError';
	readonly status = 400;

	constructor(message: string) {
		super();
		this.message = message;
	}
}
