import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
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
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>  
      <StatusBar barStyle="dark-content" />
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
    </QueryClientProvider>
  );
}
