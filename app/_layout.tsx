// app/_layout.tsx
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/ui/custom-toast';

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => <CustomToast {...props} />,
  error: (props: any) => <CustomToast {...props} />,
};

export default function AppLayout() {
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
