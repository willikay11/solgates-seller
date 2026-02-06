import { parseSnakeToCamel } from '@/utils/parseSnakeToCamel';
import { api } from './api';
import { Refresh, User } from '@/types/user';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const user: User = parseSnakeToCamel(response.data);
      if (user.accountTypeName.toLowerCase() !== 'seller') {
        throw new Error('You are not authorized to access this application');
      }
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  logout: async () => {
    try {
      await api.get('/logout');
    } catch (error) {
      throw new Error('Logout failed');
    }
  },
  refreshToken: async (refreshToken: string) => {
    try {
      const formData = new FormData();
      formData.append('refresh_token', refreshToken);

      const response = await api.post('/refresh-token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const refresh: Refresh = {
        accessToken: response?.data?.data?.meta?.access_token,
        refreshToken: response?.data?.data?.meta?.refresh_token,
        expiresIn: response?.data?.data?.meta?.expires_in,
      };

      return refresh;
    } catch (error) {
      console.log(error);
      throw new Error('refresh failed');
    }
  },
  sendPasswordResetEmail: async (email: string) => {
    try {
      //   await sendPasswordResetEmail(auth, email);
      return {
        user: {
          email: email,
        },
      };
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  },
};
