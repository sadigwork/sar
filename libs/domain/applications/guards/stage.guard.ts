// libs/domain/applications/guards/stage.guard.ts
// وظيفته: التأكد أن المراجع في المرحلة الصحيحة.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { WorkflowService } from '../../workflow/index';
import { PrismaService } from '../../../infrastructure/prisma/src/index';

@Injectable()
export class StageGuard implements CanActivate {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { applicationId } = request.params;

    const stage = await this.workflowService.getCurrentStage(applicationId);

    // Admin bypass
    if (user.role === 'ADMIN') return true;

    // تحقق إذا كان المستخدم جزء من المراجعين للمرحلة الحالية
    const reviewers = await this.workflowService.getReviewersForStage(
      applicationId,
      stage,
    );
    const isReviewer = reviewers.includes(user.id);

    if (!isReviewer)
      throw new ForbiddenException('Not authorized for this stage');
    return true;
  }
}
