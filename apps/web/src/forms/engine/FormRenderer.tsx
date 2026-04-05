// 'use client';

// import { useStepAutosave } from '../../hooks/useStepAutosave';
// import { FieldRenderer } from './FieldRenderer';
// import { z } from 'zod';

// // const { isSaving } = useStepAutosave({
// //   form,
// //   step: config.id,
// // });

// export const FormRenderer = ({
//   stepId,
//   schema,
//   data,
//   onChange,
// }: {
//   stepId: string;
//   schema: z.ZodTypeAny;
//   data: any;
//   onChange: (val: any) => void;
// }) => {
//   const shape = (schema as any)._def.shape();
//   return (
//     <div className="space-y-4">
//       {Object.keys(shape).map((key) => (
//         <FieldRenderer
//           key={key}
//           name={key}
//           fieldSchema={shape[key]}
//           value={data?.[key]}
//           onChange={(val) => onChange({ ...data, [key]: val })}
//         />
//       ))}
//     </div>
//   );
// };

import { UseFormReturn } from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';
import { applicationSteps } from '../config/application.steps';

type Props = {
  step: string;
  form: UseFormReturn<any>;
};

export function FormRenderer({ step, form }: Props) {
  // 🔎 الحصول على إعدادات الخطوة
  const config = applicationSteps.find((s) => s.id === step);

  if (!config) {
    return <div className="text-red-500">Step "{step}" not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* 🧭 عنوان الخطوة */}
      <div>
        <h2 className="text-xl font-semibold">{config.title}</h2>
        {config.description && (
          <p className="text-gray-500 text-sm">{config.description}</p>
        )}
      </div>

      {/* 🧩 الحقول */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.fields.map((field) => (
          <FieldRenderer key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}
