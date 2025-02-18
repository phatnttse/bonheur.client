export interface Transaction {
  reference: string;
  amount: number;
  accountNumber: string;
  description: string;
  transactionDateTime: string;
  virtualAccountName: string | null;
  virtualAccountNumber: string | null;
  counterAccountBankId: string | null;
  counterAccountBankName: string | null;
  counterAccountName: string | null;
  counterAccountNumber: string | null;
}

export interface PaymentLinkInformation {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: Transaction[];
  cancellationReason: string | null;
  canceledAt: string | null;
}

export interface CreateSpPaymentLinkRequest {
  spId: number;
}

export interface CreatePaymentResult {
  bin: string;
  accountNumber: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  expiredAt: number | null;
  checkoutUrl: string;
  qrCode: string;
}
