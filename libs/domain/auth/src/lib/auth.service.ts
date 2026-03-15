import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/index';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';

import { Role } from '../../../users/index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // =======================
  // REGISTER BY ADMIN
  // =======================

  async registerByAdmin(dto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    const tokens = await this.generateTokens(newUser);

    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return {
      message: 'User created successfully',
      user: newUser,
      tokens,
    };
  }

  // =======================
  // VALIDATE USER
  // =======================

  async validateUser(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  // =======================
  // REGISTER (PUBLIC)
  // =======================

  async register(dto: RegisterDto, role: Role = Role.USER) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role,
    });

    // إنشاء Profile تلقائياً
    await this.createProfileForUser(newUser);

    // توليد التوكنات من الدالة الموحدة
    const tokens = await this.generateTokens(newUser);

    // حفظ refresh token
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  // =======================
  // LOGIN
  // =======================

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.generateTokens(user);

    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  // =======================
  // REFRESH TOKEN
  // =======================

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // =======================
  // LOGOUT
  // =======================

  async logout(userId: string) {
    await this.usersService.update(userId, {
      refreshToken: null,
    });

    return true;
  }

  // =======================
  // GET USER
  // =======================

  async getUserById(userId: string) {
    if (!userId) {
      throw new Error('User id is missing');
    }

    return this.usersService.findOne(userId);
  }

  // =======================
  // PRIVATE HELPERS
  // =======================

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedToken,
    });
  }

  private async createProfileForUser(user: any) {
    await this.usersService.createProfile({
      userId: user.id,
      fullNameAr: `${user.firstName} ${user.lastName}`,
      fullNameEn: `${user.firstName} ${user.lastName}`,
      nationalId: `TEMP-${user.id}`,
    });
  }
}
