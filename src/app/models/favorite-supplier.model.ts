import { BaseResponse, PaginationResponse } from './base.model';
import { Supplier } from './supplier.model';

export interface FavoriteSupplier {
  userId: string; // Required field for User ID
  supplierId: number; // Required field for Supplier ID
  supplier?: Supplier | null; // Optional field for Supplier object
}

export interface FavoriteCount {
  categoryId: number;
  categoryName: string;
  favoriteCount: number;
}

export interface PaginatedFavoriteSupplier
  extends PaginationResponse<FavoriteSupplier> {}
export interface BaseFavoriteCount extends BaseResponse<FavoriteCount[]> {}
