import { AdPackage } from './ad-package.model';
import { AdvertisementStatus } from './enums.model';
import { Supplier } from './supplier.model';

export interface Advertisement {
  id: number;
  supplier?: Supplier;
  adPackage?: AdPackage;
  title?: string;
  content?: string;
  imageUrl?: string;
  imageFileName?: string;
  targetUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvertisementRequest {
  supplierId: number;
  adPackageId: number;
  title?: string;
  content?: string;
  targetUrl?: string;
  isActive?: boolean;
  image?: File;
  video?: File;
}

export interface UpdateAdvertisementRequest {
  supplierId?: number;
  adPackageId?: number;
  title?: string;
  content?: string;
  targetUrl?: string;
  isActive: boolean;
  status: AdvertisementStatus;
  image?: File;
  video?: File;
}
