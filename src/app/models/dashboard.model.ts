export interface DashboardData {
  totalUsers: number;
  totalSuppliers: number;
  totalOrders: number;
  totalInvoices: number;
  totalAdvertisements: number;
  totalRequestPricing: number;
  totalRevenue: number;
}

export interface MonthlyDashboardData {
  month: string;
  year: number;
  totalRevenue: number;
  totalOrders: number;
  totalSuppliers: number;
}

export interface TopSuppliersByRevenue {
  supplierId: number;
  name: string;
  phoneNumber: string;
  address: string;
  street: string;
  district: string;
  ward: string;
  province: string;
  websiteUrl: string;
  averageRating: number;
  totalRating: number;
  subscriptionPackage: string;
  totalPayment: number;
  totalCompletedOrders: number;
  primaryImageUrl: string;
}
