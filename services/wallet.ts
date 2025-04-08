import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";
import { Wallet } from "@/types/wallet";

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    try {
      const response = await api.get('/wallet/view');
      return parseSnakeToCamel(response.data?.wallet);
    } catch (error) {
      throw new Error('Failed to get wallet');
    }
  },
};
