import axios from "axios";

export const useProduct = () => {
    const getProducts = async () => {
        const response = await axios.get('http://localhost:3000/api/v1/products');
        return response.data;
    };

    return {
        getProducts,
    };
};