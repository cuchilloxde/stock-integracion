"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, Inventory } from "@/types";

interface InventoryFormProps {
  inventory?: Inventory | null;
  products: Product[];
  onSubmit: (inventoryData: Inventory) => Promise<void>;
  onCancel: () => void;
  isUpdate?: boolean;
}

export function InventoryForm({
  inventory,
  products,
  onSubmit,
  onCancel,
  isUpdate = false,
}: InventoryFormProps) {
  const [formData, setFormData] = useState({
    productId: inventory?.productId?.toString() || "",
    quantity: inventory?.quantity?.toString() || "",
    minStock: inventory?.minStock?.toString() || "",
    location: inventory?.location || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Si es una actualización y hay un cambio en el inventario, actualizar el formulario
  useEffect(() => {
    if (inventory) {
      setFormData({
        productId: inventory.productId?.toString() || "",
        quantity: inventory.quantity?.toString() || "",
        minStock: inventory.minStock?.toString() || "",
        location: inventory.location || "",
      });
    }
  }, [inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const inventoryData = {
        productId: Number.parseInt(formData.productId),
        quantity: Number.parseInt(formData.quantity),
        minStock: Number.parseInt(formData.minStock),
        location: formData.location,
        lastUpdated: inventory?.lastUpdated || new Date().toISOString(),
      };

      await onSubmit(inventoryData);
    } catch (error) {
      console.error("Error submitting inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productId">Producto</Label>
        <Select
          value={formData.productId}
          onValueChange={(value) =>
            setFormData({ ...formData, productId: value })
          }
          disabled={isLoading || isUpdate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name} ({product.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Cantidad en Stock</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="minStock">Stock Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) =>
              setFormData({ ...formData, minStock: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Ubicación</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700"
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : isUpdate ? "Actualizar" : "Crear"}{" "}
          Inventario
        </Button>
      </div>
    </form>
  );
}

// la api ya funciona