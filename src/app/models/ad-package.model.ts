import { AdType } from './enums.model';

export interface AdPackage {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  adType?: AdType;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdPackageRequest {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  adType?: AdType;
  isActive?: boolean;
}
