"use client";

import type {
  ApiProduct,
  ApiProductCategory,
  ApiInventory,
  CreateProductRequest,
  UpdateProductRequest,
  CreateCategoryRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/api";

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `/api${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          window.location.reload();
          throw new Error("Sesión expirada");
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const text = await response.text();
        return text ? JSON.parse(text) : {} as T;
      }

      return {} as T;
    } catch (error) {
      console.warn("API Request failed:", error);
      throw error;
    }
  }

  // Simulación auth
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          credentials.email === "admin@stockmaster.com" &&
          credentials.password === "admin123"
        ) {
          resolve({
            token: "mock-jwt-token-" + Date.now(),
            user: {
              id: 1,
              name: "Administrador",
              email: credentials.email,
            },
          });
        } else {
          reject(new Error("Credenciales inválidas"));
        }
      }, 1000);
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: "mock-jwt-token-" + Date.now(),
          user: {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
          },
        });
      }, 1000);
    });
  }

  // Productos
  async getProducts(): Promise<ApiProduct[]> {
    return this.request<ApiProduct[]>("/products");
  }

  async getProduct(id: number): Promise<ApiProduct> {
    return this.request<ApiProduct>(`/products/${id}`);
  }

  async createProduct(product: CreateProductRequest): Promise<ApiProduct> {
    return this.request<ApiProduct>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  async updateProduct(product: UpdateProductRequest): Promise<ApiProduct> {
    return this.request<ApiProduct>("/products", {
      method: "PUT",
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    console.log("Deleting product with ID:", id);
    return this.request<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Categorías
  async getCategories(): Promise<ApiProductCategory[]> {
    return this.request<ApiProductCategory[]>("/product-category");
  }

  async getCategory(id: number): Promise<ApiProductCategory> {
    return this.request<ApiProductCategory>(`/product-category/${id}`);
  }

  async createCategory(
    category: CreateCategoryRequest
  ): Promise<ApiProductCategory> {
    return this.request<ApiProductCategory>("/product-category", {
      method: "POST",
      body: JSON.stringify(category),
    });
  }

  // Inventario
  async getInventory(): Promise<ApiInventory[]> {
    return this.request<ApiInventory[]>("/inventory");
  }

  async getInventoryByProduct(productId: number): Promise<ApiInventory> {
    return this.request<ApiInventory>(`/inventory/product/${productId}`);
  }

  async getInventoryById(id: number): Promise<ApiInventory> {
    return this.request<ApiInventory>(`/inventory/${id}`);
  }

  async createInventory(
    inventory: CreateInventoryRequest
  ): Promise<ApiInventory> {
    return this.request<ApiInventory>("/inventory", {
      method: "POST",
      body: JSON.stringify(inventory),
    });
  }

  async updateInventory(
    inventory: UpdateInventoryRequest
  ): Promise<ApiInventory> {
    return this.request<ApiInventory>("/inventory", {
      method: "PUT",
      body: JSON.stringify(inventory),
    });
  }

  async deleteInventory(id: number): Promise<void> {
    return this.request<void>(`/inventory/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
