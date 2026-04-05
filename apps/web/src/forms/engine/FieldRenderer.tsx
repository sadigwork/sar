import { TextField } from '../fields/TextField';
import { SelectField } from '../fields/SelectField';
import { DateField } from '../fields/DateField';
import { FileField } from '../fields/FileField';
import { useFieldConditions } from '../../hooks/useFieldConditions';

export function FieldRenderer({ field }) {
  const { isVisible, isDisabled } = useFieldConditions(field);

  if (!isVisible) return null;

  const props = { ...field, disabled: isDisabled };

  switch (field.type) {
    case 'text':
      return <TextField {...props} />;

    case 'select':
      return <SelectField {...props} />;

    case 'date':
      return <DateField {...props} />;

    case 'file':
      return <FileField {...props} />;

    default:
      return null;
  }
}
