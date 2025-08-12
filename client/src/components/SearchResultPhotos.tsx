import { usePlacePhotos } from '@/hooks/usePlacePhotos';
import React from 'react';
import { FlatList, Image, View, StyleSheet, Modal, Pressable } from 'react-native';

export function SearchResultPhotos({ photoNames }: { photoNames: string[] }) {
  const { photos, loading, error, load } = usePlacePhotos();
  const [fullscreenUri, setFullscreenUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (photoNames.length > 0) {
      load(photoNames);
    }
  }, [photoNames, load]);

  return (
    <>
      {loading ? (
        <View style={{ flexDirection: 'row', marginVertical: 8 }}>
          {[...Array(3)].map((_, idx) => (
            <View key={idx} style={styles.skeleton} />
          ))}
        </View>
      ) : Array.isArray(photos) && photos.length > 0 ? (
        <FlatList
          data={photos}
          refreshing={loading}
          fadingEdgeLength={50}
          horizontal
          keyExtractor={(item, idx) => item.name + idx}
          renderItem={({ item: { uri } }) => (
            <Pressable onPress={() => setFullscreenUri(uri)}>
              <Image
                source={{ uri }}
                style={{ width: 128, height: 128, marginRight: 8, borderRadius: 6 }}
                resizeMode='cover'
              />
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : null}

      <Modal
        visible={!!fullscreenUri}
        transparent
        animationType='fade'
        onRequestClose={() => setFullscreenUri(null)}
      >
        <Pressable style={styles.fullscreenBackdrop} onPress={() => setFullscreenUri(null)}>
          {fullscreenUri && (
            <Image
              source={{ uri: fullscreenUri }}
              style={styles.fullscreenImage}
              resizeMode='contain'
            />
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    width: 128,
    height: 128,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
