import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
class CustomExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.status || 500;

		response.status(status).json({
			name: exception.name,
			message: exception.message,
		});
	}
}

export const GlobalExceptionFilter = new CustomExceptionFilter();
