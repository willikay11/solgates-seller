import { Category } from "./category";

export interface Seller {
  id?: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  location?: string;
  statusId?: number;
  categories?: Category[];
  displayImage?: string;
  coverImage?: string;
  active?: number;
}
