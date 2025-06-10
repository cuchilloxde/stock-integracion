export interface ApiProduct {
  id: number
  sku: string
  name: string
  description: string
  price: number
  cost: number
  categoryId: number
}

export interface ApiProductCategory {
  id: number
  name: string
  description: string
}

export interface ApiInventory {
  productId: number
  quantity: number
  minStock: number
  location: string
  lastUpdated: string
}

// API Request Types
export interface CreateProductRequest {
  sku: string
  name: string
  description: string
  price: number
  cost: number
  categoryId: number
}

export interface UpdateProductRequest {
  id: number
  sku: string
  name: string
  description: string
  price: number
  cost: number
  categoryId: number
}

export interface CreateCategoryRequest {
  name: string
  description: string
}

export interface CreateInventoryRequest {
  productId: number
  quantity: number
  minStock: number
  location: string
}

export interface UpdateInventoryRequest {
  productId: number
  quantity: number
  minStock: number
  location: string
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
  }
}
