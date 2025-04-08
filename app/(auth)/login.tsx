import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/input';
import Icon from "react-native-remix-icon";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <View style={styles.inputContainer}>
        <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            type="text"
            prefixComponent={<Icon name="at-line" size={18} color="#F59E0B" />}
        />
      </View>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        type="password"
        prefixComponent={<Icon name="key-2-line" size={18} color="#3B82F6" />}
      />
      <View style={styles.buttonContainer}>
        <Button variant="text" onPress={() => router.push('/auth/forgot-password')}>Forgot Password?</Button>
      </View>
      <Button onPress={handleLogin} block>Sign In</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white',
    padding: 20
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15
  },
  logo: {
    width: '80%',
    height: 50,
    marginBottom: 80
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 0
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#374151'
  }
});
