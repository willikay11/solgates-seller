import { StyleSheet, View, Button, Alert, Share as NativeShare } from 'react-native';
import { Modal } from './modal';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';

type ShareProps = {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
}

export default function Share({ modalVisible, setModalVisible }: ShareProps) {
    const imageUrl = 'https://example.com/your-image.jpg';
    const link = 'https://yourlink.com';
    const message = `Check this out: ${link}`;

    const downloadImageToCache = async () => {
      const fileUri = FileSystem.cacheDirectory + 'sharedImage.jpg';
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      return uri;
    };

    const shareToWhatsApp = async () => {
      const encoded = encodeURIComponent(message);
      const url = `whatsapp://send?text=${encoded}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Toast.show({
          type: 'error',
          text1: 'WhatsApp is not installed',
        });
      }
    };

    const shareToInstagram = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required to save image');
        return;
      }

      const localUri = await downloadImageToCache();
      const asset = await MediaLibrary.createAssetAsync(localUri);
      await Sharing.shareAsync(asset.uri);
    };

    const shareGeneric = async () => {
      try {
        const result = await NativeShare.share({
          message: `${message}`,
          url: imageUrl, // May not be honored on iOS
          title: 'Check this out!',
        });
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.message ?? 'An error occurred',
        });
      }
    };

    return (
      <Modal modalVisible={modalVisible} title="Share" setModalVisible={setModalVisible}>
        <View style={styles.shareContainer}>

        <View style={{ padding: 20 }}>
          <Button title="Share to WhatsApp" onPress={shareToWhatsApp} />
          <Button title="Share to Instagram (Feed)" onPress={shareToInstagram} />
          <Button title="Share using Native Share" onPress={shareGeneric} />
        </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  shareContainer: {
    padding: 16,
  },
  shareContent: {
    flex: 1,
  },
});