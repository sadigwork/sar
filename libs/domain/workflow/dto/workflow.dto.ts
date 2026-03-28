import { ApiProperty } from '@nestjs/swagger';
import { Role, ReviewDecision } from '@prisma/client';

export class WorkflowActionDto {
  @ApiProperty({
    description: 'معرف المستخدم/المراجع الذي يقوم بالإجراء',
    example: 'clx123-reviewer-id',
  })
  reviewerId: string;

  @ApiProperty({
    description: 'الدور الذي يقوم بالإجراء',
    enum: [Role.ADMIN, Role.REVIEWER, Role.REGISTRAR, Role.ACCOUNTANT],
    example: Role.REVIEWER,
  })
  role: Role;

  @ApiProperty({
    description: 'قرار المراجعة أو الإجراء المطلوب',
    enum: [
      ReviewDecision.APPROVED,
      ReviewDecision.REJECTED,
      ReviewDecision.REQUEST_CHANGES,
    ],
    example: ReviewDecision.APPROVED,
  })
  decision: ReviewDecision;

  @ApiProperty({
    description: 'تعليق اختياري للإجراء',
    required: false,
    example: 'تمت المراجعة والموافقة',
  })
  comment?: string;

  @ApiProperty({
    description: 'نوع الإجراء في الـ Workflow (SUBMIT, PAY, APPROVE, REJECT)',
    required: false,
    example: 'SUBMIT',
  })
  action?: string;
}
