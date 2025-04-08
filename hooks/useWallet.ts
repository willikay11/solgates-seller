import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet";

export const useWallet = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletService.getWallet(),
    });
};

export const useWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ amount, phoneNumber }: { amount: number, phoneNumber: string }) => walletService.withdraw(amount, phoneNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
    });
};  