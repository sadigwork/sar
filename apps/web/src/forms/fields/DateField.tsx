import { useFormContext } from 'react-hook-form';

export function DateField({ name, label, disabled }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label>{label}</label>

      <input type="date" {...register(name)} disabled={disabled} />

      {errors[name] && <p>{errors[name]?.message as string}</p>}
    </div>
  );
}
