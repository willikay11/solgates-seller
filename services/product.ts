import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";
import { Product } from "@/types/product";
import { Pagination } from "@/types/pagination";
import { Brand } from "@/types/brand";
import { Colour } from "@/types/colour";
import { Size } from "@/types/size";
import { Category } from "@/types/category";
import { CategoryType } from "@/types/categoryType";
import { Gender } from "@/types/gender";
export const productService = {
    getProducts: async (storeId?: string, page: number = 1): Promise<Pagination<Product>> => {
        const response = await api.get(`/product/list?filter[store_id]=${storeId}&page=${page}`);
        return parseSnakeToCamel(response.data);
    },

    getGenders: async (): Promise<Gender[]> => {
        const response = await api.get('/gender/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.genders);
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await api.get('/category/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.categories);
    },

    getCategoryTypes: async (): Promise<CategoryType[]> => {
        const response = await api.get('/category-type/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.category_types);
    },

    getBrands: async (): Promise<Brand[]> => {
        const response = await api.get('/brand/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.brands);
    },

    getColours: async (): Promise<Colour[]> => {
        const response = await api.get('/colour/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.colours);
    },
    
    getSizes: async (): Promise<Size[]> => {
        const response = await api.get('/size/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.sizes);
    },
    // addProduct: async (product: Product) => {
    //     const response = await api.post('/product/add', product);
    //     return parseSnakeToCamel(response.data);
    // },
};
    