import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() }).lean().exec();
    return doc as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id).lean().exec();
    return doc as User | null;
  }

  async create(email: string, passwordHash: string, name?: string): Promise<User> {
    const normalized = email.toLowerCase();
    const existing = await this.userModel.findOne({ email: normalized }).exec();
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const user = await this.userModel.create({
      email: normalized,
      passwordHash,
      name: name || undefined,
      credits: 5,
    });
    return user.toObject() as User;
  }

  /**
   * Decrements user credits by 1. Throws if credits would go below 0.
   * Returns the updated user.
   */
  async consumeOneCredit(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.credits < 1) {
      throw new ConflictException('Insufficient credits. You need at least 1 credit to run a validation.');
    }
    user.credits -= 1;
    await user.save();
    return user.toObject() as User;
  }
}
