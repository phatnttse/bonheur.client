import { BaseResponse, PaginationResponse } from './base.model';
import { RequestPricingStatus } from './enums.model';
import { SupplierRequestPricing } from './supplier.model';

export interface RequestPricing {
  id: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  eventDate?: Date;
  message?: string;
  status?: RequestPricingStatus;
  supplierId: number;
  supplier?: SupplierRequestPricing;
  expirationDate?: Date;
  rejectReason?: string;
}

export interface ListRequestPricingResponse
  extends PaginationResponse<RequestPricing> {}
export interface RequestPricingResponse extends BaseResponse<RequestPricing> {}
