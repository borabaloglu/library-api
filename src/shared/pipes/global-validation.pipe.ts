import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { InvalidInputError } from 'src/shared/errors/validation.error';

export const GlobalValidationPipe = new ValidationPipe({
	transform: true,
	whitelist: true,
	exceptionFactory: (validationErrors: ValidationError[]) => {
		const errorMessages: string[] = [];
		validationErrors.forEach((error: ValidationError) => {
			Object.keys(error.constraints).forEach((key: string) => {
				errorMessages.push(error.constraints[key]);
			});
		});
		return new InvalidInputError(errorMessages.join(','));
	},
});
