import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';

// Define the types for the Button props
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'text'; // Accepts 'primary' or 'secondary'
  block?: boolean;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode; // The content inside the button (usually a label)
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', onPress, children, block = false, style, disabled = false, loading = false }) => {
  // Apply the styles based on the variant prop
  let buttonStyle;
  let textStyle;

  switch (variant) {
    case 'primary':
      buttonStyle = styles.primaryButton;
      textStyle = styles.primaryText;
      break;
    case 'secondary':
      buttonStyle = styles.secondaryButton;
      textStyle = styles.secondaryText;
      break;
    case 'text':
      buttonStyle = styles.textButton;
      textStyle = styles.linkText;
      break;
    default:
      buttonStyle = styles.primaryButton;
      textStyle = styles.primaryText;
  }

  return (
    <TouchableOpacity style={[styles.button, block && styles.blockButton, buttonStyle, style]} onPress={onPress} disabled={disabled}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

// Define the styles for the button
const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    height: 55,
  },
  blockButton: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#EA580C', // Primary button color
  },
  secondaryButton: {
    backgroundColor: '#3B82F6', // Secondary button color
  },
  textButton: {
    backgroundColor: 'transparent',
    height: 40,
  },
  text: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff', // White text for primary button
  },
  secondaryText: {
    color: '#000', // Black text for secondary button
  },
  linkText: {
    color: '#EA580C',
  },
});

export default Button;
