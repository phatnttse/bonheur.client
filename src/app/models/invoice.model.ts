import { Account } from './account.model';
import { Order } from './order.model';
import { Supplier } from './supplier.model';

export interface Invoice {
  id: number;
  invoiceNumber: number;
  description: string;
  userId: string;
  user: Account;
  supplierId: number;
  supplier: Supplier;
  orderId: number;
  order: Order;
  totalAmount: number;
  discount: number;
  taxNumber: string;
  taxAmount: number;
  fileUrl: string;
  fileName: string;
  transactionId: string;
  companyName: string;
  companyAddress: string;
  phoneNumber: string;
  email: string;
  website: string;
  uen: string;
  createdAt: string;
  updatedAt: string;
}
