import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface NoteFormProps {
  initialTitle?: string;
  initialNote?: string;
  submitting?: boolean;
  onSubmit: (data: {
    title: string;
    note: string;
    notifyEnabled: boolean;
    notifyDistance: number;
  }) => void;
  onCancel?: () => void;
}

export function NoteForm({
  initialTitle = '',
  initialNote = '',
  submitting = false,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [note, setNote] = useState(initialNote);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [notifyDistance, setNotifyDistance] = useState(1000); // default to 1000m

  const handleSliderChange = (value: number) => {
    setNotifyDistance(Math.round(value));
  };

  const handleInputChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num >= 0 && num <= 5000) {
      setNotifyDistance(num);
    } else if (text === '') {
      setNotifyDistance(0);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      note: note.trim(),
      notifyEnabled,
      notifyDistance,
    });
    setTitle('');
    setNote('');
    setNotifyEnabled(false);
    setNotifyDistance(1000);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Title'
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        autoFocus
        returnKeyType='done'
      />
      <TextInput
        placeholder='Note'
        style={[styles.input, styles.noteInput]}
        value={note}
        onChangeText={setNote}
        multiline
      />
      <View style={styles.switchRow}>
        <Switch value={notifyEnabled} onValueChange={setNotifyEnabled} />
        <View style={{ marginLeft: 8 }}>
          <Button
            title={notifyEnabled ? 'Notifications On' : 'Notifications Off'}
            onPress={() => setNotifyEnabled(!notifyEnabled)}
            color={notifyEnabled ? '#4caf50' : '#888'}
          />
        </View>
      </View>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5000}
          step={1}
          value={notifyDistance}
          onValueChange={handleSliderChange}
          minimumTrackTintColor='#4caf50'
          maximumTrackTintColor='#ccc'
        />
        <TextInput
          style={styles.numberInput}
          keyboardType='numeric'
          value={notifyDistance.toString()}
          onChangeText={handleInputChange}
          maxLength={5}
        />
      </View>
      <View style={styles.sliderLabels}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Button title='Near' onPress={() => setNotifyDistance(500)} color='#aaa' />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button title='Middling' onPress={() => setNotifyDistance(2000)} color='#aaa' />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Button title='Far' onPress={() => setNotifyDistance(4000)} color='#aaa' />
        </View>
      </View>

      <Button
        title={submitting ? 'Saving...' : 'Save Note'}
        onPress={handleSubmit}
        disabled={submitting || !title.trim()}
      />
      {onCancel && (
        <View style={{ marginTop: 8 }}>
          <Button title='Cancel' onPress={onCancel} color='#888' />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  noteInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 12,
  },
  numberInput: {
    width: 70,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
