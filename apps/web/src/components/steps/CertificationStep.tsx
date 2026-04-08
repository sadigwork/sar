import { FormRenderer } from '@/components/form-renderer';
import { certificationsSchema } from '@/forms/schemas/certifications.schemas';

export function ProfessionalCertificationsForm({ data, updateData }: any) {
  return (
    <FormRenderer
      schema={[
        { name: 'certifications', type: 'array', fields: certificationsSchema },
      ]}
      defaultValues={{ certifications: data }}
      onChange={(val) => updateData(val.certifications)}
    />
  );
}
