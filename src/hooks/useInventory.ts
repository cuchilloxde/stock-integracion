"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import type { Inventory } from "@/types";
import type {
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from "@/types/api";

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory: () => Promise<void> = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.getInventory();
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Error al cargar los datos de inventario");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addInventory = async (inventoryData: CreateInventoryRequest) => {
    try {
      const newInventory = await apiClient.createInventory(inventoryData);
      setInventory((prev) => [...prev, newInventory]);
      return newInventory;
    } catch (err) {
      console.error("Error creating inventory:", err);
      throw new Error("Error al crear el registro de inventario");
    }
  };

  const updateInventory = async (inventoryData: UpdateInventoryRequest) => {
    try {
      const updatedInventory = await apiClient.updateInventory(inventoryData);
      setInventory((prev) =>
        prev.map((item) =>
          item.productId === updatedInventory.productId
            ? updatedInventory
            : item
        )
      );
      return updatedInventory;
    } catch (err) {
      console.error("Error updating inventory:", err);
      throw new Error("Error al actualizar el inventario");
    }
  };

  return {
    inventory,
    isLoading,
    error,
    addInventory,
    updateInventory,
    refreshInventory: fetchInventory,
  };
}
