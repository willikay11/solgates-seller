import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/input';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    try {
      alert('Password reset link sent!');
    } catch (error) {
      alert('Error sending password reset link');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>Enter the new password you want to set.</Text>
      <View style={styles.inputContainer}>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          type="password"
          prefixComponent={<Icon name="lock-password-line" size={18} color="#10B981" />}
        />
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          type="password"
          prefixComponent={<Icon name="lock-password-line" size={18} color="#10B981" />}
        />
      </View>
      <Button onPress={handleSubmit} block>Submit</Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      backgroundColor: 'white',
      padding: 20
    },
    inputContainer: {
      width: '100%',
      marginBottom: 15
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 0
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#374151'
    },
    description: {
      fontSize: 12,
      marginBottom: 20,
      color: '#374151'
    }
  });