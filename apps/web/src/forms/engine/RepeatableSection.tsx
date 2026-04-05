'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FieldRenderer } from './FieldRenderer';

export function RepeatableSection({ name, fieldsConfig }) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item.id} className="border p-4 rounded">
          {fieldsConfig.map((field) => (
            <FieldRenderer
              key={field.name}
              field={{
                ...field,
                name: `${name}.${index}.${field.name}`,
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({})}
        className="btn-secondary"
      >
        Add
      </button>
    </div>
  );
}
