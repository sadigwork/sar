// libs/domain/profiles/src/lib/entities/profile.entity.ts
export enum ProfileStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class Profile {
  id: string;
  userId: string;

  // معلومات الاتصال
  phone?: string;

  // المعلومات الشخصية
  fullNameAr: string;
  fullNameEn: string;
  nationalId: string;

  // المعلومات الأكاديمية
  specialization: string;
  graduationYear: number;
  university: string;

  // معلومات إضافية
  address?: string;
  bio?: string;
  avatar?: string;

  // حالة الملف الشخصي
  status: ProfileStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewNotes?: string;

  // التواريخ
  createdAt: Date;
  updatedAt: Date;
}
