import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const user = parseSnakeToCamel(response.data);
      return user;
    } catch (error) {
      throw new Error('Login failed');
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
