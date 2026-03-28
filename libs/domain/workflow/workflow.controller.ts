import { Controller, Post, Body, Param } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowActionDto } from './workflow.swagger';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post(':applicationId/action')
  @ApiOperation({
    summary: 'Perform Workflow Action or Review',
    description: `
      Endpoint ديناميكي لكل العمليات المتعلقة بالتطبيقات.

      **Actions متاحة:**
      - SUBMIT: إرسال التطبيق
      - APPROVE: الموافقة على المراجعة
      - REJECT: رفض المراجعة
      - REQUEST_CHANGES: طلب تعديل
      - PAY: دفع الرسوم
    `,
  })
  @ApiBody({
    type: WorkflowActionDto,
    examples: {
      submit: {
        summary: 'Submit application',
        value: { action: 'SUBMIT' },
      },
      pay: {
        summary: 'Pay for application',
        value: {
          action: 'PAY',
          reviewerId: 'clx123',
          role: 'USER',
          comment: 'Payment for registration',
        },
      },
      approveReview: {
        summary: 'Approve review',
        value: {
          action: 'APPROVE',
          reviewerId: 'clx456',
          role: 'REVIEWER',
          decision: 'APPROVED',
          comment: 'All OK',
        },
      },
      rejectReview: {
        summary: 'Reject review',
        value: {
          action: 'REJECT',
          reviewerId: 'clx456',
          role: 'REVIEWER',
          decision: 'REJECTED',
          comment: 'Missing documents',
        },
      },
      requestChanges: {
        summary: 'Request changes',
        value: {
          action: 'REQUEST_CHANGES',
          reviewerId: 'clx456',
          role: 'REVIEWER',
          decision: 'REQUEST_CHANGES',
          comment: 'Please update your profile',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Action executed successfully' })
  async performAction(
    @Param('applicationId') applicationId: string,
    @Body() body: WorkflowActionDto,
  ) {
    if (body.action && ['SUBMIT', 'PAY'].includes(body.action)) {
      // Action عام
      return this.workflowService.performAction(applicationId, body);
    }

    // Action مراجعة
    return this.workflowService.processReview({
      applicationId,
      reviewerId: body.reviewerId,
      role: body.role,
      decision: body.decision,
      comment: body.comment,
    });
  }
}
