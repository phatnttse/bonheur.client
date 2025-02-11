import { PaginationResponse } from './base.model';
import { Supplier } from './supplier.model';

export interface FavoriteSupplier {
  userId: string; // Required field for User ID
  supplierId: number; // Required field for Supplier ID
  supplier?: Supplier | null; // Optional field for Supplier object
}

export interface PaginatedFavoriteSupplier
  extends PaginationResponse<FavoriteSupplier> {}
