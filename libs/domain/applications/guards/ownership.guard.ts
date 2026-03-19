// libs/domain/applications/guards/ownership.guard.ts
// وظيفته: التأكد أن المستخدم يمتلك حق الوصول للموارد (مثلاً فقط صاحب التطبيق أو Admin).
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/src/index';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { applicationId } = request.params;

    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new ForbiddenException('Application not found');

    if (app.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
