import { BaseResponse } from "./base.model";
import { PagedData } from "./page-data.model";
import { SupplierRequestPricing } from "./supplier.model";

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
  export enum RequestPricingStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
  }

export interface ListRequestPricingResponse extends BaseResponse<PagedData<RequestPricing>>{}
export interface RequestPricingResponse extends BaseResponse<RequestPricing>{}