import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user';  
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => useMutation({
  mutationFn: ({ email, password }: { email: string; password: string }) => authService.login(email, password),
  onSuccess: (data: User) => {
    SecureStore.setItemAsync('user', JSON.stringify({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      accountType: data.accountType,
      phoneNumber: data.phoneNumber,
      email: data.email,
      phoneIsVerified: data.phoneIsVerified,
      emailIsVerified: data.emailIsVerified,
      storeName: data.storeName,
      storeId: data.storeId,
      accessToken: data.accessToken,
    }));
  },
});

