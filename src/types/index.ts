import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ProductFormData = {
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  categoryId: number;
};

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  categoryId: number;
  category?: ProductCategory;
  inventory?: Inventory;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface Inventory {
  productId: number;
  quantity: number;
  minStock: number;
  location: string;
  lastUpdated: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DashboardStats {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  color: string;
}

export interface Activity {
  action: string;
  item: string;
  time: string;
  type: "add" | "update" | "delete";
}

export interface LowStockProduct {
  name: string;
  stock: number;
  minStock: number;
  location: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
  category: string;
  productsCount: number;
  rating: number;
  status: string;
}
