import axios from "axios";
import * as SecureStore from 'expo-secure-store';


export const api = axios.create({
  baseURL: 'https://api.staging.solgates.com/api/v1',
});

api.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      SecureStore.deleteItemAsync('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
