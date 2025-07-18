import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddNoteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Note</Text>
      {/* Add your note form here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AddNoteScreen;
