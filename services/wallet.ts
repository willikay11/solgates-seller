import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";

export const walletService = {
  getWallet: async () => {
    try {
      const response = await api.get('/wallet/view');
      return parseSnakeToCamel(response.data?.wallet);
    } catch (error) {
      throw new Error('Failed to get wallet');
    }
  },
};
