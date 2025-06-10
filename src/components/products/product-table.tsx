"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Archive } from "lucide-react";
import type { Inventory, Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { apiClient } from "@/lib/api";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  isLoading,
}: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);

  const handleManageInventory = (product: Product) => {
    setSelectedProduct(product);
    setIsInventoryDialogOpen(true);
  };

  const handleInventorySubmit = async (inventoryData: Inventory) => {
    if (!selectedProduct) return;

    try {
      // Si ya existe un inventario para este producto, actualizarlo
      if (selectedProduct.inventory) {
        await apiClient.updateInventory(inventoryData);
      } else {
        // Si no existe, crear uno nuevo
        await apiClient.createInventory(inventoryData);
      }
      setIsInventoryDialogOpen(false);
      // Recargar la página para ver los cambios
      window.location.reload();
    } catch (error) {
      console.error("Error managing inventory:", error);
      alert("Error al gestionar el inventario");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
              <TableCell className="font-medium">
                ${product.price.toLocaleString("es-CL")}
              </TableCell>
              <TableCell className="text-gray-600">
                ${product.cost.toLocaleString("es-CL")}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-medium ${
                      product.inventory &&
                      product.inventory.quantity <= product.inventory.minStock
                        ? "text-pink-600"
                        : "text-gray-900"
                    }`}
                  >
                    {product.inventory?.quantity || 0}
                  </span>
                  {product.inventory &&
                    product.inventory.quantity <=
                      product.inventory.minStock && (
                      <Badge variant="destructive" className="text-xs">
                        Bajo
                      </Badge>
                    )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category?.name || "Sin categoría"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {product.inventory?.location || "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManageInventory(product)}
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={isInventoryDialogOpen}
        onOpenChange={setIsInventoryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Gestionar Inventario: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <InventoryForm
              inventory={selectedProduct.inventory || null}
              products={[selectedProduct]}
              onSubmit={handleInventorySubmit}
              onCancel={() => setIsInventoryDialogOpen(false)}
              isUpdate={!!selectedProduct.inventory}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
