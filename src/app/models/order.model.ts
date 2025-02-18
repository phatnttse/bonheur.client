import { Supplier } from './supplier.model';
import { SubscriptionPackage } from './subscription-packages.model';
import { Account } from './account.model';

export interface Order {
  id: number;
  orderCode: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  user: Account;
  supplier: Supplier;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  subscriptionPackage: SubscriptionPackage;
  // adPackage: AdPackage;
  name: string;
  price: number;
  quantity: number;
  totalAmount: number;
}
