import { BaseResponse } from "./base.model";

export interface RequestPricing {
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

export interface ListRequestPricingResponse extends BaseResponse<RequestPricing[]>{}
export interface RequestPricingResponse extends BaseResponse<RequestPricing>{}