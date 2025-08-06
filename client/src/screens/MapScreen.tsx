import { AddNoteModal } from '@/components/AddNoteModal';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { LongPressEvent, Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlaceNotes, useCreatePlaceNote } from '../hooks/usePlaceNotes';

enum ModalState {
  None,
  ExistingNote,
  NewNote,
}

export function MapScreen() {
  const { data: notes, refetch: refetchNotes } = usePlaceNotes();
  const createNoteMutation = useCreatePlaceNote();

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [regionReady, setRegionReady] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [modalState, setModalState] = useState(ModalState.None);
  const navigation = useNavigation();

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
    setModalState(ModalState.ExistingNote);
  };

  const handleAddNotePress = () => {
    setModalState(ModalState.NewNote);
  };

  const handleSubmit = async ({
    title,
    note,
    notifyEnabled,
    notifyDistance,
    place,
  }: {
    title: string;
    note: string;
    notifyEnabled: boolean;
    notifyDistance: number;
    place: import('@shared/search').SearchResult;
  }) => {
    // Use coordinates from the selected place
    const latitude = place.geometry.location.lat;
    const longitude = place.geometry.location.lng;

    await createNoteMutation.mutateAsync({
      title,
      note,
      notifyEnabled,
      notifyDistance,
      latitude,
      longitude,
    });

    await refetchNotes();
    setSelectedCoord(null);
    setModalState(ModalState.None);
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
        visible={modalState !== ModalState.None}
        animationType='slide'
        onRequestClose={() => setModalState(ModalState.None)}
      >
        <AddNoteModal
          onSubmit={handleSubmit}
          onCancel={() => setModalState(ModalState.None)}
          submitting={createNoteMutation.isPending}
        />
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => handleAddNotePress()} activeOpacity={0.7}>
        <Ionicons name='add' size={32} color='#fff' />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    left: 24,
    bottom: 32,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MapScreen;
