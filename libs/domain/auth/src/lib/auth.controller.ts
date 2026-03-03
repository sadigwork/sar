import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =======================
  // REGISTER
  // =======================
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.register(dto);
    this.setCookies(res, tokens);
    return { message: 'User registered successfully' };
  }

  // =======================
  // LOGIN
  // =======================
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.setCookies(res, tokens);
    return { message: 'Logged in successfully' };
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
    return { message: 'Tokens refreshed' };
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
  // PRIVATE HELPER: SET COOKIES
  // =======================
  private setCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 دقائق
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
    });
  }
}
// import { Controller, Post, Body, UseGuards } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { Request } from '@nestjs/common';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   login(@Body() dto: LoginDto) {
//     return this.authService.login(dto);
//   }

//   @Post('register')
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto);
//   }
//   @Post('refresh')
//   refresh(@Body() body: { refresh_token: string }) {
//     return this.authService.refresh(body.refresh_token);
//   }

//   @UseGuards(JwtAuthGuard)
//   @Post('logout')
//   logout(@Request() req) {
//     return this.authService.logout(req.user.id);
//   }
// }
