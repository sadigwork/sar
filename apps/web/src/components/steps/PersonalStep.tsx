// // src/components/steps/PersonalStep.tsx

// import { UseFormReturn } from 'react-hook-form';

// export function PersonalStep({ form }: { form: UseFormReturn<any> }) {
//   return (
//     <div className="space-y-4">
//       <input
//         {...form.register('personal.firstName')}
//         placeholder="First Name"
//       />

//       <input {...form.register('personal.lastName')} placeholder="Last Name" />

//       <input
//         {...form.register('personal.email')}
//         type="email"
//         placeholder="Email"
//       />

//       <input {...form.register('personal.phone')} placeholder="Phone" />
//     </div>
//   );
// }
import React from 'react';
import { FormRenderer } from '@/components/form-renderer';
import { personalSchema } from '@/forms/schemas/personal.schemas';

export function PersonalInfoForm({ data, updateData }: any) {
  const stableData = React.useMemo(
    () => ({ personal: data }),
    [JSON.stringify(data)],
  );
  return (
    <FormRenderer
      schema={[{ name: 'personal', type: 'object', fields: personalSchema }]}
      defaultValues={stableData}
      onChange={(val) => updateData(val.personal)}
    />
  );
}
