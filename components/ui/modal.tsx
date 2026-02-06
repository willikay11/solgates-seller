import { View, Text, Modal as RNModal, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-remix-icon';
import Divider from '@/components/ui/divider';

export const Modal = ({
  modalVisible,
  title,
  children,
  setModalVisible,
}: {
  modalVisible: boolean;
  title: string;
  children: React.ReactNode;
  setModalVisible: (visible: boolean) => void;
}) => {
  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close-line" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Divider width="100%" height={1} color="#F3F4F6" />
          <View style={styles.modalBody}>{children}</View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
