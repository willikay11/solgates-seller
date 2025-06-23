import { productService } from "@/services/product";
import { AddProduct } from "@/types/product";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";

const staleTime = 1000 * 60 * 60 * 12; // 12 hours
const cacheTime =  1000 * 60 * 60 * 12; 

export const useGetCategoryTypes = () => {
    return useQuery({
        queryKey: ['category-types'],
        queryFn: () => productService.getCategoryTypes(),
        enabled: true,
        staleTime,
    });
};

export const useGetSizes = () => {
    return useQuery({
        queryKey: ['sizes'],
        queryFn: () => productService.getSizes(),
        enabled: true,
        staleTime,
    });
};

export const useGetGenders = () => {
    return useQuery({
        queryKey: ['genders'],
        queryFn: () => productService.getGenders(),
        enabled: true,
        staleTime,
    });
};

export const useGetBrands = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: () => productService.getBrands(),
        enabled: true,
        staleTime,
    });
};

export const useGetColours = () => {
    return useQuery({
        queryKey: ['colours'],
        queryFn: () => productService.getColours(),
        enabled: true,
        staleTime,
    });
};

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productService.getCategories(),
        enabled: true,
        staleTime,
    });
};

export const useGetConditions = () => {
    return useQuery({
        queryKey: ['conditions'],
        queryFn: () => productService.getProductConditions(),
        enabled: true,
        staleTime,
    });
};  

export const useProducts = (storeId?: string, page: number = 1) => {
    return useInfiniteQuery({
        queryKey: ['products', storeId, page],
        queryFn: () => productService.getProducts(storeId, page),
        getNextPageParam: (products, pages) => {
            return products.meta.currentPage < products.meta.lastPage ? products.meta.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const useGetProductById = (productId: string) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => productService.getProductById(productId),
        enabled: !!productId,
    });
};

export const useAddOrUpdateProduct = (id?:string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: AddProduct) => productService.addOrUpdateProduct(product, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        },
    });
}; 

export const useUploadImage = (id?: string) => {
    return useMutation({
        mutationFn: (image: any) => productService.uploadImage(image, id),
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => productService.deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};