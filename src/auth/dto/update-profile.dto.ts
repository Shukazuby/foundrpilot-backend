import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Chen' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;
}
