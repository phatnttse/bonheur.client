import { AdType } from './enums.model';

export interface AdPackage {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  adType?: AdType;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdPackageRequest {
  title?: string;
  description?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  adType?: AdType;
  isActive?: boolean;
}
