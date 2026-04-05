import { useFormContext } from 'react-hook-form';

export function FileField({ name, label }) {
  const { setValue } = useFormContext();

  const handleChange = async (e) => {
    const file = e.target.files[0];

    // TODO: upload to server / S3
    const fakeUrl = URL.createObjectURL(file);

    setValue(name, fakeUrl);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleChange} />
    </div>
  );
}
