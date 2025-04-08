import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/services/wallet";

export const useWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletService.getWallet(),
    });
};