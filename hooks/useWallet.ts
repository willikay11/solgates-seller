import axios from "axios";

export const useWallet = () => {

    const getWallet = async () => {
        const response = await axios.get('http://localhost:3000/api/v1/wallet/view');
        console.log(response.data);
        return response.data;
    };  

    return {
        getWallet,
    };
};