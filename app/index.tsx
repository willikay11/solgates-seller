import { useEffect, useState } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import { useRefreshToken } from '@/hooks/useAuth';
import { User } from '@/types/user';

export default function AuthIndex() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const { mutate: refreshToken, isSuccess, isError } = useRefreshToken();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const data: User = JSON.parse(userData);
          const nowLocalTime = moment().local();
          if (nowLocalTime.isBefore(data.expiresAt)) {
            router.replace('/dashboard');
            setReady(true);
            return;
          } else {
            refreshToken({refreshToken: data?.refreshToken});
          }
        } else {
            router.replace('/(auth)')
            setReady(true);
            return;
        }
      } catch (e) {
        console.log('Error reading user data:', e);
      }
    };

    setTimeout(() => {
        checkSession();
    }, 5000)
  }, []);

  useEffect(() => {
    if(isSuccess) {
        router.replace('/dashboard');
    }

    if (isError) {
        router.replace('/(auth)')
    }
  }, [isSuccess, isError])

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EA580C' }}>
        <StatusBar backgroundColor="#EA580C" barStyle="light-content" />
        <Image 
            source={require('@/assets/images/foregroundImage.png')} 
            style={styles.splashImage}
            resizeMode="contain"
        />
      </View>
    );
  }

  return null
}

const styles = StyleSheet.create({
    splashImage: {
        width: '80%',
        height: 250,
        marginBottom: 10
    }
})