export function mapDraftToForm(step: string, draft: any) {
  if (!draft) return {};

  switch (step) {
    case 'personal':
      return {
        fullName: draft.profile?.fullNameAr || '',
        fullNameEn: draft.profile?.fullNameEn || '',
        nationalId: draft.profile?.nationalId || '',
        phoneNumber: draft.profile?.phone || '',
        birthDate: draft.profile?.dateOfBirth
          ? new Date(draft.profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: draft.profile?.gender || '',
        address: draft.profile?.address || '',
        city: draft.profile?.city || '',
        country: draft.profile?.country || '',
        specialization: draft.profile?.specialization || '',
        graduationYear: draft.profile?.graduationYear?.toString() || '',
        university: draft.profile?.university || '',
      };

    case 'education':
      return draft.profile?.educations || [];

    case 'experience':
      return (draft.profile?.experiences || []).map((exp) => ({
        ...exp,
        startDate: exp.startDate?.split('T')[0],
        endDate: exp.endDate?.split('T')[0],
      }));

    case 'documents':
      return draft.documents || [];

    case 'certifications':
      return draft.profile?.certifications || [];

    default:
      return {};
  }
}
