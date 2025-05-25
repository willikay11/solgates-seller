import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const api = axios.create({
  baseURL: 'https://api.staging.solgates.com/api/v1',
});

api.interceptors.request.use(async (config) => {
  const user = await SecureStore.getItemAsync('user');
  const accessToken = JSON.parse(user ?? '{}').accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      SecureStore.deleteItemAsync('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
