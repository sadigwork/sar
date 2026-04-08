'use client';

import { UseFormReturn } from 'react-hook-form';
import { TextField } from '../fields/TextField';
import { SelectField } from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { FileField } from '../fields/FileField';
import { CheckboxField } from '../fields/CheckboxField';
import { useFieldConditions } from '../../hooks/useFieldConditions';

type Props = {
  field: any;
  form: UseFormReturn<any>;
};

export function FieldRenderer({ field, form }: Props) {
  const { isVisible, isDisabled } = useFieldConditions(field);

  if (!isVisible) return null;

  const props = {
    ...field,
    form, // 🔥 مهم
    disabled: isDisabled,
  };

  switch (field.type) {
    case 'text':
      return <TextField {...props} />;

    case 'select':
      return <SelectField {...props} />;

    case 'date':
      return <DateField {...props} />;

    case 'file':
      return <FileField {...props} />;
    case 'checkbox':
      return <CheckboxField {...props} />;

    default:
      return null;
  }
}

// 'use client';

// import { UseFormReturn, useFieldArray } from 'react-hook-form';

// type Field = {
//   name: string;
//   label?: string;
//   type: string;
//   options?: { label: string; value: string }[];

//   // 🔥 array support
//   isArray?: boolean;
//   fields?: Field[];
// };

// type Props = {
//   field: Field;
//   form: UseFormReturn<any>;
//   namePrefix?: string;
// };

// export function FieldRenderer({ field, form, namePrefix = '' }: Props) {
//   const { register, control, setValue } = form;

//   const fieldName = namePrefix ? `${namePrefix}.${field.name}` : field.name;

//   // =========================
//   // 🔥 ARRAY SUPPORT
//   // =========================
//   if (field.isArray && field.fields) {
//     const { fields, append, remove } = useFieldArray({
//       control,
//       name: fieldName,
//     });

//     return (
//       <div className="col-span-2 space-y-4">
//         <h3 className="font-semibold">{field.label || field.name}</h3>

//         {fields.map((item, index) => (
//           <div key={item.id} className="border p-4 rounded space-y-3">
//             {field.fields.map((subField) => (
//               <FieldRenderer
//                 key={subField.name}
//                 field={subField}
//                 form={form}
//                 namePrefix={`${fieldName}.${index}`}
//               />
//             ))}

//             <button
//               type="button"
//               onClick={() => remove(index)}
//               className="text-red-500 text-sm"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={() => append({})}
//           className="bg-gray-200 px-3 py-1 rounded"
//         >
//           + Add
//         </button>
//       </div>
//     );
//   }

//   // =========================
//   // NORMAL FIELDS
//   // =========================

//   switch (field.type) {
//     case 'text':
//     case 'number':
//     case 'email':
//     case 'date':
//       return (
//         <div>
//           <label className="text-sm text-gray-600">{field.label}</label>
//           <input
//             {...register(fieldName)}
//             type={field.type}
//             className="border p-2 rounded w-full"
//           />
//         </div>
//       );

//     case 'textarea':
//       return (
//         <div className="col-span-2">
//           <label>{field.label}</label>
//           <textarea
//             {...register(fieldName)}
//             className="border p-2 rounded w-full"
//           />
//         </div>
//       );

//     case 'checkbox':
//       return (
//         <label className="flex items-center gap-2">
//           <input type="checkbox" {...register(fieldName)} />
//           {field.label}
//         </label>
//       );

//     case 'select':
//       return (
//         <div>
//           <label>{field.label}</label>
//           <select
//             {...register(fieldName)}
//             className="border p-2 rounded w-full"
//           >
//             <option value="">Select...</option>
//             {field.options?.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       );

//     case 'file':
//       return (
//         <div>
//           <label>{field.label}</label>
//           <input
//             type="file"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (!file) return;
//               setValue(fieldName, file);
//             }}
//           />
//         </div>
//       );

//     default:
//       return null;
//   }
// }
