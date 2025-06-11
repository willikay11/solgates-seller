import { Category } from '@/types/category';


export interface CategoryType {
  id: string;
  name: string;
  active: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}
