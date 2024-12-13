import { BaseResponse } from "./base.model";

export interface SupplierCategory{
    id: number;
    name: string;
    description: string;
}

export interface ListSupplierCategoryResponse extends BaseResponse<SupplierCategory[]>{}
export interface SupplierCategoryResponse extends BaseResponse<SupplierCategory>{}