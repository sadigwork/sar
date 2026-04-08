import { FormRenderer } from '@/components/form-renderer';
import { documentsSchema } from '@/forms/schemas/documents.schemas';

export function DocumentsForm({ data, updateData }: any) {
  return (
    <FormRenderer
      schema={[{ name: 'documents', type: 'array', fields: documentsSchema }]}
      defaultValues={{ documents: data }}
      onChange={(val) => updateData(val.documents)}
    />
  );
}
