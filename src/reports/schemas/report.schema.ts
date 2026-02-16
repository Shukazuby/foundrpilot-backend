import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  ideaDescription: string;

  @Prop()
  industry?: string;

  @Prop()
  targetAudience?: string;

  @Prop()
  currentStage?: string;

  @Prop({ type: Object, required: true })
  result: {
    targetAudience: string;
    problemValidation: string;
    monetizationStrategy: string;
    keyRisks: string;
    competitorLandscape: string;
    mvpRoadmap: string;
    confidenceScore: number;
    riskLevel: string;
  };

  @Prop({ default: 'Report' })
  title: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
ReportSchema.index({ userId: 1, createdAt: -1 });
