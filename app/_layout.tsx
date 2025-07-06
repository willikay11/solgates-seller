import { useFonts } from 'expo-font';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StatusBar } from 'react-native';
import CustomToast from '@/components/ui/custom-toast';

SplashScreen.preventAutoHideAsync();

const toastConfig = {
  success: (props: any) => <CustomToast {...props} />,
  error: (props: any) => <CustomToast {...props} />,
};

export const unstable_settings = {
  initialRouteName: "(auth)/index",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter(); 
  const navigationState = useRootNavigationState(); // <-- this tells us when it's safe to navigate
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      } ,3000)
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!navigationState?.key) return; 

      try {
          const userData = await SecureStore.getItemAsync('user');
          if (userData) {
              const data = JSON.parse(userData);
              const nowLocalTime = moment().local();
              if(nowLocalTime.isAfter(data.expiresAt)) {
                // Refresh endpoint
              } else {
                // Change initial route
                console.log('here111');
                router.replace('/dashboard');
              }
          }
      } catch (error) {
          console.error('Failed to load user:', error);
      }
    };

    fetchUser();
  }, [navigationState?.key])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>  
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="dashboard/index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
            animation: 'none'
          }} 
        />
        <Stack.Screen name="products/add" options={{ headerShown: false }} />
          <Stack.Screen name="products/edit/[id]" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
