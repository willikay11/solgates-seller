import { Category } from "@/types/category";
import { CategoryType } from "@/types/categoryType";
import { Condition } from "@/types/condition";
import { Size } from "@/types/size";
import { Seller } from "@/types/seller";
import { Gender } from "@/types/gender";
import { Brand } from "@/types/brand";
import { Colour } from "@/types/colour";

export interface AddProduct {
    name: string;
    price: string;
    quantity: string;
    categoryId: string;
    categoryTypeId: string;
    productConditionId: string;
    brandId?: string;
    colours: string[];
    genders: string[];
    productUrls: { url: string }[];
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
