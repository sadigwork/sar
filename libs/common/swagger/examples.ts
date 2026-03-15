// libs/common/swagger/examples.ts

export const UserExample = {
  id: 'user_001',
  email: 'engineer@test.com',
  firstName: 'Ahmed',
  lastName: 'Ali',
};

export const ProfileExample = {
  fullNameAr: 'أحمد محمد علي',
  fullNameEn: 'Ahmed Mohamed Ali',
  nationalId: '119876543210',
  phone: '+218912345678',
  dateOfBirth: '1994-05-10',
  gender: 'Male',
  address: 'Hay Andalus',
  city: 'Tripoli',
  country: 'Libya',
  bio: 'Agricultural engineer specialized in irrigation systems',
};

export const EducationExample = {
  degree: 'Bachelor',
  field: 'Agricultural Engineering',
  institution: 'University of Tripoli',
  country: 'Libya',
  year: 2017,
};

export const ExperienceExample = {
  company: 'Libya Agricultural Development Company',
  position: 'Irrigation Engineer',
  startDate: '2018-02-01',
  endDate: '2023-01-01',
  isCurrent: false,
};

export const ApplicationExample = {
  type: 'NEW_REGISTRATION',
};

export const ApplicationReviewExample = {
  decision: 'APPROVED',
  comment: 'All documents verified and accepted',
};

export const PaymentExample = {
  amount: 150,
  currency: 'USD',
  method: 'BANK_TRANSFER',
  reference: 'BANK-TRX-556677',
};
