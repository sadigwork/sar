'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

type Field = {
  name: string;
  label?: string;
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'email'
    | 'textarea'
    | 'checkbox'
    | 'select'
    | 'file';
  options?: { label: string; value: string }[];
};

type ObjectField = {
  name: string;
  label?: string;
  type: 'object';
  fields: Field[];
};

type ArrayField = {
  name: string;
  type: 'array';
  fields: Field[];
};

type SchemaField = Field | ArrayField | ObjectField;

type Props = {
  schema: SchemaField[];
  defaultValues?: Record<string, unknown>;
  onChange?: (data: Record<string, unknown>) => void;
};

export function FormRenderer({ schema, defaultValues = {}, onChange }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    defaultValues,
  });

  const { register, control, watch, reset } = form;

  const defaultValuesJson = useMemo(
    () => JSON.stringify(defaultValues),
    [defaultValues],
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValuesJson, reset]);

  // 🔥 Autosync with parent
  useEffect(() => {
    const sub = watch((values) => {
      onChange?.(values);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  // =========================
  // Render Field
  // =========================
  const renderField = (field: Field | ObjectField, namePrefix = '') => {
    const fieldName = namePrefix ? `${namePrefix}.${field.name}` : field.name;

    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'email':
        return (
          <input
            {...register(fieldName)}
            type={field.type}
            placeholder={field.label}
            className="border p-2 rounded w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700"
          />
        );
      case 'object':
        return (
          <div className="space-y-4">
            {field.label ? (
              <div className="font-semibold text-gray-700 dark:text-gray-200">
                {field.label}
              </div>
            ) : null}
            {field.fields.map((subField) => (
              <div key={subField.name}>
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  {subField.label}
                </label>
                {renderField(subField, fieldName)}
              </div>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            {...register(fieldName)}
            placeholder={field.label}
            className="border p-2 rounded w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700"
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register(fieldName)} />
            {field.label}
          </label>
        );

      case 'select':
        return (
          <select
            {...register(fieldName)}
            className="border p-2 rounded w-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700"
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              // 🔥 مؤقت: نخزن file object
              form.setValue(fieldName, file);
            }}
          />
        );

      default:
        return null;
    }
  };

  // =========================
  // Render Array Field
  // =========================
  const renderArray = (field: ArrayField) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { fields, append, remove } = useFieldArray<any>({
      control,
      name: field.name,
    });

    return (
      <div className="space-y-4">
        <h3 className="font-bold">{field.name}</h3>

        {fields.map((item, index) => (
          <div key={item.id} className="border p-4 rounded space-y-2">
            {field.fields.map((subField) => (
              <div key={subField.name}>
                <label className="text-sm text-gray-600">
                  {subField.label}
                </label>
                {renderField(subField, `${field.name}.${index}`)}
              </div>
            ))}

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => append({} as any)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          + Add {field.name}
        </button>
      </div>
    );
  };

  // =========================
  // Render Schema
  // =========================
  return (
    <form className="space-y-4">
      {schema.map((field) => {
        if (field.type === 'array') {
          return <div key={field.name}>{renderArray(field as ArrayField)}</div>;
        }

        return (
          <div key={field.name}>
            <label className="text-sm text-gray-600">{field.label}</label>
            {renderField(field as Field)}
          </div>
        );
      })}
    </form>
  );
}
