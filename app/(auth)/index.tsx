import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, Linking } from 'react-native';
import Button from '@/components/ui/button';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/input';
import Icon from "react-native-remix-icon";
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isSuccess, isPending: isSigningIn, isError } = useLogin();
  const router = useRouter();

  const handleLogin = async () => {
    await login({ email, password });
  };

  const handleForgotPassword = async () => {
    const url = Constants.expoConfig?.extra?.FRONTEND_URL;

    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push('/dashboard');
    } else if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your email and password'
      });
    }
  }, [isSuccess, isError]);

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
        <Button variant="text" onPress={() => handleForgotPassword()}>Forgot Password?</Button>
      </View>
      <Button onPress={handleLogin} block loading={isSigningIn} disabled={isSigningIn}>
        {isSigningIn ? 'Signing In...' : 'Sign In'}
      </Button>
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
