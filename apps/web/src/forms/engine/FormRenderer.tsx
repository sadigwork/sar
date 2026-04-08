'use client';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';
import { applicationSteps } from '../config/application.steps';

type Props = {
  step: string;
  form: UseFormReturn<any>;
};

export function FormRenderer({ step, form }: Props) {
  const config = applicationSteps.find((s) => s.id === step);

  if (!config) {
    return <div className="text-red-500">Step "{step}" not found</div>;
  }

  // =========================
  // REVIEW
  // =========================
  if (config.type === 'review') {
    return (
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(form.getValues(), null, 2)}
      </pre>
    );
  }

  // =========================
  // 🔁 REPEATABLE
  // =========================
  if (config.repeatable && config.name) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: config.name,
    });

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{config.title}</h2>

        {fields.map((item, index) => (
          <div key={item.id} className="border p-4 rounded space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  form={form}
                  field={{
                    ...field,
                    name: `${config.name}.${index}.${field.name}`, // 🔥
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-sm"
            >
              حذف
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append(Object.fromEntries(config.fields.map((f) => [f.name, ''])))
          }
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          إضافة
        </button>
      </div>
    );
  }

  // =========================
  // NORMAL
  // =========================
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{config.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.fields.map((field) => (
          <FieldRenderer key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}
