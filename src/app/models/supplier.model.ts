import { SafeHtml } from '@angular/platform-browser';
import { BaseResponse, PaginationResponse } from './base.model';
import { SupplierCategory } from './category.model';
import { OnBoardStatus, StatusCode, SupplierStatus } from './enums.model';
import { SubscriptionPackage } from './subscription-packages.model';
import { SocialNetwork } from './social-network';
import { Review } from './review.model';

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
  address?: string;
  longitude?: string;
  latitude?: string;
  websiteUrl?: string;
  responseTimeStart?: string;
  responseTimeEnd?: string;
  priority: number;
  status?: SupplierStatus;
  discount: number;
  onBoardStatus?: OnBoardStatus;
  onBoardPercent: number;
  isFeatured: boolean;
  priorityEnd?: Date;
  averageRating: number;
  totalRating: number;
  totalReview: number;
  view?: number;
  images?: SupplierImage[];
  socialNetworks?: SupplierSocialNetworkDetail[];
  faqs?: SupplierFAQ[];
  reviews?: Review[];
  subscriptionPackage?: SubscriptionPackage;
}

export interface SupplierImage {
  id: number;
  imageUrl?: string;
  imageFileName?: string;
  isPrimary: boolean;
}

export interface SupplierSocialNetworkDetail {
  id: number;
  socialNetwork: SocialNetwork;
  url: string;
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

// export const mockSupplierData: PaginationResponse<Supplier> = {
//   success: true,
//   message: 'Data retrieved successfully',
//   statusCode: StatusCode.OK,
//   data: {
//     items: Array.from({ length: 10 }, (_, i) => ({
//       id: i + 1,
//       name: `Supplier ${i + 1}`,
//       slug: `supplier-${i + 1}`,
//       description: `Supplier ${i + 1} Based in Bath, Somerset,
//       Icarus Photography is a wedding photography service offering a blend of traditional and documentary styles...
//        ${
//          i + 1
//        } is known for innovation, reliability, and outstanding customer service.`,
//       price: 50000 + i * 1000,
//       street: `${i + 1} Main St`,
//       province: i % 2 === 0 ? 'Hà Nội' : 'Hồ Chí Minh',
//       ward: i % 3 === 0 ? 'Ba Dinh' : 'District 1',
//       district: i % 2 === 0 ? 'Dong Da' : 'Thu Duc',
//       websiteUrl: `https://supplier${i + 1}.com`,
//       responseTime: `${24 + (i % 5)}h`,
//       priority: (i % 3) + 1,
//       onBoardPercent: 50 + (i % 50),
//       isFeatured: i % 2 === 0,
//       averageRating: 3.5 + (i % 2),
//       discount: i % 2 === 0 ? 10 : 0,
//       images: [
//         {
//           id: 100 + i,
//           imageUrl:
//             'https://cdn0.hitched.co.uk/vendor/2529/3_2/640/jpg/flower-and-fields-van_4_352529-170566673258546.webp',
//           imageFileName: `supplier${i + 1}.jpg`,
//           isPrimary: true,
//         },
//       ],
//       category: {
//         id: i + 1,
//         name: `Category ${i + 1}`,
//         description: `Description for Category ${i + 1}`,
//         imageUrl: `Image for Category ${i + 1}`,
//         imageFileName: `Image for Category ${i + 1}`,
//       },
//     })),
//     pageNumber: 1,
//     pageSize: 10,
//     totalItemCount: 30,
//     pageCount: 3,
//     isFirstPage: true,
//     isLastPage: false,
//     hasNextPage: true,
//     hasPreviousPage: false,
//   },
// };

export interface RegisterSupplierRequest {
  name: string;
  categoryId: number;
  phoneNumber: string;
  websiteUrl: string;
}

export interface UpdateSupplierProfileRequest {
  name?: string;
  categoryId?: number;
  phoneNumber?: string;
  websiteUrl?: string;
  price?: number;
  description?: string;
  responseTimeStart?: string;
  responseTimeEnd?: string;
  discount?: number;
}

export interface UpdateSupplierAddressRequest {
  street: string;
  ward: string;
  district: string;
  province: string;
  longitude: string;
  latitude: string;
}

export interface UpdateSupplierImagesRequest {
  files: File[];
  primaryImageIndex: number | null;
}

export interface PreviewImage {
  id?: number;
  imageUrl?: string;
}

export interface GetSuppliersParams {
  supplierName?: string;
  supplierCategoryIds?: number[];
  supplierCategoryId?: number;
  province?: string;
  isFeatured?: boolean;
  averageRating?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: SupplierStatus;
  sortAsc?: boolean | null;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
}

export interface SaveDiscountRequest {
  discount: number;
}

export interface SupplierSocialNetwork {
  id: number;
  socialNetworkId: number;
  url: string;
}

export interface SupplierFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface SupplierSocialNetworkRequest {
  id?: number;
  socialNetworkId: number;
  url: string;
}
export interface SupplierFAQRequest {
  id?: number;
  question: string;
  answer: string;
}
