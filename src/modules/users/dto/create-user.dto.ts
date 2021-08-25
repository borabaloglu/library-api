import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@Length(1, 256)
	name: string;
}
