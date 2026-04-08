'use client';

import { useFormContext } from 'react-hook-form';

export function FileField({ name, label }: any) {
  const { setValue } = useFormContext();

  const handleChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🔥 مؤقت (preview)
    const previewUrl = URL.createObjectURL(file);

    // 🔥 الأفضل لاحقاً: upload → get URL
    // const uploadedUrl = await uploadToS3(file);

    setValue(name, previewUrl, { shouldValidate: true });
  };

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <input type="file" onChange={handleChange} />
    </div>
  );
}
