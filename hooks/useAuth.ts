import { authService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';
import { Refresh, User } from '@/types/user';  
import { useMutation } from '@tanstack/react-query';
import moment from 'moment'

export const useLogin = () => useMutation({
  mutationFn: ({ email, password }: { email: string; password: string }) => authService.login(email, password),
  onSuccess: (data: User) => {
    const newDate = moment().add(data.expiresIn, 'seconds').utc();

    SecureStore.setItemAsync('user', JSON.stringify({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      accountType: data.accountType,
      phoneNumber: data.phoneNumber,
      email: data.email,
      phoneIsVerified: data.phoneIsVerified,
      emailIsVerified: data.emailIsVerified,
      expiresAt: newDate.format('YYYY-MM-DD HH:mm:ss'),
      storeName: data.storeName,
      storeId: data.storeId,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      displayImageUrl: data.displayImageUrl,
    }));
  },
});

export const useRefreshToken = () => useMutation({
  mutationFn: ({ refreshToken }: { refreshToken: string }) => authService.refreshToken(refreshToken),
  onSuccess: async (data: Refresh) => {
    const newDate = moment().add(data.expiresIn, 'seconds').utc();

    const userData = await SecureStore.getItemAsync('user');
    if (userData) {
        const currentUser = JSON.parse(userData)

        SecureStore.setItemAsync('user', JSON.stringify({
          ...currentUser,
          expiresAt: newDate.format('YYYY-MM-DD HH:mm:ss'),
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }))
    }
  }
});

export const useLogout = () => useMutation({
  mutationFn: () => authService.logout(),
  onSuccess: () => {
    SecureStore.deleteItemAsync('user');
  },
});


