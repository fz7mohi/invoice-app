export interface Product {
  id?: string;
  productId: string;
  name: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  cost: number;
  barcode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  cost: number;
} 