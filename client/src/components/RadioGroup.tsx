import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

export type RadioGroupOption = {
  label: React.ReactNode;
  value: string;
};
type RadioGroupProps = {
  options: { label: string; value: string }[];
  changed: (value: string | string[]) => void;
  multiple?: boolean;
  value?: string | string[];
  initialSelected?: string | string[];
};

export function RadioGroup({
  options,
  changed,
  multiple = false,
  value,
  initialSelected,
}: RadioGroupProps) {
  // Controlled: use value prop, Uncontrolled: use internal state
  const getInitial = () => {
    if (multiple) {
      if (Array.isArray(initialSelected)) return initialSelected;
      return [];
    } else {
      if (typeof initialSelected === 'string') return initialSelected;
      return options.length > 0 ? options[0].value : null;
    }
  };
  const [internalSelected, setInternalSelected] = useState<string | string[] | null>(getInitial());
  const selected = value !== undefined ? value : internalSelected;

  const handleValueChange = (val: string, checked: boolean) => {
    if (multiple) {
      let newSelected: string[] = Array.isArray(selected) ? [...selected] : [];
      if (checked) {
        if (!newSelected.includes(val)) newSelected.push(val);
      } else {
        newSelected = newSelected.filter((v) => v !== val);
      }
      if (value === undefined) setInternalSelected(newSelected);
      changed(newSelected);
    } else {
      if (checked) {
        if (value === undefined) setInternalSelected(val);
        changed(val);
      }
    }
  };

  return (
    <>
      {options.map((option) => (
        <View key={option.value} style={{ flexDirection: 'column' }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text>{option.label}</Text>
            <Switch
              value={
                multiple
                  ? Array.isArray(selected) && selected.includes(option.value)
                  : selected === option.value
              }
              onValueChange={(checked) => handleValueChange(option.value, checked)}
            />
          </View>
        </View>
      ))}
    </>
  );
}
