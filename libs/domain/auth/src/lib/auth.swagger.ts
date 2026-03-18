import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../../users/index';

export const SwaggerRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({
      type: RegisterDto,
      examples: {
        user: {
          summary: 'Regular user',
          value: {
            firstName: 'Elsadig',
            lastName: 'Adam',
            email: 'sadig@sadig.com',
            password: 'Password123',
          },
        },
        // reviewer: {
        //   summary: 'Reviewer',
        //   value: {
        //     firstName: 'Bob',
        //     lastName: 'Reviewer',
        //     email: 'reviewer@sacrs.ly',
        //     password: 'Password123',
        //     role: Role.REVIEWER,
        //   },
        // },
        // admin: {
        //   summary: 'Admin',
        //   value: {
        //     firstName: 'Charlie',
        //     lastName: 'Admin',
        //     email: 'admin@sacrs.ly',
        //     password: 'Password123',
        //     role: Role.ADMIN,
        //   },
        // },
        // registrar: {
        //   summary: 'Registrar',
        //   value: {
        //     firstName: 'Diana',
        //     lastName: 'Registrar',
        //     email: 'registrar@sacrs.ly',
        //     password: 'Password123',
        //     role: Role.REGISTRAR,
        //   },
        // },
        // accountant: {
        //   summary: 'Accountant',
        //   value: {
        //     firstName: 'Edward',
        //     lastName: 'Accountant',
        //     email: 'accountant@sacrs.ly',
        //     password: 'Password123',
        //     role: Role.ACCOUNTANT,
        //   },
        // },
      },
    }),
    ApiResponse({ status: 201, description: 'User registered successfully' }),
    ApiResponse({ status: 409, description: 'Email already exists' }),
  );

export const SwaggerLogin = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login a user' }),
    ApiBody({
      type: LoginDto,
      examples: {
        user: {
          summary: 'User login',
          value: {
            email: 'sadig@sadig.com',
            password: 'Password123',
          },
        },
        reviewer: {
          summary: 'Reviewer login',
          value: { email: 'reviewer@sacrs.ly', password: 'Password123' },
        },
        admin: {
          summary: 'Admin login',
          value: { email: 'admin@sacrs.ly', password: 'Password123' },
        },
        registrar: {
          summary: 'Registrar login',
          value: { email: 'registrar@sacrs.ly', password: 'Password123' },
        },
        accountant: {
          summary: 'Accountant login',
          value: { email: 'accountant@sacrs.ly', password: 'Password123' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
