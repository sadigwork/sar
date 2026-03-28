import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SwaggerRegister, SwaggerLogin } from './auth.swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';
import { Role } from '../../../users/index';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('🔐 Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =======================
  // ME
  // =======================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.authService.getUserById(req.user.sub);
  }

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
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // =======================
  // LOGIN
  // =======================
  @SwaggerLogin()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    console.log('LOGIN RESULT:', result);

    // ⚠️ الآن الشكل دائمًا result.data.tokens
    const tokens = result.data.tokens;

    if (!tokens?.accessToken) {
      console.error('TOKENS ERROR:', result);
      throw new Error('Tokens not found in response');
    }

    // ✅ استخدام tokens الصحيح
    this.setCookies(res, tokens);

    return result; // الآن يحتوي success + data
  }

  // =======================
  // REFRESH TOKEN
  // =======================
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(refreshToken);

    const tokens = result.data.tokens;

    if (!tokens?.accessToken) {
      console.error('TOKENS ERROR:', result);
      throw new Error('Tokens not found');
    }

    this.setCookies(res, tokens);

    return result;
  }

  // =======================
  // LOGOUT
  // =======================
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    await this.authService.logout(req.user.sub);

    return { message: 'Logged out successfully' };
  }

  // =======================
  // PRIVATE: SET COOKIES
  // =======================
  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
