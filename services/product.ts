import { parseSnakeToCamel } from "@/utils/parseSnakeToCamel";
import { api } from "./api";
import { AddProduct, EditProduct, Product } from "@/types/product";
import { Pagination } from "@/types/pagination";
import { Brand } from "@/types/brand";
import { Colour } from "@/types/colour";
import { Size } from "@/types/size";
import { Category } from "@/types/category";
import { CategoryType } from "@/types/categoryType";
import { Gender } from "@/types/gender";
import { Condition } from "@/types/condition";
import * as SecureStore from 'expo-secure-store';

export const productService = {
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

    getProductConditions: async (): Promise<Condition[]> => {
        const response = await api.get('/product-condition/list?filter[is_active]=1');
        return parseSnakeToCamel(response.data?.product_conditions);
    },

    getProducts: async (storeId?: string, page: number = 1, searchQuery?: string): Promise<Pagination<Product>> => {
        let url = `/product/list?filter[store_id]=${storeId}&page=${page}`;
        if (searchQuery && searchQuery.trim() !== '') {
            url += `&filter[name]=${encodeURIComponent(searchQuery)}`;
        }
        const response = await api.get(url);
        return parseSnakeToCamel(response.data);
    },

    getProductById: async (productId: string): Promise<Product> => {
        const response = await api.get(`/product/${productId}/admin-view`);
        return parseSnakeToCamel(response.data?.product);
    },

    addProduct: async (product: AddProduct) => {
        try {
            const userData = await SecureStore.getItemAsync('user');

            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('price', product.price.toString());
            formData.append('quantity', String(parseInt(product.quantity, 10)));
            formData.append('category_id', product.categoryId);
            formData.append('category_type_id', product.categoryTypeId);
            if (product.brandId) {
                formData.append('brand_id', product.brandId);
            }
            formData.append('product_condition_id', product.productConditionId);
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

            const response = await api.post('/product/create', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'multipart/form-data',
                }
            });

            return parseSnakeToCamel(response.data);
        } catch (error: any) {
            console.log("error =====> ", error.response);
            throw error;
        }
        
    },

    updateProduct: async(product: EditProduct, id: string) => {
        try {
            const userData = await SecureStore.getItemAsync('user');

            const data: any = {}
            Object.keys(product).forEach((key) => {
                const typedKey = key as keyof typeof product;
            
                if (key === 'colours' && product?.colours) {
                    data.colours = JSON.stringify(product.colours.map((colour: string) => ({ colour_id: colour })));
                    return;
                }
            
                if (key === 'genders' && product?.genders) {
                    data.genders = JSON.stringify(product.genders.map((gender: string) => ({ gender_id: gender })));
                    return;
                }
            
                data[typedKey] = product[typedKey];
            });

            const response = await api.patch(`/product/${id}/update`,data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': id ? 'application/json' : 'multipart/form-data',
                }
            });

            return parseSnakeToCamel(response.data);
        } catch(error: any) {
            // console.log("error =====> ", error.response);
            throw error;
        }
    },
    uploadImage: async (image: any, id?: string) => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 't9btjy9q');
        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dp1buffig/image/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            // Construct cropped URL (e.g., 400x400 center crop)
            const croppedUrl = `https://res.cloudinary.com/dp1buffig/image/upload/c_fill,w_400,h_400,g_auto/${data.public_id}.${data.format}`;
            
            if (id) {
                productService.addProductImage(id, croppedUrl);
            }
            return {
                ...data,
                croppedUrl
            };
        } catch (error) {
            console.log("error =====> ", error);
            throw error;
        }
    },
    formatImage: async() => {

    },
    deleteProduct: async (productId: string) => {
        const response = await api.delete(`/product/${productId}/delete`);
        return parseSnakeToCamel(response.data);
    },
    addProductImage: async (productId: string, imageUrl: string) => {
        try {
            const response = await api.post(`/product/${productId}/image/create`, {
                product_image_urls: JSON.stringify([{ url: imageUrl }])
            });
            return parseSnakeToCamel(response.data);
        } catch (error: any) {
            console.log("error =====> ", error.response);
            throw error;
        }    
    }
};
    