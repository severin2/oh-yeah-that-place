import { SearchResult } from '@shared/search';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
} from 'react-native';

export function SearchResultItem({ searchResult: item }: { searchResult: SearchResult }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.resultText}>{item.name}</Text>
          {typeof item.rating === 'number' && (
            <Text style={{ fontSize: 14, color: '#444', marginTop: 2 }}>
              ⭐ {item.rating} ({item.userRatingCount ?? 0} reviews)
            </Text>
          )}
        </View>
        <Text style={styles.resultDescription}>{item.description}</Text>
        <Text style={{ fontWeight: 'bold' }}>{item.formattedAddress}</Text>

        {Array.isArray(item.photos) && item.photos.length > 0 && (
          <FlatList
            data={item.photos}
            horizontal
            keyExtractor={(uri, idx) => uri + idx}
            renderItem={({ item: photoUri }) => (
              <Image
                source={{ uri: photoUri }}
                style={{ width: 64, height: 64, marginRight: 8, borderRadius: 6 }}
                resizeMode='cover'
              />
            )}
            style={{ marginTop: 8 }}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
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
