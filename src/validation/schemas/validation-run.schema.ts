import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ValidationRun extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  ideaDescription: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ValidationRunSchema = SchemaFactory.createForClass(ValidationRun);
ValidationRunSchema.index({ userId: 1, createdAt: -1 });
