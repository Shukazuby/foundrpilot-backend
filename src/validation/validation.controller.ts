import { Body, Controller, Get, Post, HttpCode, HttpStatus, UseGuards, ConflictException, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidateIdeaDto } from './dto/validate-idea.dto';
import { GeminiService } from './gemini.service';
import { ValidationHistoryService } from './validation-history.service';
import { ValidationResult } from './schemas/validation-result.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from '../users/users.service';
import type { User } from '../users/schemas/user.schema';

@ApiTags('validation')
@Controller('validation')
export class ValidationController {
  constructor(
    private readonly gemini: GeminiService,
    private readonly usersService: UsersService,
    private readonly historyService: ValidationHistoryService,
  ) {}

  /**
   * Data flow: Client (with JWT) sends idea -> we check credits -> call Gemini ->
   * on success decrement user credits by 1 -> return ValidationResult for UI cards.
   */
  @Post('run')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Run AI validation (costs 1 credit)' })
  @ApiResponse({ status: 200, description: 'Structured validation result for UI cards' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Insufficient credits' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @ApiResponse({ status: 500, description: 'AI or server error' })
  async runValidation(
    @Body() dto: ValidateIdeaDto,
    @CurrentUser() user: User,
  ): Promise<ValidationResult> {
    if (user.credits < 1) {
      throw new ConflictException('Insufficient credits. You need at least 1 credit to run a validation.');
    }
    const result = await this.gemini.validateIdea(
      dto.ideaDescription,
      dto.industry,
      dto.targetAudience,
      dto.currentStage,
    );
    await this.usersService.consumeOneCredit(String(user._id));
    await this.historyService.create(String(user._id), dto.ideaDescription);
    return result;
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List validation runs for current user' })
  @ApiResponse({ status: 200, description: 'List of past validation runs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHistory(@CurrentUser() user: User, @Query('limit') limit?: string) {
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10))) : 50;
    return this.historyService.findByUser(String(user._id), limitNum);
  }
}
