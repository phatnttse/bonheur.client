import { SupplierCategory } from "./category.model";

export interface Supplier {
    id: number;
    // user?: UserAccountDTO;
    // supplierCategory?: SupplierCategoryDTO;
    supplierName?: string;
    supplierDescription?: string;
    price?: number;
    street?: string;
    province?: string;
    ward?: string;
    district?: string;
    websiteUrl?: string;
    responseTime?: string;
    priority: number;
    // status?: SupplierStatus;
    // onBoardStatus?: OnBoardStatus;
    // onBoardPercent: number;
    // isFeatured: boolean;
    // priorityEnd?: Date;
    // averageRating: number;
    // subscriptionPackage?: SubscriptionPackage;
    // advertisements?: Advertisement[];
    // supplierImages?: SupplierImageDTO[];
  }

  export interface SupplierRequestPricing {
    id: number;
    supplierCategory?: SupplierCategory;
    supplierName?: string;
    supplierDescription?: string;
    price?: number;
    street?: string;
    province?: string;
    ward?: string;
    district?: string;
    websiteUrl?: string;
    responseTime?: string;
    priority: number;
    // status?: SupplierStatus;
  }
