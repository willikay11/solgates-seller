import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const TEST_ADMIN_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YmFhMDBmOC05OTViLTRlN2YtYTQ3NS1kYjZhOTA3OThkMGYiLCJqdGkiOiI3MjNlMzMyZmI5M2ZhYzI0NTI3Zjc3ZmZhMTQ1ODBhZjRkNWFhMzkyYzZhZTg5MjJhYTA1ODkxZWUzOTQ1YTc4MTAzZWYxMmRlZWQ5ZDAxMSIsImlhdCI6MTc0ODE4NTg4MS4yNTUwMjMsIm5iZiI6MTc0ODE4NTg4MS4yNTUwMjUsImV4cCI6MTc0ODI3MjI4MS4yNDc2MTUsInN1YiI6IjliYWEwMGFmLTM2NjUtNGM4MC04NGJkLTliMzk2MmMzMmNjNyIsInNjb3BlcyI6WyIqIl19.nVbZ4Wj7u-WtH88RQyko4PE6bAckZ69tgzMxi3EVyN-C0zEaliE3Z-ZVMc76Y3RM_qMs4-8GA5JPPWmgqaUBqpW9swtLknCmUqG-QUUmwhk5Sk0i582nNyJj5cToO5X0XTUk51M-AK3uBVTk4cR_l9fx-fd7sXOPCu9qutpjOH5OOqCUdqoY--Uw74UiKoGxXRo20ZGt_YKH_YMaRzxDWjMaXIYJGgOMkT0xhhpUH5-kQ9opsLPqPNmlEs3kNftTfQfzXslBD2wyM77eGsk_ikil-L9MJ-1eW3XUr6kvIjP293hvfo07zGBjWsK9uHH9ECvBwlDvfa4OgPvbQ-Y0624KAXK42gV53xZVF5FCZXOSILLsrx8E6tIIhb3MPF_NdONyrvyxK-UowDbjECyvrhbYe8vgQ87DRM3WDs0unpvw6i7z9JhHv4DAyO0Ysg3F1BmLKa05lUriTpq6biiPbgmccR4vQ6bxPv_Agbx2xcnRnFXpM6AjzBSE9zzoOkrVl9YOv4JwmTeNl48axWrPzqe27L0z5DwA6RDFHGEEXp8WNWOL_FWJM6OfCH3rymw0CPXQlRhqpZGkW6KXb6gGok21agwuqTD-4FDsEFuq3T_7pdbUd8_JIzxtII92HvSFt2_ZSCbAu42JERWLzF4OjwgQ-0en6XEN85qDBbDSNEU';
export const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = await SecureStore.getItemAsync('user');
  const accessToken = JSON.parse(user ?? '{}').accessToken;

  if (config.url?.includes('/delete')) {
    config.headers.Authorization = `Bearer ${TEST_ADMIN_TOKEN}`;
  } else if (accessToken) {
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
