import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/input';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { sendPasswordResetEmail } = useAuth();

  const handleSubmit = async () => {
    try {
      await sendPasswordResetEmail(email);
      alert('Password reset link sent!');
    } catch (error) {
      alert('Error sending password reset link');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>Enter the email address you used to register so that we can send you the password reset link.</Text>
      <View style={styles.inputContainer}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          type="text"
          prefixComponent={<Icon name="at-line" size={18} color="#F59E0B" />}
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