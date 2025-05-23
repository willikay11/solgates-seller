import { productService } from "@/services/product";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryTypes = () => {
    return useQuery({
        queryKey: ['category-types'],
        queryFn: () => productService.getCategoryTypes(),
        enabled: true,
    });
};

export const useGetSizes = () => {
    return useQuery({
        queryKey: ['sizes'],
        queryFn: () => productService.getSizes(),
        enabled: true,
    });
};

export const useGetGenders = () => {
    return useQuery({
        queryKey: ['genders'],
        queryFn: () => productService.getGenders(),
        enabled: true,
    });
};

export const useGetBrands = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: () => productService.getBrands(),
        enabled: true,
    });
};

export const useGetColours = () => {
    return useQuery({
        queryKey: ['colours'],
        queryFn: () => productService.getColours(),
        enabled: true,
    });
};

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productService.getCategories(),
        enabled: true,
    });
};

export const useProducts = (storeId?: string, page: number = 1) => {
    return useQuery({
        queryKey: ['products', storeId, page],
        queryFn: () => productService.getProducts(storeId, page),
        enabled: !!storeId,
    });
};