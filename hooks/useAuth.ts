import { authService } from '@/services/authService';
import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    console.log('https://api.staging.solgates.com/api/v1/login');
    // const response = await axios.post('https://api.staging.solgates.com/api/v1/login', {
    //   email,
    //   password
    // });
    // console.log(response);
    // setUser(response.data);
    fetch('https://api.staging.solgates.com/api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => setUser(data));
  };

  const sendPasswordResetEmail = async (email: string) => {
    await authService.sendPasswordResetEmail(email);
  };

  return {
    user,
    login,
    sendPasswordResetEmail,
  };
};
