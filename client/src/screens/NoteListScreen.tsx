import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTRPC } from '../api/trpc';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { PlaceNote } from '@shared/placeNote';
import type { RootStackParamList } from '@/navigation/TabNavigator';

export function NoteListScreen() {
  const trpc = useTRPC();
  const { data: notes, isLoading } = useQuery(trpc.placeNote.getNotes.queryOptions());
  const navigation = useNavigation<RootStackParamList>();

  const handleNotePress = (note: PlaceNote) => {
    navigation.push('Details', {
      note,
    });
  };

  if (isLoading) {
    return <Text style={styles.loading}>Loading notes...</Text>;
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleNotePress(item)}>
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
            <Text style={styles.coords}>
              {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    padding: 20,
    fontSize: 16,
  },
  container: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    marginBottom: 4,
  },
  coords: {
    fontSize: 12,
    color: '#666',
  },
});

export default NoteListScreen;
