import { BaseResponse } from './base.model';

export interface SubscriptionPackage {
  id?: number;
  name: string;
  description: string;
  durationInDays: number;
  price: number;
  isFeatured: boolean;
  priority: number;
  isDeleted: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeTextColor?: string;
}

export interface ListSubscriptionPackageResponse
  extends BaseResponse<SubscriptionPackage[]> {}

export interface SubscriptionPackageResponse
  extends BaseResponse<SubscriptionPackage> {}
