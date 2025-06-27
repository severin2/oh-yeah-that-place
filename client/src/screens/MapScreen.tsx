import React, { use, useEffect, useState } from "react";
import {
  View,
  Alert,
  TextInput,
  Button,
  Modal,
  StyleSheet,
} from "react-native";
import MapView, { Marker, LongPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import { trpc } from "@/api/trpc";

export function MapScreen() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [regionReady, setRegionReady] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { data: notes, refetch: refetchNotes } =
    trpc.placeNote.getNotes.useQuery();

  const addNote = trpc.placeNote.addNote.useMutation();

  useEffect(() => {
    refetchNotes();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleLongPress = (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoord({ latitude, longitude });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!selectedCoord) return;

    addNote.mutate({
      title,
      note,
      latitude: selectedCoord.latitude,
      longitude: selectedCoord.longitude,
    });

    refetchNotes();

    setModalVisible(false);
    setTitle("");
    setNote("");
  };

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          style={{ flex: 1 }}
          showsUserLocation
          onMapReady={() => setRegionReady(true)}
          onLongPress={handleLongPress}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {selectedCoord && <Marker coordinate={selectedCoord} />}
        </MapView>
      )}

      {notes?.map((n) => (
        <Marker
          key={n.id}
          coordinate={{ latitude: n.latitude, longitude: n.longitude }}
          title={n.title}
          description={n.note}
        />
      ))}

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Note"
            style={styles.input}
            value={note}
            onChangeText={setNote}
          />
          <Button title="Save Note" onPress={handleSubmit} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginTop: 80,
    padding: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
});
