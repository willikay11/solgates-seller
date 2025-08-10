export interface ProductImage {
  id: string;
  name: string;
  fileName: string;
  previewUrl: string;
  originalUrl: string;
  customProperties: any[];
  extension: string;
  size: number;
  order: number | null;
}
