import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidationRun } from './schemas/validation-run.schema';

const MAX_IDEA_LENGTH = 500;

@Injectable()
export class ValidationHistoryService {
  constructor(
    @InjectModel(ValidationRun.name) private runModel: Model<ValidationRun>,
  ) {}

  async create(userId: string, ideaDescription: string): Promise<ValidationRun> {
    const snippet =
      ideaDescription.length > MAX_IDEA_LENGTH
        ? ideaDescription.slice(0, MAX_IDEA_LENGTH) + '...'
        : ideaDescription;
    const doc = await this.runModel.create({ userId, ideaDescription: snippet });
    return doc.toObject() as ValidationRun;
  }

  async findByUser(userId: string, limit = 50): Promise<ValidationRun[]> {
    const list = await this.runModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return list as unknown as ValidationRun[];
  }
}
