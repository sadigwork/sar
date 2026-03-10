import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SwaggerRegister, SwaggerLogin } from './auth.swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { Role } from '../../../profile/src';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =======================
  // Create User with role (ADMIN ONLY)
  // =======================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create-user')
  async createUser(@Body() dto: CreateUserDto) {
    return this.authService.registerByAdmin(dto);
  }

  // =======================
  // REGISTER
  // =======================
  @Post('register')
  @SwaggerRegister()
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto, dto.role);

    if (result.tokens) {
      this.setCookies(res, result.tokens);
    }

    return result;
  }

  // =======================
  // LOGIN
  // =======================
  @Post('login')
  @SwaggerLogin()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // وضع التوكن في cookies
    this.setCookies(res, result.tokens);

    // إعادة user + tokens للـ frontend
    return result;
  }

  // =======================
  // REFRESH TOKEN
  // =======================
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    const tokens = await this.authService.refreshToken(refreshToken);

    this.setCookies(res, tokens);

    return {
      message: 'Tokens refreshed',
      tokens,
    };
  }

  // =======================
  // LOGOUT
  // =======================
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;

    await this.authService.logout(user.sub);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  // =======================
  // PRIVATE: SET COOKIES
  // =======================
  private setCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
