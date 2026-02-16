import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GeminiService } from './gemini.service';
import { ValidationController } from './validation.controller';
import { ValidationHistoryService } from './validation-history.service';
import { ValidationRun, ValidationRunSchema } from './schemas/validation-run.schema';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: ValidationRun.name, schema: ValidationRunSchema }]),
  ],
  controllers: [ValidationController],
  providers: [GeminiService, ValidationHistoryService],
  exports: [GeminiService],
})
export class ValidationModule {}
