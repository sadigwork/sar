// import { UseFormReturn } from 'react-hook-form';

// export function ExperienceStep({ form }: { form: UseFormReturn<any> }) {
//   return (
//     <div className="space-y-4">
//       <input {...form.register('experience.company')} placeholder="Company" />

//       <input {...form.register('experience.position')} placeholder="Position" />

//       <input
//         {...form.register('experience.years')}
//         type="number"
//         placeholder="Years of Experience"
//       />
//     </div>
//   );
// }

import { FormRenderer } from '@/components/form-renderer';
import { experienceSchema } from '@/forms/schemas/experience.schemas';

export function ExperienceForm({ data, updateData }: any) {
  return (
    <FormRenderer
      schema={[{ name: 'experience', type: 'array', fields: experienceSchema }]}
      defaultValues={{ experience: data }}
      onChange={(val) => updateData(val.experience)}
    />
  );
}
