import { useFormContext } from 'react-hook-form';

export function SelectField({ name, label, options = [], disabled }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label>{label}</label>

      <select {...register(name)} disabled={disabled}>
        <option value="">Select...</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {errors[name] && <p>{errors[name]?.message as string}</p>}
    </div>
  );
}
