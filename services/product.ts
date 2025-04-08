import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";
import { Product } from "@/types/product";
import { Pagination } from "@/types/pagination";

export const productService = {
    getProducts: async (storeId?: string, page: number = 1): Promise<Pagination<Product>> => {
        const response = await api.get(`/product/list?filter[store_id]=${storeId}&page=${page}`);
        return parseSnakeToCamel(response.data);
    },
    // addProduct: async (product: Product) => {
    //     const response = await api.post('/product/add', product);
    //     return parseSnakeToCamel(response.data);
    // },
};
    