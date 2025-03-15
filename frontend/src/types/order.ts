export interface Order {
  id?: string;
  productName?: string;
  orderDate?: string;
  updatedAt?: string;
  buyerId: string;
  sellerId?: string;
  totalPrice?: string;
  shippingAddress: string;
  productId: string;
  quantity: number;
  status: string;
}
