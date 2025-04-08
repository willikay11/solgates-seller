export const authService = {
  login: async (email: string, password: string) => {
    try {
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   return userCredential.user;
    return {
        user: {
            email: email,
            password: password,
        },
    };
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
