export const mapPersonalToProfile = (data: any) => ({
  fullNameAr: data.fullName,
  fullNameEn: data.fullNameEn,
  nationalId: data.nationalId,
  phone: data.phoneNumber,
  dateOfBirth: data.birthDate ? new Date(data.birthDate) : undefined,
  gender: data.gender,
  address: data.address,
  city: data.city,
  country: data.country,
  specialization: data.specialization,
  graduationYear: data.graduationYear,
  university: data.university,
});

export const mapEducation = (items: any[]) =>
  items.map((e) => ({
    degree: e.degree,
    field: e.field,
    institution: e.institution,
    country: e.country,
    startYear: e.startYear,
    endYear: e.endYear,
    inProgress: e.inProgress,
  }));

export const mapExperience = (items: any[]) =>
  items.map((e) => ({
    company: e.company,
    position: e.position,
    startDate: new Date(e.startDate),
    endDate: e.endDate ? new Date(e.endDate) : null,
    isCurrent: e.isCurrent,
    years: e.years,
    months: e.months,
  }));

export const mapDocuments = (items: any[]) =>
  items.map((d) => ({
    type: d.type,
    fileUrl: d.fileUrl,
  }));

export const mapCertifications = (items: any[]) =>
  items.map((c) => ({
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    descriptionEn: c.descriptionEn,
    descriptionAr: c.descriptionAr,
  }));
