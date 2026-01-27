// app/_layout.tsx
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ui/custom-toast';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst'
    },
    mutations: {
      networkMode: 'offlineFirst'
    }
  }
});

const toastConfig = {
  success: (props: any) => <CustomToast {...props} />,
  error: (props: any) => <CustomToast {...props} />,
};

export default function AppLayout() {
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('https://www.google.com', { method: 'HEAD' });
        if (!res.ok) throw new Error('Bad response');
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No Internet Connection',
        });
      }
    };
  
    const interval = setInterval(checkConnection, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
        <Toast config={toastConfig} />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
