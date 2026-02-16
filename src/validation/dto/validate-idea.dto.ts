import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class ValidateIdeaDto {
  @ApiProperty({
    description: 'Startup idea description',
    example:
      "I'm building a platform that connects freelance designers with sustainable fashion brands to automate eco-conscious marketing materials.",
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000)
  ideaDescription: string;

  @ApiPropertyOptional({ description: 'Industry category', example: 'Fashion & Sustainability' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ description: 'Target audience', example: 'SMBs, Gen Z' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({
    description: 'Current stage of the idea',
    enum: ['Idea', 'MVP', 'Launched'],
  })
  @IsOptional()
  @IsIn(['Idea', 'MVP', 'Launched'])
  currentStage?: 'Idea' | 'MVP' | 'Launched';
}
