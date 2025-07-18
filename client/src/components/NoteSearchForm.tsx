import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Result = { id: string; name: string };
const MOCK_RESULTS: Result[] = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  name: `Place ${i + 1}`,
}));

export function NoteSearchForm({
  onSelect,
}: {
  onSelect?: (result: { id: string; name: string }) => void;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([] as Result[]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    setLoading(true);
    setTimeout(() => {
      if (!text) {
        setResults([]);
        setLoading(false);
        return;
      }
      setResults(
        MOCK_RESULTS.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
      );
      setLoading(false);
    }, 600); // 600ms fake API delay
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Search for a place...'
        value={search}
        onChangeText={handleSearchChange}
      />
      {loading ? (
        <Text style={styles.loading}>Searching...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.result} onPress={() => onSelect?.(item)}>
              <Text style={styles.resultText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No results found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
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
});
