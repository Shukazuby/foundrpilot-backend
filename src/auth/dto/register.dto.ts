import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'founder@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'securePass123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiPropertyOptional({ example: 'Alex Chen' })
  @IsOptional()
  @IsString()
  name?: string;
}
