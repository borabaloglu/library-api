import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class ReturnBookDto {
	@Transform(({ value }: { value: string | number }) => +value)
	@IsNumber()
	@Min(0)
	@Max(10)
	score: number;
}
