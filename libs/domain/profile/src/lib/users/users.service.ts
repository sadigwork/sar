import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../infrastructure/prisma/src/lib/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ================================
  // CREATE USER
  // ================================
  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // 🔥 لا نقوم بالـ hash هنا
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? 'user',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ================================
  // FIND ALL USERS
  // ================================
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ================================
  // FIND USER BY ID
  // ================================
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // ================================
  // FIND USER BY EMAIL
  // ================================
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ================================
  // UPDATE USER
  // ================================
  async update(
    id: string,
    data: Partial<{
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      role: string;
      isActive: boolean;
      refreshToken: string | null;
    }>,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // ================================
  // DELETE USER
  // ================================
  async remove(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
