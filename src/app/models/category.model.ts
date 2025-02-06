import { BaseResponse } from './base.model';

export interface SupplierCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  imageFileName: string;
  favoritesCount?: number; // Thêm thuộc tính favoritesCount
}

export interface ListSupplierCategoryResponse
  extends BaseResponse<SupplierCategory[]> {}
export interface SupplierCategoryResponse
  extends BaseResponse<SupplierCategory> {}
