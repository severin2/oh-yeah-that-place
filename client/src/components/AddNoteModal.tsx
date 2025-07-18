import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { NoteForm } from './NoteForm';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { SearchResult } from '@shared/search';

export function AddNoteModal({
  onSubmit,
  onCancel,
  submitting,
}: {
  onSubmit: (data: {
    title: string;
    note: string;
    notifyEnabled: boolean;
    notifyDistance: number;
    place: SearchResult;
  }) => void;
  onCancel?: () => void;
  submitting?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  const [showSearch, setShowSearch] = useState(true);

  const { results, loading, error, search: performSearch } = usePlaceSearch();

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (text.trim()) {
      performSearch(text);
    }
  };

  const handleSelect = (item: SearchResult) => {
    setSelectedPlace(item);
    setShowSearch(false);
  };

  const handlePickAnother = () => {
    setShowSearch(true);
    setSelectedPlace(null);
  };

  return (
    <View style={styles.container}>
      {showSearch ? (
        <>
          <TextInput
            style={styles.input}
            placeholder='Search for a place...'
            value={search}
            onChangeText={handleSearchChange}
          />
          {loading ? (
            <Text style={styles.loading}>Searching...</Text>
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.placeId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.result}
                  onPress={() => handleSelect(item)}
                  key={item.placeId}
                >
                  <Text style={styles.resultText}>{item.name}</Text>
                  <Text style={styles.resultDescription}>{item.description}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                search.trim() ? (
                  <Text style={styles.empty}>No results found.</Text>
                ) : (
                  <Text style={styles.empty}>Start typing to search for places...</Text>
                )
              }
            />
          )}
        </>
      ) : selectedPlace ? (
        <>
          <View style={styles.selectedRow}>
            <Text style={styles.selectedText}>Selected: {selectedPlace.name}</Text>
            <Button title='Pick another' onPress={handlePickAnother} color='#007AFF' />
          </View>
          <NoteForm
            onSubmit={(data) => onSubmit({ ...data, place: selectedPlace })}
            onCancel={onCancel}
            submitting={submitting}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  result: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    color: '#888',
  },
  loading: {
    padding: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  error: {
    padding: 20,
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 16,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
