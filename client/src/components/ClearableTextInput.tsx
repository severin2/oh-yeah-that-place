import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function ClearableTextInput({
  value,
  onChangeText,
  placeholder,
  style,
  ...props
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  [key: string]: any;
}) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        {...props}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          accessibilityLabel='Clear text'
        >
          <Ionicons name='close-circle' size={20} color='#888' />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    paddingRight: 32,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
