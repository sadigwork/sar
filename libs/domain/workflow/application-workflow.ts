export const ApplicationWorkflow = {
  DRAFT: ['SUBMITTED'],

  SUBMITTED: ['REGISTRAR_REVIEW'],

  REGISTRAR_REVIEW: ['REVIEWER_REVIEW', 'REJECTED'],

  REVIEWER_REVIEW: ['PAYMENT_PENDING', 'REJECTED'],

  PAYMENT_PENDING: ['PAYMENT_VERIFIED'],

  PAYMENT_VERIFIED: ['FINANCE_APPROVAL'],

  FINANCE_APPROVAL: ['ADMIN_REVIEW'],

  ADMIN_REVIEW: ['APPROVED', 'REJECTED'],
};

export type Role =
  | 'USER'
  | 'REGISTRAR'
  | 'REVIEWER'
  | 'ACCOUNTANT'
  | 'FINANCE_MANAGER'
  | 'ADMIN';

export type Stage =
  | 'REGISTRAR_REVIEW'
  | 'REVIEWER_REVIEW'
  | 'FINANCE_REVIEW'
  | 'ADMIN_REVIEW';

export type Status =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PAYMENT_PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface WorkflowState {
  status: string;
  stage: Stage | null;
}

interface Transition {
  from: WorkflowState;
  to: WorkflowState;
  roles: Role[];
  action: string;
}

export const transitions: Transition[] = [
  // Submit
  {
    from: { status: 'DRAFT', stage: null },
    to: { status: 'SUBMITTED', stage: 'REGISTRAR_REVIEW' },
    roles: ['USER'],
    action: 'submit',
  },

  // Registrar approves
  {
    from: { status: 'SUBMITTED', stage: 'REGISTRAR_REVIEW' },
    to: { status: 'SUBMITTED', stage: 'REVIEWER_REVIEW' },
    roles: ['REGISTRAR'],
    action: 'approve',
  },

  // Reviewer approves
  {
    from: { status: 'SUBMITTED', stage: 'REVIEWER_REVIEW' },
    to: { status: 'PAYMENT_PENDING', stage: 'FINANCE_REVIEW' },
    roles: ['REVIEWER'],
    action: 'approve',
  },

  // Finance verifies payment
  {
    from: { status: 'PAYMENT_PENDING', stage: 'FINANCE_REVIEW' },
    to: { status: 'SUBMITTED', stage: 'ADMIN_REVIEW' },
    roles: ['ACCOUNTANT', 'FINANCE_MANAGER'],
    action: 'verify_payment',
  },

  // Admin final approval
  {
    from: { status: 'SUBMITTED', stage: 'ADMIN_REVIEW' },
    to: { status: 'APPROVED', stage: null },
    roles: ['ADMIN'],
    action: 'approve',
  },

  // Reject (global)
  {
    from: { status: 'SUBMITTED', stage: 'REGISTRAR_REVIEW' },
    to: { status: 'REJECTED', stage: null },
    roles: ['REGISTRAR'],
    action: 'reject',
  },
];
export function getAvailableActions(current: WorkflowState, role: Role) {
  return transitions.filter(
    (t) =>
      t.from.status === current.status &&
      t.from.stage === current.stage &&
      t.roles.includes(role),
  );
}
export function canTransition(
  current: WorkflowState,
  role: Role,
  action: string,
) {
  return transitions.find(
    (t) =>
      t.from.status === current.status &&
      t.from.stage === current.stage &&
      t.roles.includes(role) &&
      t.action === action,
  );
}
export function getNextState(
  current: WorkflowState,
  role: Role,
  action: string,
): WorkflowState | null {
  const transition = canTransition(current, role, action);

  if (!transition) return null;

  return transition.to;
}
export function getStageLabel(stage: Stage | null) {
  switch (stage) {
    case 'REGISTRAR_REVIEW':
      return 'Registrar Review';

    case 'REVIEWER_REVIEW':
      return 'Technical Review';

    case 'FINANCE_REVIEW':
      return 'Finance Review';

    case 'ADMIN_REVIEW':
      return 'Final Approval';

    default:
      return 'Completed';
  }
}
