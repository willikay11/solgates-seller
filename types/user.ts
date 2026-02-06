export interface User {
  id: string;
  firstName: string;
  lastName: string;
  accountType: number;
  phoneNumber: string;
  email: string;
  phoneIsVerified: number;
  emailIsVerified: number;
  accountStatusId: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  accountTypeName: AccountType;
  accountStatusName: AccountStatus;
  storeId: string;
  storeStatusId: number;
  storeName: string;
  storeStatusName: string;
  displayImageUrl: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: string;
  refreshToken: string;
}

export interface Refresh {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type AccountType = 'SELLER' | 'BUYER';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';
