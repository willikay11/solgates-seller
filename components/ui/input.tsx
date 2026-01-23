import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ViewStyle, ActivityIndicator } from 'react-native';
import Icon from "react-native-remix-icon";

type InputProps = {
  value?: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  type?: 'text' | 'password';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  prefixComponent?: React.ReactNode;
  error?: string;
  style?: ViewStyle;
  loading?: boolean;
  suffixComponent?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  type = 'text',
  prefixComponent,
  keyboardType = 'default',
  error,
  style,
  loading = false,
  suffixComponent,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <View> 
      <View style={[styles.inputContainer, error && { borderColor: 'red' }, style]}>
        {prefixComponent && <View style={styles.prefix}>{prefixComponent}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={type === 'password' && !isPasswordVisible}
          style={styles.input}
          keyboardType={keyboardType}     
        />

        {/* Show loading spinner */}
        {loading && (
          <View style={styles.iconContainer}>
            <ActivityIndicator size="small" color="#EA580C" />
          </View>
        )}

        {/* Show toggle icon only for password input */}
        {type === 'password' && !loading && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
            {isPasswordVisible ? <Icon name="eye-line" size={18} color="gray" /> : <Icon name="eye-close-line" size={18} color="gray" />}
          </TouchableOpacity>
        )}
        {suffixComponent && <View style={styles.suffix}>{suffixComponent}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
  },
  prefix: {
    marginRight: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#1F2937',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  suffix: {
    marginLeft: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Input;
