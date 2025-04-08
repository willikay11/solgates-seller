import { productService } from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (storeId?: string, page: number = 1) => {
    return useQuery({
        queryKey: ['products', storeId, page],
        queryFn: () => productService.getProducts(storeId, page),
        enabled: !!storeId,
    });
};