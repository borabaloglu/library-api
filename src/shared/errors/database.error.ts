export class MissingRecordError extends Error {
	readonly name = 'MissingRecordError';
	readonly status = 404;

	constructor() {
		super();
		this.message = `There aren't any records that match the given information.`;
	}
}
