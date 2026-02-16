import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateReportDto {
  @ApiProperty() @IsString() ideaDescription: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetAudience?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currentStage?: string;
  @ApiProperty({ description: 'Validation result from AI' }) @IsObject() result: Record<string, unknown>;
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
}
