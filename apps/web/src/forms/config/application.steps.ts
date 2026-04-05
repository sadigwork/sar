export const applicationSteps = [
  // =========================
  // 1. PERSONAL
  // =========================
  {
    id: 'personal',
    title: 'البيانات الشخصية',
    fields: [
      { name: 'fullName', type: 'text', label: 'الاسم بالعربي' },
      { name: 'fullNameEn', type: 'text', label: 'الاسم بالانجليزي' },
      { name: 'nationalId', type: 'text', label: 'الرقم الوطني' },

      { name: 'phoneNumber', type: 'text', label: 'رقم الهاتف' },
      { name: 'birthDate', type: 'date', label: 'تاريخ الميلاد' },

      {
        name: 'gender',
        type: 'select',
        label: 'الجنس',
        options: [
          { label: 'ذكر', value: 'male' },
          { label: 'أنثى', value: 'female' },
        ],
      },

      { name: 'address', type: 'text', label: 'العنوان' },
      { name: 'city', type: 'text', label: 'المدينة' },
      { name: 'country', type: 'text', label: 'الدولة' },

      { name: 'specialization', type: 'text', label: 'التخصص' },
      { name: 'graduationYear', type: 'text', label: 'سنة التخرج' },
      { name: 'university', type: 'text', label: 'الجامعة' },
    ],
  },

  // =========================
  // 2. EDUCATION
  // =========================
  {
    id: 'education',
    title: 'الدراسة',
    repeatable: true,
    name: 'education',
    fields: [
      { name: 'degree', type: 'text', label: 'الدرجة العلمية' },
      { name: 'field', type: 'text', label: 'التخصص' },
      { name: 'institution', type: 'text', label: 'المؤسسة' },
      { name: 'country', type: 'text', label: 'الدولة' },
      { name: 'startYear', type: 'text', label: 'سنة البداية' },
      { name: 'endYear', type: 'text', label: 'سنة النهاية' },
      {
        name: 'inProgress',
        type: 'select',
        label: 'مستمر؟',
        options: [
          { label: 'نعم', value: true },
          { label: 'لا', value: false },
        ],
      },
    ],
  },

  // =========================
  // 3. EXPERIENCE
  // =========================
  {
    id: 'experience',
    title: 'الخبرات',
    repeatable: true,
    name: 'experience',
    fields: [
      { name: 'company', type: 'text', label: 'الشركة' },
      { name: 'position', type: 'text', label: 'الوظيفة' },
      { name: 'startDate', type: 'date', label: 'تاريخ البداية' },
      { name: 'endDate', type: 'date', label: 'تاريخ النهاية' },

      {
        name: 'isCurrent',
        type: 'select',
        label: 'عمل حالي؟',
        options: [
          { label: 'نعم', value: true },
          { label: 'لا', value: false },
        ],
      },

      { name: 'years', type: 'text', label: 'عدد السنوات' },
      { name: 'months', type: 'text', label: 'عدد الأشهر' },
    ],
  },

  // =========================
  // 4. DOCUMENTS
  // =========================
  {
    id: 'documents',
    title: 'المستندات',
    repeatable: true,
    name: 'documents',
    fields: [
      {
        name: 'type',
        type: 'select',
        label: 'نوع المستند',
        options: [
          { label: 'هوية', value: 'ID' },
          { label: 'شهادة', value: 'CERT' },
        ],
      },
      {
        name: 'fileUrl',
        type: 'file',
        label: 'الملف',
      },
    ],
  },

  // =========================
  // 5. CERTIFICATIONS
  // =========================
  {
    id: 'certifications',
    title: 'الشهادات',
    repeatable: true,
    name: 'certifications',
    fields: [
      { name: 'nameAr', type: 'text', label: 'اسم الشهادة (عربي)' },
      { name: 'nameEn', type: 'text', label: 'اسم الشهادة (انجليزي)' },
      { name: 'descriptionAr', type: 'text', label: 'الوصف (عربي)' },
      { name: 'descriptionEn', type: 'text', label: 'الوصف (انجليزي)' },
    ],
  },

  // =========================
  // 6. REVIEW
  // =========================
  {
    id: 'review',
    title: 'مراجعة البيانات',
    type: 'review', // 🔥 خاص
  },
];
