// libs/common/swagger/examples.ts
export const DashboardExamples = {
  stats: {
    summary: 'مثال على KPI Stats',
    value: {
      users: 120,
      profiles: 100,
      applications: 75,
      approvedApplications: 50,
      rejectedApplications: 10,
      pendingApplications: 15,
      totalRevenue: 12500.5,
    },
  },
  applicationsByStatus: {
    summary: 'Applications grouped by status',
    value: [
      { status: 'SUBMITTED', count: 15 },
      { status: 'APPROVED', count: 50 },
      { status: 'REJECTED', count: 10 },
    ],
  },
  applicationsPerMonth: {
    summary: 'Applications per month chart',
    value: {
      labels: ['2026-01', '2026-02', '2026-03'],
      data: [10, 20, 15],
    },
  },
  revenuePerMonth: {
    summary: 'Revenue per month chart',
    value: {
      labels: ['2026-01', '2026-02', '2026-03'],
      data: [3000, 5000, 4500],
    },
  },
  recentApplications: {
    summary: 'Last submitted applications',
    value: [
      {
        id: 'app_001',
        user: {
          firstName: 'Ahmad',
          lastName: 'Ali',
          email: 'ahmad@example.com',
        },
        type: 'NEW_REGISTRATION',
        status: 'SUBMITTED',
        createdAt: '2026-03-01T08:30:00.000Z',
      },
    ],
  },
  reviewerQueue: {
    summary: 'Applications pending review',
    value: [
      {
        id: 'app_002',
        user: {
          firstName: 'Sara',
          lastName: 'Hassan',
          email: 'sara@example.com',
        },
        type: 'RENEWAL',
        status: 'SUBMITTED',
        createdAt: '2026-03-05T10:00:00.000Z',
      },
    ],
  },
  accountantQueue: {
    summary: 'Pending payments',
    value: [
      {
        id: 'pay_001',
        amount: 200,
        status: 'PENDING',
        application: {
          id: 'app_003',
          user: {
            firstName: 'Omar',
            lastName: 'Khalid',
            email: 'omar@example.com',
          },
        },
        createdAt: '2026-03-06T11:00:00.000Z',
      },
    ],
  },
};

export const ProfileExample = {
  fullNameAr: 'أحمد محمد علي',
  fullNameEn: 'Ahmad Mohamed Ali',
  nationalId: '119900123456',
  phone: '+218912345678',
  dateOfBirth: '1990-05-15',
  gender: 'Male',
  address: 'Tripoli - Libya',
  city: 'Tripoli',
  country: 'Libya',
  // avatar: '/uploads/avatar.png',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Agricultural Engineer مهندس برمجيات بخبرة 5 سنوات في تطوير تطبيقات الويب',
  status: 'DRAFT',
};

export const ApplicationExample = {
  type: 'REGISTRATION',
  status: 'SUBMITTED',
};
