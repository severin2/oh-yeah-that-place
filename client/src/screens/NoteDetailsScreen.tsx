import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { PlaceNote } from "@shared/trpc/index";

type RootStackParamList = {
  NoteDetails: { note: PlaceNote };
};

export function NoteDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "NoteDetails">>();
  const { note } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      {note.note ? <Text style={styles.note}>{note.note}</Text> : null}
      <Text style={styles.meta}>Lat: {note.latitude.toFixed(5)}</Text>
      <Text style={styles.meta}>Lng: {note.longitude.toFixed(5)}</Text>
      <Text style={styles.meta}>
        Created: {new Date(note.createdAt).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 8,
  },
  note: {
    fontSize: 16,
    marginBottom: 12,
  },
  meta: {
    fontSize: 12,
    color: "#555",
  },
});
