import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../../profile/src/index';

export const SwaggerRegister = () =>
  applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({
      type: RegisterDto,
      examples: {
        user: {
          summary: 'Regular user',
          value: {
            firstName: 'Alice',
            lastName: 'User',
            email: 'user@example.com',
            password: 'password123',
            role: Role.USER,
          },
        },
        reviewer: {
          summary: 'Reviewer',
          value: {
            firstName: 'Bob',
            lastName: 'Reviewer',
            email: 'reviewer@example.com',
            password: 'password123',
            role: Role.REVIEWER,
          },
        },
        admin: {
          summary: 'Admin',
          value: {
            firstName: 'Charlie',
            lastName: 'Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: Role.ADMIN,
          },
        },
        registrar: {
          summary: 'Registrar',
          value: {
            firstName: 'Diana',
            lastName: 'Registrar',
            email: 'registrar@example.com',
            password: 'password123',
            role: Role.REGISTRAR,
          },
        },
        accountant: {
          summary: 'Accountant',
          value: {
            firstName: 'Edward',
            lastName: 'Accountant',
            email: 'accountant@example.com',
            password: 'password123',
            role: Role.ACCOUNTANT,
          },
        },
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
          value: { email: 'user@example.com', password: 'password123' },
        },
        reviewer: {
          summary: 'Reviewer login',
          value: { email: 'reviewer@example.com', password: 'password123' },
        },
        admin: {
          summary: 'Admin login',
          value: { email: 'admin@example.com', password: 'password123' },
        },
        registrar: {
          summary: 'Registrar login',
          value: { email: 'registrar@example.com', password: 'password123' },
        },
        accountant: {
          summary: 'Accountant login',
          value: { email: 'accountant@example.com', password: 'password123' },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
