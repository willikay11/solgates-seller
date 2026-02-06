import { parseSnakeToCamel } from '@/utils/parseSnakeToCamel';
import { api } from './api';
import { Wallet } from '@/types/wallet';

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    try {
      const response = await api.get('/wallet/view');
      return parseSnakeToCamel(response.data?.wallet);
    } catch (error) {
      throw new Error('Failed to get wallet');
    }
  },

  withdraw: async (amount: number, phoneNumber: string): Promise<Wallet> => {
    try {
      const response = await api.post('/wallet/withdraw/mpesa', {
        phone_number: phoneNumber,
        amount,
      });
      return parseSnakeToCamel(response.data?.wallet);
    } catch (error) {
      throw new Error('Failed to withdraw');
    }
  },
};
