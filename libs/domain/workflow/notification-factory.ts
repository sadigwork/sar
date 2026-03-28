export function buildNotification({
  action,
  application,
}: {
  action: string;
  application: any;
}) {
  switch (action) {
    case 'submit':
      return {
        title: 'تم تقديم الطلب',
        message: 'تم استلام طلبك وهو الآن قيد المراجعة',
        type: 'INFO',
      };

    case 'approve':
      if (application.currentStage === 'REGISTRAR_REVIEW') {
        return {
          title: 'تم قبول الطلب مبدئياً',
          message: 'تم تحويل طلبك إلى المراجعة الفنية',
          type: 'SUCCESS',
        };
      }

      if (application.currentStage === 'ADMIN_REVIEW') {
        return {
          title: 'تمت الموافقة النهائية 🎉',
          message: 'تم اعتماد طلبك وإصدار الشهادة',
          type: 'SUCCESS',
        };
      }

      return {
        title: 'تم تحديث الطلب',
        message: 'تمت مراجعة طلبك',
        type: 'INFO',
      };

    case 'reject':
      return {
        title: 'تم رفض الطلب',
        message: 'يرجى مراجعة الملاحظات وإعادة التقديم',
        type: 'ERROR',
      };

    case 'verify_payment':
      return {
        title: 'تم التحقق من الدفع',
        message: 'تم تحويل طلبك للإدارة لاعتماده',
        type: 'SUCCESS',
      };

    default:
      return {
        title: 'تحديث جديد',
        message: 'تم تحديث حالة الطلب',
        type: 'INFO',
      };
  }
}
