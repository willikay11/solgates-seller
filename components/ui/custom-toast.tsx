// components/CustomSuccessToast.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';

const CustomToast = ({
  text1,
  text2,
  type,
}: {
  text1: string;
  text2: string;
  type: 'success' | 'error';
}) => {
  let iconContainerStyle;
  let iconBackgroundStyle;
  switch (type) {
    case 'success':
      iconContainerStyle = styles.iconContainerSuccess;
      iconBackgroundStyle = styles.iconBackgroundSuccess;
      break;
    case 'error':
      iconContainerStyle = styles.iconContainerError;
      iconBackgroundStyle = styles.iconBackgroundError;
      break;
    default:
      iconContainerStyle = styles.iconContainer;
      iconBackgroundStyle = styles.iconBackground;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, iconContainerStyle]}>
        <View style={[styles.iconBackground, iconBackgroundStyle]}>
          <Icon
            name={type === 'success' ? 'check-double-line' : 'close-circle-line'}
            size={20}
            color={type === 'success' ? '#4CAF50' : '#ef4444'}
          />
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        <Text style={styles.text2}>{text2}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#F2F4F7',
    // borderWidth: 1,
    alignItems: 'flex-start',
    marginHorizontal: 8,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  iconContainer: {
    display: 'flex',
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconBackground: {
    display: 'flex',
    backgroundColor: '#D1FAE5',
    borderRadius: 50,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSuccess: {
    backgroundColor: '#ECFDF5',
  },
  iconContainerError: {
    backgroundColor: '#fef2f2',
  },
  iconBackgroundSuccess: {
    backgroundColor: '#D1FAE5',
  },
  iconBackgroundError: {
    backgroundColor: '#fee2e2',
  },
  icon: {
    marginRight: 10,
  },
  text1: {
    color: '#101828',
    fontWeight: '900',
    fontSize: 16,
  },
  text2: {
    color: '#475467',
    fontWeight: '400',
    fontSize: 14,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 1,
  },
});

export default CustomToast;
