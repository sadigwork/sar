// import { UseFormReturn } from 'react-hook-form';

// export function EducationStep({ form }: { form: UseFormReturn<any> }) {
//   return (
//     <div className="space-y-4">
//       <input {...form.register('education.degree')} placeholder="Degree" />

//       <input
//         {...form.register('education.university')}
//         placeholder="University"
//       />

//       <input
//         {...form.register('education.year')}
//         type="number"
//         placeholder="Graduation Year"
//       />
//     </div>
//   );
// }

import { FormRenderer } from '@/components/form-renderer';
import { educationSchema } from '@/forms/schemas/education.schemas';

export function EducationForm({ data, updateData }: any) {
  return (
    <FormRenderer
      schema={[
        {
          name: 'education',
          type: 'array',
          fields: educationSchema,
        },
      ]}
      defaultValues={{ education: data }}
      onChange={(val) => updateData(val.education)}
    />
  );
}
