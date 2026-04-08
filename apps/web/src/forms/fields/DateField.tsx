// import { useFormContext } from 'react-hook-form';

// export function DateField({ name, label, disabled }) {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext();

//   return (
//     <div>
//       <label>{label}</label>

//       <input type="date" {...register(name)} disabled={disabled} />

//       {errors[name] && <p>{errors[name]?.message as string}</p>}
//     </div>
//   );
// }

'use client';

import { useFormContext, get } from 'react-hook-form';

export function TextField({ name, label, placeholder, disabled }: any) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <input
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
