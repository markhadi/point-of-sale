export interface User {
  id: string;
  username: string;
  name: string;
  password: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  stock: number;
  price: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}

export interface ProductTransaction {
  transaction_id: string;
  customer_name: string;
  total_quantity: number;
  total_amount: number;
  payment_method_id: string;
  username: string;
  service_by: string;
  service_charge: number;
  issued_at: Date;
}

export interface ProductTransactionDetail {
  id: number;
  transaction_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  product_category_id: number;
  quantity: number;
  amount: number;
}
