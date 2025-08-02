import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PlaceNote } from "@shared/api/placeNote";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePlaceNotes } from "../hooks/usePlaceNotes";

export function NoteListScreen() {
  const { data: notes, isLoading, error } = usePlaceNotes();

  type NotesStackParamList = {
    List: undefined;
    Details: { note: PlaceNote };
    Add: undefined;
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<NotesStackParamList>>();

  const handleNotePress = (note: PlaceNote) => {
    navigation.push("Details", {
      note,
    });
  };

  if (isLoading) {
    return <Text style={styles.loading}>Loading notes...</Text>;
  }

  if (error) {
    return (
      <Text style={styles.error}>Error loading notes: {error.message}</Text>
    );
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
  error: {
    padding: 20,
    fontSize: 16,
    color: "red",
  },
  container: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    marginBottom: 4,
  },
  coords: {
    fontSize: 12,
    color: "#666",
  },
});

export default NoteListScreen;
