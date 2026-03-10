import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../profile/src/index';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../profile/src/index';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

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
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    const tokens = await this.generateTokens(newUser);

    await this.saveRefreshToken(newUser.id, tokens.refresh_token);

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
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  // =======================
  // REGISTER
  // =======================
  async register(dto: RegisterDto, role: Role = Role.USER) {
    // تحقق من وجود المستخدم مسبقًا
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already exists');

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // إنشاء المستخدم
    const newUser = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role, // استخدام الدور المحدد أو user افتراضيًا
    });

    // محاولة إنشاء الـ JWT
    try {
      const payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (err) {
      console.error('Token generation failed', err);
      // المستخدم تم إنشاؤه بنجاح، لكن الـ token فشل
      return {
        success: true,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
        warning: 'User created but failed to generate tokens',
      };
    }
  }

  // =======================
  // LOGIN
  // =======================
  async login(dto: LoginDto) {
    console.log('LOGIN DTO:', dto);

    const user = await this.validateUser(dto);
    console.log('USER OK:', user);

    const tokens = await this.generateTokens(user);
    console.log('TOKENS GENERATED:', tokens);

    await this.updateRefreshToken(user.id, tokens.refresh_token);
    console.log('REFRESH TOKEN SAVED');

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
      if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

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
    await this.usersService.update(userId, { refreshToken: null });
    return true;
  }

  // =======================
  // PRIVATE HELPERS
  // =======================
  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    console.log('JWT_SECRET', this.configService.get('JWT_SECRET'));
    console.log('JWT_EXPIRES', this.configService.get('JWT_EXPIRES'));

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, refreshToken: any) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedToken });
  }

  async getUserById(userId: string) {
    if (!userId) {
      throw new Error('User id is missing');
    }

    return this.usersService.findOne(userId);
  }
  // ======================
  // SAVE REFRESH
  // ======================
  private async saveRefreshToken(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);

    await this.usersService.update(userId, {
      refreshToken: hash,
    });
  }
}
// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';

// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '@sacrs/profile';
// import * as bcrypt from 'bcrypt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//     private config: ConfigService,
//   ) {}

//   // ======================
//   // REGISTER
//   // ======================
//   async register(dto: any) {
//     const exists = await this.usersService.findByEmail(dto.email);

//     if (exists) {
//       throw new ConflictException('Email already exists');
//     }

//     const password = await bcrypt.hash(dto.password, 10);

//     const user = await this.usersService.create({
//       ...dto,
//       password,
//     });

//     const tokens = await this.generateTokens(user);

//     await this.saveRefreshToken(user.id, tokens.refresh_token);

//     return { user, tokens };
//   }

//   // ======================
//   // LOGIN
//   // ======================
//   async login(dto: any) {
//     const user = await this.usersService.findByEmail(dto.email);

//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const match = await bcrypt.compare(dto.password, user.password);

//     if (!match) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const tokens = await this.generateTokens(user);

//     await this.saveRefreshToken(user.id, tokens.refresh_token);

//     return { user, tokens };
//   }

//   // ======================
//   // REFRESH
//   // ======================
//   async refreshToken(token: string) {
//     const payload = this.jwtService.verify(token, {
//       secret: this.config.get<string>('JWT_REFRESH_SECRET'),
//     });

//     const user = await this.usersService.findOne(payload.sub);

//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     const valid = await bcrypt.compare(token, user.refreshToken);

//     if (!valid) {
//       throw new UnauthorizedException();
//     }

//     const tokens = await this.generateTokens(user);

//     await this.saveRefreshToken(user.id, tokens.refresh_token);

//     return tokens;
//   }

//   // ======================
//   // LOGOUT
//   // ======================
//   async logout(userId: string) {
//     await this.usersService.update(userId, {
//       refreshToken: null,
//     });

//     return true;
//   }

//   // ======================
//   // TOKENS
//   // ======================
//   private async generateTokens(user: any) {
//     const payload = {
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//     };

//     const access_token = await this.jwtService.signAsync(payload, {
//       secret: this.config.get<string>('JWT_SECRET'),
//       expiresIn: '15m',
//     });

//     const refresh_token = await this.jwtService.signAsync(payload, {
//       secret: this.config.get<string>('JWT_REFRESH_SECRET'),
//       expiresIn: '7d',
//     });

//     return {
//       access_token,
//       refresh_token,
//     };
//   }

//   // ======================
//   // SAVE REFRESH
//   // ======================
//   private async saveRefreshToken(userId: string, token: string) {
//     const hash = await bcrypt.hash(token, 10);

//     await this.usersService.update(userId, {
//       refreshToken: hash,
//     });
//   }
// }
