'use client';

import { useFormContext, get } from 'react-hook-form';

export function SelectField({ name, label, options = [], disabled }: any) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name);

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <select
        {...register(name)}
        disabled={disabled}
        className="border p-2 rounded w-full"
      >
        <option value="">اختر...</option>

        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
