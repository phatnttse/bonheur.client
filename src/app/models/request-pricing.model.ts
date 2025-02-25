import { Account } from './account.model';
import { BaseResponse, PaginationResponse } from './base.model';
import { RequestPricingStatus } from './enums.model';
import { Supplier, SupplierRequestPricing } from './supplier.model';

export interface RequestPricing {
  id: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  eventDate?: Date;
  message?: string;
  status?: RequestPricingStatus;
  user?: Account;
  supplier?: Supplier;
  expirationDate?: string;
  rejectReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRequestPricing {
  name: string;
  email: string;
  phoneNumber: string;
  eventDate: Date;
  message: string;
  supplierId: number;
}

export interface ListRequestPricingResponse
  extends PaginationResponse<RequestPricing> {}
export interface RequestPricingResponse extends BaseResponse<RequestPricing> {}
