import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-remix-icon';
import { useUploadImage } from '@/hooks/useProduct';

const MAX_IMAGES = 6;
type ImagePickerProps = {
  onImageUploaded: (url: string[]) => void;
  selectedImages: string[];
  currentIndex: number;
  productId?: string;
};
const ImagePickerExample = ({
  onImageUploaded,
  selectedImages,
  currentIndex,
  productId,
}: ImagePickerProps) => {
  // const [selectedImages, setSelectedImages] = useState(Array(3).fill(null));
  // useEffect(() => {
  //   if (selectedImagesProps) {
  //     setSelectedImages(selectedImagesProps);
  //   }
  // }, [selectedImagesProps]);

  const handleSelectImage = async (index?: number) => {
    if (index === undefined) {
      index = currentIndex + 1;
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - selectedImages.filter((image) => image !== '').length,
    });

    if (!result.canceled) {
      // Handle multiple images
      const newImages = result.assets.map((asset) => asset.uri);
      onImageUploaded(newImages);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImages.map((imageUri, index) => (
        <TouchableOpacity
          key={index}
          style={styles.imageContainer}
          onPress={() => handleSelectImage(index)}
        >
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
        </TouchableOpacity>
      ))}
      {selectedImages.length < MAX_IMAGES && (
        <TouchableOpacity
          style={styles.imageButtonContainer}
          onPress={() => handleSelectImage(currentIndex + 1)}
        >
          <Icon name="image-line" size={21} color="#2563EB" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '2%',
    marginBottom: 10,
  },
  imageContainer: {
    flexBasis: '23%', // Ensures four items per row
    height: 80,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  imageButtonContainer: {
    flexBasis: '23%', // Ensures four items per row
    height: 80,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  text: {
    color: '#1F2937',
    fontSize: 16,
  },
});

export default ImagePickerExample;
