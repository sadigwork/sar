import { useFormContext } from 'react-hook-form';

export function useFieldConditions(field) {
  const { watch } = useFormContext();

  const isVisible = field.showIf
    ? watch(field.showIf.field) === field.showIf.value
    : true;

  const isDisabled = field.disableIf
    ? watch(field.disableIf.field) === field.disableIf.value
    : false;

  return { isVisible, isDisabled };
}
