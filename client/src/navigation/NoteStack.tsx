import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NoteListScreen } from '../screens/NoteListScreen';
import { NoteDetailsScreen } from '../screens/NoteDetailsScreen';

const Stack = createNativeStackNavigator();

export function NoteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Notes' component={NoteListScreen} />
      <Stack.Screen name='NoteDetails' component={NoteDetailsScreen} />
    </Stack.Navigator>
  );
}
