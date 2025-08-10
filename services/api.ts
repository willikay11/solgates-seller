import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = await SecureStore.getItemAsync('user');
  const accessToken = JSON.parse(user ?? '{}').accessToken;

  config.headers.Authorization = `Bearer ${accessToken}`;
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      SecureStore.deleteItemAsync('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
