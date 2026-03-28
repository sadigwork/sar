export function mapStatus(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'draft';

    case 'SUBMITTED':
    case 'REGISTRAR_REVIEW':
    case 'REVIEWER_REVIEW':
      return 'pending';

    case 'PAYMENT_PENDING':
      return 'action_required';

    case 'PAYMENT_VERIFIED':
    case 'FINANCE_APPROVAL':
    case 'ADMIN_REVIEW':
      return 'pending';

    case 'APPROVED':
      return 'approved';

    case 'REJECTED':
      return 'rejected';

    default:
      return status.toLowerCase();
  }
}
export function mapType(type: string) {
  switch (type) {
    case 'REGISTRATION':
      return 'certification';

    case 'RENEWAL':
      return 'renewal';

    case 'UPGRADE':
      return 'upgrade';

    default:
      return type.toLowerCase();
  }
}
