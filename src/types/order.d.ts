import { Timestamp } from 'firebase/firestore';

export interface IOrderItem {
  id: string;
  orderNumber: string;
  createdAt: number;
  status: string;
  taxes: number;
  shipping: number;
  discount: number;
  subtotal: number;
  totalAmount: number;
  totalQuantity: number;
  message?: string;
  attachmentUrl?: string;
  attachments?: Array<{
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
    productId?: string;
    isBrandLogo?: boolean;
  }>;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    ipAddress: string;
  };
  items: Array<{
    id: string;
    sku: string;
    name: string;
    price: number;
    coverUrl: string;
    quantity: number;
    productUrl?: string;
    unitCost?: number;
    unitPrintingCost?: number;
    description?: string;
    isCustomProduct?: boolean;
    customProductData?: any;
  }>;
  delivery: {
    shipBy: string;
    speedy: string;
    trackingNumber: string;
  };
  history: {
    orderTime: number | null;
    contactedTime: number | null;
    completionTime: number | null;
    timeline: Array<{
      id?: string;
      title: string;
      time: number;
      status: string;
      createdBy?: string | null;
      createdByName?: string;
      createdByEmail?: string | null;
    }>;
  };
  shippingAddress: {
    fullAddress: string;
    phoneNumber: string;
  };
} 