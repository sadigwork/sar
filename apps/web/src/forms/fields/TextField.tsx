import { useFormContext } from 'react-hook-form';

export function TextField({ name, label, placeholder, disabled }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label>{label}</label>

      <input
        {...register(name)}
        placeholder={placeholder}
        disabled={disabled}
        className="input"
      />

      {errors[name] && <p>{errors[name]?.message as string}</p>}
    </div>
  );
}
