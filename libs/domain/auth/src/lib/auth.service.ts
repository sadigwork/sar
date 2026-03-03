import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../profile/src/index';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../../profile/src/index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

    return this.generateTokens(newUser);
  }

  // =======================
  // LOGIN
  // =======================
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  // =======================
  // REFRESH TOKEN
  // =======================
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

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

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedToken });
  }
}
// import {
//   ConflictException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../../../profile/src/index';
// import * as bcrypt from 'bcrypt';
// import { Role } from '../../../profile/src/index';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly usersService: UsersService,
//     private readonly configService: ConfigService,
//   ) {}

//   async validateUser(loginDto: LoginDto) {
//     const user = await this.usersService.findByEmail(loginDto.email);
//     if (!user) {
//       throw new UnauthorizedException('Invalid email or password');
//     }
//     const isPasswordValid = await bcrypt.compare(
//       loginDto.password,
//       user.password,
//     );
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid email or password');
//     }
//     return user;
//   }

//   async login(dto: LoginDto, res: Response) {
//   const user = await this.validateUser(dto);

//   const tokens = await this.generateTokens(user);
//   await this.updateRefreshToken(user.id, tokens.refresh_token);

//   // إرسال الـ cookies
//   res.cookie('access_token', tokens.access_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 15 * 60 * 1000, // 15 دقيقة
//   });

//   res.cookie('refresh_token', tokens.refresh_token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
//   });

//   return { message: 'Logged in successfully' };
// }

//   async register(dto: RegisterDto) {
//     const existingUser = await this.usersService.findByEmail(dto.email);
//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const newUser = await this.usersService.create({
//       email: dto.email,
//       password: hashedPassword,
//       firstName: dto.firstName,
//       lastName: dto.lastName,
//     });
//     const payload = {
//       sub: newUser.id,
//       email: newUser.email,
//       role: newUser.role ?? Role.USER,
//     };

//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   private async generateTokens(user: any) {
//     const payload = { sub: user.id, email: user.email, role: user.role };

//     const access_token = this.jwtService.sign(payload);
//     const refresh_token = this.jwtService.sign(payload, {
//       secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
//       expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
//     });
//     return { access_token, refresh_token };
//   }

//   private async updateRefreshToken(userId: number, refreshToken: string) {
//     const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
//     await this.usersService.update(userId, {
//       refreshToken: hashedRefreshToken,
//     });
//   }
//   async refresh(refreshToken: string) {
//     try {
//       const payload = this.jwtService.verify(refreshToken, {
//         secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
//       });
//       const user = await this.usersService.findOne(payload.sub);

//       if (!user || !user.refreshToken) {
//         throw new UnauthorizedException('Invalid refresh token');
//       }

//       const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
//       if (!isMatch) {
//         throw new UnauthorizedException('Invalid refresh token');
//       }

//       const tokens = await this.generateTokens(user);
//       await this.updateRefreshToken(user.id, tokens.refresh_token);
//       return tokens;
//     } catch {
//       throw new UnauthorizedException('Invalid refresh token');
//     }
//   }

//   async logout(userId: string) {
//     await this.userService.update(userId, { refreshToken: null });
//   }
// }
