import { Category } from "@/types/category";
import { CategoryType } from "@/types/categoryType";
import { Condition } from "@/types/condition";
import { Size } from "./size";
import { Seller } from "./seller";
import { ProductImage } from "./productImage";
import { Gender } from "./gender";
import { Brand } from "./brand";
import { Colour } from "./colour";

export interface AddProduct {
    name: string;
    price: number;
    quantity: number;
    categoryId: string;
    categoryTypeId: string;
    brandId: string;
    colours: string[];
    genders: string[];
    productUrls: string[];
    sizeId: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    productCondition: Condition;
    quantity: number;
    price: number;
    category: Category;
    categoryType: CategoryType;
    size: Size;
    genders: Gender[];
    store: Seller;
    productImageUrls: {
      id: string;
      url: string;
    }[];
    brand: Brand;
    colours: Colour[];
    createdAt: string;
    updatedAt: string;
}
