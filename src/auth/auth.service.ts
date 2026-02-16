import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';


export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResult {
  access_token: string;
  user: { id: string; email: string; name?: string; credits: number };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });
    return this.loginResult(user as User);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.validateUser(dto.email, dto.password);
    return this.loginResult(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user as User;
  }

  async findById(id: string){
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, body: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, body, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  async me(userId: string){
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private loginResult(user: User): AuthResult {
    const payload: JwtPayload = { sub: String(user._id), email: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        credits: user.credits,
      },
    };
  }
}
