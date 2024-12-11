import { BaseResponse } from "./base.model";
import { PagedData } from "./page-data.model";

export interface RequestPricing {
    id: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    eventDate?: Date;
    message?: string;
    status?: RequestPricingStatus;
    supplierId: number;
    // supplier?: Supplier;
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