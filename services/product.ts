import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";
import { AddProduct, Product } from "@/types/product";
import { Pagination } from "@/types/pagination";
import { Brand } from "@/types/brand";
import { Colour } from "@/types/colour";
import { Size } from "@/types/size";
import { Category } from "@/types/category";
import { CategoryType } from "@/types/categoryType";
import { Gender } from "@/types/gender";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

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

    addProduct: async (product: AddProduct) => {
        try {
            const userData = await SecureStore.getItemAsync('user');

            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price.toString());
            formData.append('quantity', product.quantity.toString());
            formData.append('category_id', product.categoryId);
            formData.append('category_type_id', product.categoryTypeId);
            formData.append('brand_id', product.brandId);
            formData.append('store_id', JSON.parse(userData ?? '{}').storeId);
            formData.append('size_id', product.sizeId);

            formData.append(
                'colours',
                product.colours.length
                  ? JSON.stringify(
                      product.colours.map((colour: string) => ({ colour_id: colour }))
                    )
                  : ''
              );
            formData.append(
                'genders',
                product.genders.length
                  ? JSON.stringify(
                      product.genders.map((gender: string) => ({ gender_id: gender }))
                    )
                  : ''
              );

            formData.append(
                'product_image_urls',
                product.productUrls.length
                  ? JSON.stringify(
                      product.productUrls
                    )
                  : ''
              );
            // const response = await api.post('/product/create', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     }
            // });

            console.log("formData =====> ", formData);

            const response = await api.post('/product/create', {
                name: product.name,
            });

            return parseSnakeToCamel(response.data);
        } catch (error) {
            console.log("error =====> ", error);
            throw error;
        }
        
    },

    uploadImage: async (image: any) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 't9btjy9q');
        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dp1buffig/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log("error =====> ", error);
            throw error;
        }
    }
};
    