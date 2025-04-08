import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user';  
import { useMutation, useQuery } from '@tanstack/react-query';

export const useLogin = () => useMutation({
  mutationFn: ({ email, password }: { email: string; password: string }) => authService.login(email, password),
  onSuccess: (data: User) => {
    SecureStore.setItemAsync('user', JSON.stringify(data));
  },
});

