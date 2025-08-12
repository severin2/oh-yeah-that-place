import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { ClearableTextInput } from './ClearableTextInput';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { SearchResult } from '@shared/search';
import { SearchResultItem } from './SearchResultItem';
import { RadioGroup, RadioGroupOption } from './RadioGroup';
import { SearchResultPhotos } from './SearchResultPhotos';

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
  const [note, setNote] = useState('');

  const { results, loading, error, search: performSearch } = usePlaceSearch();

  // Search when input is submitted or after 3s of no typing
  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      performSearch(search);
    }
  };

  React.useEffect(() => {
    if (!search.trim()) return;
    const timeout = setTimeout(() => {
      performSearch(search);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [search, performSearch]);

  const handleSelect = (item: SearchResult) => {
    setSelectedPlace(item);
    setShowSearch(false);
  };

  const handlePickAnother = () => {
    setShowSearch(true);
    setSelectedPlace(null);
  };

  const options: RadioGroupOption[] = useMemo(
    () => [
      { label: <Text>I arrive here</Text>, value: 'arrive' },
      { label: <Text>I'm near here</Text>, value: 'near' },
      { label: <Text>I leave here</Text>, value: 'leave' },
      { label: <Text>I've been here for </Text>, value: 'stay' },
    ],
    []
  );

  const [remindWhen, setRemindWhen] = useState<string[]>(['arrive']);

  return (
    <View style={styles.container}>
      {showSearch ? (
        <>
          <ClearableTextInput
            style={styles.input}
            placeholder='Search for a place...'
            value={search}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType='search'
          />
          {loading ? (
            <View style={{ marginTop: 8 }}>
              {[...Array(4)].map((_, idx) => (
                <View key={idx} style={styles.skeletonResult} />
              ))}
            </View>
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
                  <SearchResultItem searchResult={item} />
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
            <Button title='Pick another' onPress={handlePickAnother} color='#007AFF' />
          </View>
          <SearchResultItem searchResult={selectedPlace} />
          <View style={{ marginTop: 16 }}>
            <SearchResultPhotos photoNames={selectedPlace.photos || []} />
          </View>
          <View style={{ marginTop: 16 }}>
            <Text>Remind me when</Text>
            <RadioGroup
              options={options}
              multiple={true}
              changed={setRemindWhen}
              value={remindWhen}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <ClearableTextInput
              style={styles.noteInput}
              placeholder='Add a note (optional)'
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
          <View style={styles.ctaContainer}>
            <Button
              title='Add to my places'
              onPress={() =>
                onSubmit &&
                selectedPlace &&
                onSubmit({
                  title: selectedPlace.name,
                  note,
                  notifyEnabled: false,
                  notifyDistance: 0,
                  place: selectedPlace,
                })
              }
              color='#34C759'
              disabled={submitting}
            />
          </View>
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
    paddingLeft: 4,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  result: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
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
  skeletonResult: {
    height: 56,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    opacity: 0.6,
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
  noteInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    minHeight: 48,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  ctaContainer: {
    marginTop: 32,
    marginBottom: 8,
  },
});
