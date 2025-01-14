import { BaseResponse, PaginationResponse } from './base.model';
import { SupplierCategory } from './category.model';
import { OnBoardStatus, StatusCode, SupplierStatus } from './enums.model';

export interface Supplier {
  id: number;
  category?: SupplierCategory;
  name?: string;
  slug?: string;
  phoneNumber?: string;
  description?: string;
  price?: number;
  street?: string;
  province?: string;
  ward?: string;
  district?: string;
  websiteUrl?: string;
  responseTime?: string;
  priority: number;
  status?: SupplierStatus;
  discount: number;
  onBoardStatus?: OnBoardStatus;
  onBoardPercent: number;
  isFeatured: boolean;
  priorityEnd?: Date;
  averageRating: number;
  images?: SupplierImage[];
}

export interface SupplierImage {
  id: number;
  imageUrl?: string;
  imageFileName?: string;
  isPrimary: boolean;
}

export interface SupplierListResponse extends PaginationResponse<Supplier> {}

export interface SupplierRequestPricing {
  id: number;
  supplierCategory?: SupplierCategory;
  name?: string;
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

export const mockSupplierData: PaginationResponse<Supplier> = {
  success: true,
  message: 'Data retrieved successfully',
  statusCode: StatusCode.OK,
  data: {
    items: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Supplier ${i + 1}`,
      slug: `supplier-${i + 1}`,
      description: `Supplier ${i + 1} Based in Bath, Somerset, 
      Icarus Photography is a wedding photography service offering a blend of traditional and documentary styles...
       ${
         i + 1
       } is known for innovation, reliability, and outstanding customer service.`,
      price: 50000 + i * 1000,
      street: `${i + 1} Main St`,
      province: i % 2 === 0 ? 'Hà Nội' : 'Hồ Chí Minh',
      ward: i % 3 === 0 ? 'Ba Dinh' : 'District 1',
      district: i % 2 === 0 ? 'Dong Da' : 'Thu Duc',
      websiteUrl: `https://supplier${i + 1}.com`,
      responseTime: `${24 + (i % 5)}h`,
      priority: (i % 3) + 1,
      onBoardPercent: 50 + (i % 50),
      isFeatured: i % 2 === 0,
      averageRating: 3.5 + (i % 2),
      discount: i % 2 === 0 ? 10 : 0,
      images: [
        {
          id: 100 + i,
          imageUrl:
            'https://cdn0.hitched.co.uk/vendor/2529/3_2/640/jpg/flower-and-fields-van_4_352529-170566673258546.webp',
          imageFileName: `supplier${i + 1}.jpg`,
          isPrimary: true,
        },
      ],
      category: {
        id: i + 1,
        name: `Category ${i + 1}`,
        description: `Description for Category ${i + 1}`,
      },
    })),
    pageNumber: 1,
    pageSize: 10,
    totalItemCount: 30,
    pageCount: 3,
    isFirstPage: true,
    isLastPage: false,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};

export interface RegisterSupplierRequest {
  name: string;
  categoryId: number;
  phoneNumber: string;
  websiteUrl: string;
}

export interface UpdateSupplierProfileRequest {
  name: string;
  categoryId: number;
  phoneNumber: string;
  websiteUrl: string;
  price: number;
  description: string;
  responseTime: string;
  discount: string;
}

export interface UpdateSupplierAddressRequest {
  street: string;
  ward: string;
  district: string;
  province: string;
}

export interface UpdateSupplierImagesRequest {
  files: File[];
  primaryImageIndex?: number;
}

export interface PreviewImage {
  id?: number;
  imageUrl?: string;
}
