'use client';

import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

type LanguageContextType = {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    home: 'Home',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    qualifications: 'Qualifications',
    certification: 'Certification',
    admin: 'Admin',
    logout: 'Logout',
    welcome: 'Welcome to the Professional Registration Management System',
    welcomeDesc:
      'Register, manage your professional profile, and apply for certification',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    personalInfo: 'Personal Information',
    academicDegrees: 'Academic Degrees',
    trainingCourses: 'Training Courses',
    workExperience: 'Work Experience',
    academicPapers: 'Academic Papers',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Submit',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    university: 'University',
    degree: 'Degree',
    graduationYear: 'Graduation Year',
    uploadCertificate: 'Upload Certificate',
    courseName: 'Course Name',
    institution: 'Institution',
    completionDate: 'Completion Date',
    duration: 'Duration',
    employer: 'Employer',
    position: 'Position',
    startDate: 'Start Date',
    endDate: 'End Date',
    paperTitle: 'Paper Title',
    publication: 'Publication',
    publicationYear: 'Publication Year',
    authors: 'Authors',
    applyCertification: 'Apply for Certification',
    certificationLevel: 'Certification Level',
    applicationStatus: 'Application Status',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    footer:
      '© 2023 Professional Registration Management System. All rights reserved.',
    switchLanguage: 'العربية',
    // About page translations
    aboutTitle: 'About the Engineering Classification System',
    aboutDescription:
      'Learn about our mission, vision, and the services we provide to the engineering community.',
    mission: 'Our Mission',
    missionContent:
      'To establish and maintain a comprehensive classification system for engineers that ensures high standards of professional practice, promotes continuous development, and serves the public interest by verifying the qualifications and competence of engineering professionals.',
    vision: 'Our Vision',
    visionContent:
      'To be the leading authority in engineering classification, recognized for excellence in establishing and upholding professional standards that contribute to the advancement of the engineering profession and society as a whole.',
    values: 'Our Values',
    integrity: 'Integrity',
    integrityDesc:
      'We uphold the highest ethical standards in all our operations and decisions.',
    excellence: 'Excellence',
    excellenceDesc:
      'We strive for excellence in our services and in the standards we set for the engineering profession.',
    innovation: 'Innovation',
    innovationDesc:
      'We embrace innovation and encourage the development of new ideas and approaches in engineering practice.',
    collaboration: 'Collaboration',
    collaborationDesc:
      'We work collaboratively with engineers, institutions, and stakeholders to achieve our mission.',
    accountability: 'Accountability',
    accountabilityDesc:
      'We are accountable for our actions and decisions, and we expect the same from the engineers we classify.',
    services: 'Our Services',
    engineerClassification: 'Engineer Classification',
    engineerClassificationDesc:
      'We classify engineers based on their qualifications, experience, and competence, providing a recognized standard for employers and clients.',
    professionalCertification: 'Professional Certification',
    professionalCertificationDesc:
      'We offer professional certification programs that validate the specialized knowledge and skills of engineers in various disciplines.',
    fellowshipPrograms: 'Fellowship Programs',
    fellowshipProgramsDesc:
      'We recognize distinguished engineers through our fellowship programs, acknowledging their significant contributions to the profession.',
    institutionDirectory: 'Institution Directory',
    institutionDirectoryDesc:
      'We maintain a comprehensive directory of engineering institutions, providing a valuable resource for networking and collaboration.',
    continuingEducation: 'Continuing Education',
    continuingEducationDesc:
      'We promote continuing education and professional development through workshops, seminars, and online courses.',
    publications: 'Publications',
    publicationsDesc:
      'We publish reports, guidelines, and best practices to support the engineering community and advance the profession.',
    faq: 'Frequently Asked Questions',
    faqQuestion1: 'What is the Engineering Classification System?',
    faqAnswer1:
      'The Engineering Classification System is a comprehensive framework for categorizing and recognizing engineers based on their qualifications, experience, and competence. It provides a standardized way to assess and verify the professional capabilities of engineers across various disciplines.',
    faqQuestion2: 'How do I apply for classification?',
    faqAnswer2:
      'To apply for classification, you need to create an account on our platform, complete your profile with your educational and professional information, and submit an application. The application process involves providing documentation of your qualifications and experience, which will be reviewed by our team of experts.',
    faqQuestion3: 'What are the benefits of being classified?',
    faqAnswer3:
      'Being classified provides recognition of your professional status, enhances your credibility with employers and clients, opens up career opportunities, and gives you access to a network of fellow professionals. It also demonstrates your commitment to maintaining high standards in your engineering practice.',
    faqQuestion4: 'How often do I need to renew my classification?',
    faqAnswer4:
      'Classifications need to be renewed every three years. The renewal process involves updating your professional information and demonstrating continued professional development through activities such as attending workshops, completing courses, or publishing papers.',
    faqQuestion5:
      'What is the difference between classification and certification?',
    faqAnswer5:
      'Classification is a broader recognition of your overall professional status as an engineer, while certification focuses on validating your specialized knowledge and skills in a specific area of engineering. Many engineers hold both a classification and one or more certifications.',
    history: 'Our History',
    historyContent:
      'The Engineering Classification System was established in 2010 in response to the growing need for a standardized way to recognize and verify the qualifications and competence of engineers. Since then, we have classified thousands of engineers, developed comprehensive certification programs, and built a reputation for excellence in upholding professional standards.',
    contact: 'Contact Us',
    // Qualifications page translations
    education: 'Education',
    publications: 'Publications',
    experience: 'Experience',
    certifications: 'Certifications',
    addEducation: 'Add Education',
    editEducation: 'Edit Education',
    educationDescription: 'Add your academic degrees and qualifications',
    selectDegree: 'Select Degree',
    enterInstitution: 'Enter Institution Name',
    fieldOfStudy: 'Field of Study',
    enterField: 'Enter Field of Study',
    certificate: 'Certificate',
    uploadCertificateDescription:
      'Upload your degree certificate (PDF, JPG, PNG)',
    update: 'Update',
    yourEducation: 'Your Education',
    noEducationAdded: 'No education records added yet',
    confirmDelete: 'Confirm Delete',
    deleteEducationConfirmation:
      'Are you sure you want to delete this education record?',
    viewCertificate: 'View Certificate',
    addPublication: 'Add Publication',
    editPublication: 'Edit Publication',
    publicationDescription: 'Add your academic papers and publications',
    title: 'Title',
    enterTitle: 'Enter Publication Title',
    journal: 'Journal/Conference',
    enterJournal: 'Enter Journal or Conference Name',
    publicationDate: 'Publication Date',
    link: 'Link',
    enterLink: 'Enter Publication Link',
    optionalLink: 'Optional link to the publication',
    document: 'Document',
    uploadPublicationDescription: 'Upload your publication document (PDF)',
    yourPublications: 'Your Publications',
    noPublicationsAdded: 'No publications added yet',
    deletePublicationConfirmation:
      'Are you sure you want to delete this publication?',
    viewPublication: 'View Publication',
    viewDocument: 'View Document',
    addExperience: 'Add Experience',
    editExperience: 'Edit Experience',
    experienceDescription: 'Add your work experience',
    jobTitle: 'Job Title',
    enterJobTitle: 'Enter Job Title',
    company: 'Company',
    enterCompany: 'Enter Company Name',
    description: 'Description',
    enterJobDescription: 'Enter job responsibilities and achievements',
    experienceCertificate: 'Experience Certificate',
    uploadExperienceCertificateDescription:
      'Upload your experience certificate (PDF, JPG, PNG)',
    yourExperience: 'Your Experience',
    noExperienceAdded: 'No experience records added yet',
    deleteExperienceConfirmation:
      'Are you sure you want to delete this experience record?',
    viewExperienceCertificate: 'View Experience Certificate',
    addCertification: 'Add Certification',
    editCertification: 'Edit Certification',
    certificationDescription: 'Add your professional certifications',
    certificationName: 'Certification Name',
    enterCertificationName: 'Enter Certification Name',
    issuer: 'Issuing Organization',
    enterIssuer: 'Enter Issuing Organization',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    uploadCertificationDescription:
      'Upload your certification document (PDF, JPG, PNG)',
    yourCertifications: 'Your Certifications',
    noCertificationsAdded: 'No certifications added yet',
    deleteCertificationConfirmation:
      'Are you sure you want to delete this certification?',
    in: 'in',
    present: 'Present',
    currentlyWorkHere: 'I currently work here',
    optional: 'Optional',
    attachedFile: 'Attached file',
    enterDegreeDetails: 'Enter your degree details',
    enterPublicationDetails: 'Enter your publication details',
    enterExperienceDetails: 'Enter your work experience details',
    enterCertificationDetails: 'Enter your certification details',
    publicationLink: 'Publication Link',
    diploma: 'Diploma',
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    phd: 'PhD',
  },
  ar: {
    home: 'الرئيسية',
    login: 'تسجيل الدخول',
    register: 'تسجيل جديد',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    qualifications: 'المؤهلات',
    certification: 'الشهادات المهنية',
    admin: 'الإدارة',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبًا بك في نظام إدارة التسجيل المهني',
    welcomeDesc: 'سجل وأدر ملفك المهني وتقدم بطلب للحصول على الشهادة المهنية',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    personalInfo: 'المعلومات الشخصية',
    academicDegrees: 'الدرجات العلمية',
    trainingCourses: 'الدورات التدريبية',
    workExperience: 'الخبرة العملية',
    academicPapers: 'الأوراق العلمية',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    submit: 'إرسال',
    save: 'حفظ',
    cancel: 'إلغاء',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    university: 'الجامعة',
    degree: 'الدرجة العلمية',
    graduationYear: 'سنة التخرج',
    uploadCertificate: 'تحميل الشهادة',
    courseName: 'اسم الدورة',
    institution: 'المؤسسة',
    completionDate: 'تاريخ الإتمام',
    duration: 'المدة',
    employer: 'جهة العمل',
    position: 'المنصب',
    startDate: 'تاريخ البدء',
    endDate: 'تاريخ الانتهاء',
    paperTitle: 'عنوان الورقة',
    publication: 'جهة النشر',
    publicationYear: 'سنة النشر',
    authors: 'المؤلفون',
    applyCertification: 'التقدم للحصول على شهادة مهنية',
    certificationLevel: 'مستوى الشهادة',
    applicationStatus: 'حالة الطلب',
    pending: 'قيد المراجعة',
    approved: 'تمت الموافقة',
    rejected: 'مرفوض',
    footer: '© 2023 نظام إدارة التسجيل المهني. جميع الحقوق محفوظة.',
    switchLanguage: 'English',
    // About page translations
    aboutTitle: 'حول نظام تصنيف المهندسين',
    aboutDescription:
      'تعرف على رسالتنا ورؤيتنا والخدمات التي نقدمها لمجتمع الهندسة.',
    mission: 'رسالتنا',
    missionContent:
      'إنشاء والحفاظ على نظام تصنيف شامل للمهندسين يضمن معايير عالية للممارسة المهنية، ويعزز التطوير المستمر، ويخدم المصلحة العامة من خلال التحقق من مؤهلات وكفاءة المهنيين الهندسيين.',
    vision: 'رؤيتنا',
    visionContent:
      'أن نكون السلطة الرائدة في تصنيف الهندسة، معترف بها للتميز في وضع والحفاظ على المعايير المهنية التي تساهم في تقدم مهنة الهندسة والمجتمع ككل.',
    values: 'قيمنا',
    integrity: 'النزاهة',
    integrityDesc:
      'نحن نلتزم بأعلى المعايير الأخلاقية في جميع عملياتنا وقراراتنا.',
    excellence: 'التميز',
    excellenceDesc:
      'نحن نسعى للتميز في خدماتنا وفي المعايير التي نضعها لمهنة الهندسة.',
    innovation: 'الابتكار',
    innovationDesc:
      'نحن نتبنى الابتكار ونشجع تطوير أفكار ونهج جديدة في الممارسة الهندسية.',
    collaboration: 'التعاون',
    collaborationDesc:
      'نحن نعمل بشكل تعاوني مع المهندسين والمؤسسات وأصحاب المصلحة لتحقيق مهمتنا.',
    accountability: 'المساءلة',
    accountabilityDesc:
      'نحن مسؤولون عن أفعالنا وقراراتنا، ونتوقع نفس الشيء من المهندسين الذين نصنفهم.',
    services: 'خدماتنا',
    engineerClassification: 'تصنيف المهندسين',
    engineerClassificationDesc:
      'نحن نصنف المهندسين بناءً على مؤهلاتهم وخبراتهم وكفاءتهم، مما يوفر معيارًا معترفًا به لأصحاب العمل والعملاء.',
    professionalCertification: 'الشهادات المهنية',
    professionalCertificationDesc:
      'نحن نقدم برامج الشهادات المهنية التي تثبت المعرفة والمهارات المتخصصة للمهندسين في مختلف التخصصات.',
    fellowshipPrograms: 'برامج الزمالة',
    fellowshipProgramsDesc:
      'نحن نعترف بالمهندسين المتميزين من خلال برامج الزمالة لدينا، معترفين بمساهماتهم الكبيرة في المهنة.',
    institutionDirectory: 'دليل المؤسسات',
    institutionDirectoryDesc:
      'نحن نحتفظ بدليل شامل للمؤسسات الهندسية، مما يوفر موردًا قيمًا للتواصل والتعاون.',
    continuingEducation: 'التعليم المستمر',
    continuingEducationDesc:
      'نحن نعزز التعليم المستمر والتطوير المهني من خلال ورش العمل والندوات والدورات عبر الإنترنت.',
    publications: 'المنشورات',
    publicationsDesc:
      'نحن ننشر التقارير والإرشادات وأفضل الممارسات لدعم المجتمع الهندسي وتقدم المهنة.',
    faq: 'الأسئلة الشائعة',
    faqQuestion1: 'ما هو نظام تصنيف المهندسين؟',
    faqAnswer1:
      'نظام تصنيف المهندسين هو إطار شامل لتصنيف والاعتراف بالمهندسين بناءً على مؤهلاتهم وخبراتهم وكفاءتهم. يوفر طريقة موحدة لتقييم والتحقق من القدرات المهنية للمهندسين عبر مختلف التخصصات.',
    faqQuestion2: 'كيف أتقدم للتصنيف؟',
    faqAnswer2:
      'للتقدم للتصنيف، تحتاج إلى إنشاء حساب على منصتنا، وإكمال ملفك الشخصي بمعلوماتك التعليمية والمهنية، وتقديم طلب. تتضمن عملية التقديم توفير وثائق لمؤهلاتك وخبرتك، والتي ستتم مراجعتها من قبل فريق الخبراء لدينا.',
    faqQuestion3: 'ما هي فوائد التصنيف؟',
    faqAnswer3:
      'يوفر التصنيف اعترافًا بوضعك المهني، ويعزز مصداقيتك مع أصحاب العمل والعملاء، ويفتح فرص عمل، ويمنحك الوصول إلى شبكة من الزملاء المهنيين. كما أنه يظهر التزامك بالحفاظ على معايير عالية في ممارستك الهندسية.',
    faqQuestion4: 'كم مرة أحتاج إلى تجديد تصنيفي؟',
    faqAnswer4:
      'يجب تجديد التصنيفات كل ثلاث سنوات. تتضمن عملية التجديد تحديث معلوماتك المهنية وإظهار التطوير المهني المستمر من خلال أنشطة مثل حضور ورش العمل، وإكمال الدورات، أو نشر الأوراق.',
    faqQuestion5: 'ما هو الفرق بين التصنيف والشهادة؟',
    faqAnswer5:
      'التصنيف هو اعتراف أوسع بوضعك المهني العام كمهندس، بينما تركز الشهادة على التحقق من معرفتك ومهاراتك المتخصصة في مجال محدد من الهندسة. يحمل العديد من المهندسين كلاً من التصنيف وشهادة واحدة أو أكثر.',
    history: 'تاريخنا',
    historyContent:
      'تم إنشاء نظام تصنيف المهندسين في عام 2010 استجابة للحاجة المتزايدة لطريقة موحدة للاعتراف والتحقق من مؤهلات وكفاءة المهندسين. منذ ذلك الحين، قمنا بتصنيف آلاف المهندسين، وتطوير برامج شهادات شاملة، وبناء سمعة للتميز في الحفاظ على المعايير المهنية.',
    contact: 'اتصل بنا',
    // Qualifications page translations
    education: 'التعليم',
    publications: 'المنشورات',
    experience: 'الخبرة',
    certifications: 'الشهادات',
    addEducation: 'إضافة مؤهل تعليمي',
    editEducation: 'تعديل مؤهل تعليمي',
    educationDescription: 'أضف درجاتك العلمية ومؤهلاتك الأكاديمية',
    selectDegree: 'اختر الدرجة العلمية',
    enterInstitution: 'أدخل اسم المؤسسة التعليمية',
    fieldOfStudy: 'مجال الدراسة',
    enterField: 'أدخل مجال الدراسة',
    certificate: 'الشهادة',
    uploadCertificateDescription:
      'قم بتحميل شهادة الدرجة العلمية (PDF, JPG, PNG)',
    update: 'تحديث',
    yourEducation: 'مؤهلاتك التعليمية',
    noEducationAdded: 'لم تتم إضافة أي مؤهلات تعليمية بعد',
    confirmDelete: 'تأكيد الحذف',
    deleteEducationConfirmation:
      'هل أنت متأكد من رغبتك في حذف هذا المؤهل التعليمي؟',
    viewCertificate: 'عرض الشهادة',
    addPublication: 'إضافة منشور علمي',
    editPublication: 'تعديل منشور علمي',
    publicationDescription: 'أضف أوراقك العلمية ومنشوراتك',
    title: 'العنوان',
    enterTitle: 'أدخل عنوان المنشور',
    journal: 'المجلة/المؤتمر',
    enterJournal: 'أدخل اسم المجلة أو المؤتمر',
    publicationDate: 'تاريخ النشر',
    link: 'الرابط',
    enterLink: 'أدخل رابط المنشور',
    optionalLink: 'رابط اختياري للمنشور',
    document: 'المستند',
    uploadPublicationDescription: 'قم بتحميل مستند المنشور (PDF)',
    yourPublications: 'منشوراتك العلمية',
    noPublicationsAdded: 'لم تتم إضافة أي منشورات علمية بعد',
    deletePublicationConfirmation:
      'هل أنت متأكد من رغبتك في حذف هذا المنشور العلمي؟',
    viewPublication: 'عرض المنشور',
    viewDocument: 'عرض المستند',
    addExperience: 'إضافة خبرة عملية',
    editExperience: 'تعديل خبرة عملية',
    experienceDescription: 'أضف خبراتك العملية',
    jobTitle: 'المسمى الوظيفي',
    enterJobTitle: 'أدخل المسمى الوظيفي',
    company: 'الشركة',
    enterCompany: 'أدخل اسم الشركة',
    description: 'الوصف',
    enterJobDescription: 'أدخل المسؤوليات والإنجازات الوظيفية',
    experienceCertificate: 'شهادة الخبرة',
    uploadExperienceCertificateDescription:
      'قم بتحميل شهادة الخبرة (PDF, JPG, PNG)',
    yourExperience: 'خبراتك العملية',
    noExperienceAdded: 'لم تتم إضافة أي خبرات عملية بعد',
    deleteExperienceConfirmation:
      'هل أنت متأكد من رغبتك في حذف هذه الخبرة العملية؟',
    viewExperienceCertificate: 'عرض شهادة الخبرة',
    addCertification: 'إضافة شهادة مهنية',
    editCertification: 'تعديل شهادة مهنية',
    certificationDescription: 'أضف شهاداتك المهنية',
    certificationName: 'اسم الشهادة',
    enterCertificationName: 'أدخل اسم الشهادة',
    issuer: 'الجهة المانحة',
    enterIssuer: 'أدخل اسم الجهة المانحة',
    issueDate: 'تاريخ الإصدار',
    expiryDate: 'تاريخ الانتهاء',
    uploadCertificationDescription: 'قم بتحميل مستند الشهادة (PDF, JPG, PNG)',
    yourCertifications: 'شهاداتك المهنية',
    noCertificationsAdded: 'لم تتم إضافة أي شهادات مهنية بعد',
    deleteCertificationConfirmation:
      'هل أنت متأكد من رغبتك في حذف هذه الشهادة المهنية؟',
    in: 'في',
    present: 'حتى الآن',
    currentlyWorkHere: 'أعمل حاليًا في هذه الوظيفة',
    optional: 'اختياري',
    attachedFile: 'الملف المرفق',
    enterDegreeDetails: 'أدخل تفاصيل الدرجة العلمية',
    enterPublicationDetails: 'أدخل تفاصيل المنشور العلمي',
    enterExperienceDetails: 'أدخل تفاصيل الخبرة العملية',
    enterCertificationDetails: 'أدخل تفاصيل الشهادة المهنية',
    publicationLink: 'رابط المنشور',
    diploma: 'دبلوم',
    bachelor: 'بكالوريوس',
    master: 'ماجستير',
    phd: 'دكتوراه',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if language is stored in localStorage
    const storedLanguage = localStorage.getItem('language') as Language;
    if (
      storedLanguage &&
      (storedLanguage === 'ar' || storedLanguage === 'en')
    ) {
      setLanguageState(storedLanguage);
      setDirection(storedLanguage === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  useEffect(() => {
    // Set direction attribute on html element
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', lang);

    // Refresh the current page to apply language changes
    router.refresh();
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
