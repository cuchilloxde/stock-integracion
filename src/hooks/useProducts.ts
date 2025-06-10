"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type { Inventory, Product, ProductCategory } from "@/types";
import type { CreateProductRequest, UpdateProductRequest } from "@/types/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch products and categories in parallel
      const [productsData, categoriesData] = await Promise.all([
        apiClient.getProducts().catch(() => []), // Fallback to empty array if fails
        apiClient.getCategories().catch(() => []), // Fallback to empty array if fails
      ]);

      // Fetch inventory data
      let inventoryData: Inventory[] = [];
      try {
        inventoryData = await apiClient.getInventory();
      } catch (err) {
        console.warn("Could not fetch inventory data:", err);
      }

      // Combine products with their categories and inventory
      const enrichedProducts: Product[] = productsData.map((product) => {
        const category = categoriesData.find(
          (cat) => cat.id === product.categoryId
        );
        const inventory = inventoryData.find(
          (inv) => inv.productId === product.id
        );

        return {
          ...product,
          category,
          inventory,
        };
      });

      setProducts(enrichedProducts);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error al cargar los datos. Verifica tu conexión a internet.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (
    productData: Omit<CreateProductRequest, "categoryId"> & {
      categoryId: number;
    }
  ) => {
    try {
      const newProduct = await apiClient.createProduct(productData);
      await fetchProducts(); // Refresh the list
      return newProduct;
    } catch (err) {
      console.error("Error creating product:", err);
      throw new Error(
        "Error al crear el producto. Verifica los datos e intenta nuevamente."
      );
    }
  };

  const updateProduct = async (
    id: number,
    productData: Omit<UpdateProductRequest, "id">
  ) => {
    try {
      const updatedProduct = await apiClient.updateProduct({
        ...productData,
        id,
      });
      await fetchProducts(); // Refresh the list
      return updatedProduct;
    } catch (err) {
      console.error("Error updating product:", err);
      throw new Error("Error al actualizar el producto. Intenta nuevamente.");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await apiClient.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error("Error deleting product:", err);
      throw new Error("Error al eliminar el producto. Intenta nuevamente.");
    }
  };

  const addCategory = async (categoryData: {
    name: string;
    description: string;
  }) => {
    try {
      const newCategory = await apiClient.createCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Error creating category:", err);
      throw new Error("Error al crear la categoría. Intenta nuevamente.");
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    refreshProducts: fetchProducts,
  };
}
