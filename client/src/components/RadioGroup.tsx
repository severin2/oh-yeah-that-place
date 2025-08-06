import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

type RadioGroupProps = {
  options: { label: string; value: string }[];
  changed: (value: string[]) => void;
  multiple?: boolean;
};

export function RadioGroup({ options, changed, multiple = false }: RadioGroupProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleValueChange = (value: string, checked: boolean) => {
    if (multiple) {
      let newSelected: string[] = Array.isArray(selected) ? [...selected] : [];
      if (checked) {
        if (!newSelected.includes(value)) newSelected.push(value);
      } else {
        newSelected = newSelected.filter((v) => v !== value);
      }
      setSelected(newSelected);
      changed(newSelected);
    } else {
      if (checked) {
        setSelected([value]);
        changed([value]);
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
              value={selected.includes(option.value)}
              onValueChange={(checked) => handleValueChange(option.value, checked)}
            />
          </View>
        </View>
      ))}
    </>
  );
}
