import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/index';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../../../users/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // =======================
  // REGISTER (PUBLIC)
  // =======================

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.USER,
    });

    // إنشاء Profile تلقائياً
    await this.createProfileForUser(newUser);

    // توليد التوكنات من الدالة الموحدة
    const tokens = await this.generateTokens(newUser);

    // حفظ refresh token
    await this.saveRefreshToken(newUser.id, tokens.refreshToken);

    return this.buildAuthResponse(newUser, tokens);
  }

  // =======================
  // REGISTER BY ADMIN
  // =======================

  async registerByAdmin(dto: CreateUserDto) {
    const roleMap: Record<string, Role> = {
      USER: Role.USER,
      ADMIN: Role.ADMIN,
      REVIEWER: Role.REVIEWER,
      REGISTRAR: Role.REGISTRAR,
      ACCOUNTANT: Role.ACCOUNTANT,
    };
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
      role: roleMap[dto.role] ?? Role.USER,
    });

    const tokens = await this.generateTokens(newUser);

    await this.saveRefreshToken(newUser.id, tokens.refreshToken);

    return this.buildAuthResponse(newUser, tokens);
  }

  // =======================
  // LOGIN
  // =======================

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.generateTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return this.buildAuthResponse(user, tokens);
  }

  // =======================
  // REFRESH TOKEN
  // =======================

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);

      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);

      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return this.buildAuthResponse(user, tokens);
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
  // VALIDATE USER
  // =======================

  async validateUser(dto: LoginDto) {
    console.log('\n========== LOGIN DEBUG START ==========');
    console.log('[STEP 1] Incoming DTO:', dto);

    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      console.log('[STEP 2] ❌ User NOT FOUND');
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('[STEP 2] ✅ User FOUND');
    console.log('[DB USER]', {
      userId: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    // ⚠️ تحقق من نوع كلمة المرور
    console.log('[STEP 3] Password length:', user.password?.length);
    console.log(
      '[STEP 3] Starts with $2b$ ?',
      user.password?.startsWith('$2b$'),
    );

    const isValid = await bcrypt.compare(dto.password, user.password);

    console.log('[STEP 4] bcrypt.compare result:', isValid);

    if (!isValid) {
      console.log('[STEP 4] ❌ Password mismatch');
      console.log('[INPUT PASSWORD]', dto.password);
      console.log('[HASHED PASSWORD]', user.password);

      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('[STEP 5] ✅ Password MATCH');
    console.log('========== LOGIN DEBUG SUCCESS ==========\n');

    return user;
  }

  // =======================
  // TOKENS
  // =======================
  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);

    await this.usersService.update(userId, {
      refreshToken: hashedToken,
    });
  }

  // =======================
  // RESPONSE BUILDER 🔥
  // =======================
  private buildAuthResponse(user: any, tokens: any) {
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens,
      },
    };
  }

  // =======================
  // PROFILE
  // =======================
  private async createProfileForUser(user: any) {
    await this.usersService.createProfile({
      userId: user.id,
      fullNameAr: `${user.firstName} ${user.lastName}`,
      fullNameEn: `${user.firstName} ${user.lastName}`,
      nationalId: `TEMP-${user.id}`,
    });
  }
}
