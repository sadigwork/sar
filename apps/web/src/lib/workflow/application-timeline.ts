export const APPLICATION_TIMELINE = [
  {
    stage: 'SUBMITTED',
    label: 'تم تقديم الطلب',
    description: 'تم استلام طلبك بنجاح',
  },
  {
    stage: 'REGISTRAR_REVIEW',
    label: 'مراجعة المسجل',
    description: 'جاري التحقق من البيانات الأساسية',
  },
  {
    stage: 'REVIEWER_REVIEW',
    label: 'المراجعة الفنية',
    description: 'يتم تقييم المؤهلات والخبرة',
  },
  {
    stage: 'FINANCE_REVIEW',
    label: 'المراجعة المالية',
    description: 'التحقق من الدفع',
  },
  {
    stage: 'ADMIN_REVIEW',
    label: 'الاعتماد النهائي',
    description: 'الموافقة النهائية على الطلب',
  },
  {
    stage: 'APPROVED',
    label: 'تمت الموافقة',
    description: 'تم إصدار الشهادة',
  },
];
export function buildTimeline(application) {
  return APPLICATION_TIMELINE.map((step) => {
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';

    if (application.status === 'APPROVED') {
      status = 'completed';
    } else if (step.stage === application.currentStage) {
      status = 'current';
    } else if (
      APPLICATION_TIMELINE.findIndex((s) => s.stage === step.stage) <
      APPLICATION_TIMELINE.findIndex(
        (s) => s.stage === application.currentStage,
      )
    ) {
      status = 'completed';
    }

    return {
      ...step,
      status,
    };
  });
}
