import React, { use, useEffect, useState } from 'react';
import { View, Alert, Modal, StyleSheet } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTRPC, useTRPCClient } from '@/api/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { NoteForm } from '../components/NoteForm';

export function MapScreen() {
  const trpc = useTRPC(); // use `import { trpc } from './utils/trpc'` if you're using the singleton pattern
  const { data: notes, refetch: refetchNotes } = useQuery(trpc.placeNote.getNotes.queryOptions());
  const addNote = useMutation(trpc.placeNote.addNote.mutationOptions());

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [regionReady, setRegionReady] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature.');
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

  const handleSubmit = async ({
    title,
    note,
    notifyEnabled,
    notifyDistance,
  }: {
    title: string;
    note: string;
    notifyEnabled: boolean;
    notifyDistance: number;
  }) => {
    if (!selectedCoord) return;

    await addNote.mutate({
      title,
      note,
      notifyEnabled,
      notifyDistance,
      latitude: selectedCoord.latitude,
      longitude: selectedCoord.longitude,
    });

    await refetchNotes();
    setSelectedCoord(null);
    setModalVisible(false);
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
          {notes?.map((n) => (
            <Marker
              key={n.id}
              coordinate={{ latitude: n.latitude, longitude: n.longitude }}
              title={n.title}
              description={n.note}
            />
          ))}
        </MapView>
      )}

      <Modal
        visible={modalVisible}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <NoteForm
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
          submitting={addNote.isPending}
        />
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
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
});
