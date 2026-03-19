// libs/domain/applications/guards/role.guard.ts
// وظيفته: التأكد أن المستخدم لديه الدور الصحيح (Reviewer / Registrar / Accountant / Admin).
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === 'ADMIN') return true; // Admin override
    if (!this.allowedRoles.includes(user.role))
      throw new ForbiddenException('Role not allowed');

    return true;
  }
}
