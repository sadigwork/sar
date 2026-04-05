import { z } from 'zod';
import { TextField } from '../fields/TextField';
import { SelectField } from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { FileField } from '../fields/FileField';

export const FieldRenderer = ({
  name,
  fieldSchema,
  value,
  onChange,
}: {
  name: string;
  fieldSchema: any;
  value: any;
  onChange: (val: any) => void;
}) => {
  const type = fieldSchema._def?.typeName;

  if (type === 'ZodString')
    return <TextField name={name} value={value} onChange={onChange} />;
  if (type === 'ZodEnum')
    return (
      <SelectField
        name={name}
        value={value}
        options={fieldSchema._def.values}
        onChange={onChange}
      />
    );
  if (type === 'ZodDate')
    return <DateField name={name} value={value} onChange={onChange} />;
  if (
    type === 'ZodEffects' &&
    fieldSchema._def.innerType?._def?.typeName === 'ZodString'
  )
    return <FileField name={name} value={value} onChange={onChange} />;

  return <TextField name={name} value={value} onChange={onChange} />;
};
