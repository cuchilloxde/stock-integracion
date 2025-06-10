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
import { Edit } from "lucide-react";
import type { Inventory, Product } from "@/types";

interface InventoryTableProps {
  inventory: Inventory[];
  products: Product[];
  onEdit: (inventory: Inventory) => void;
  isLoading?: boolean;
}

export function InventoryTable({
  inventory,
  products,
  onEdit,
  isLoading,
}: InventoryTableProps) {
  // Función para obtener el nombre del producto por ID
  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Producto desconocido";
  };

  // Función para obtener el SKU del producto por ID
  const getProductSku = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.sku : "N/A";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No hay registros de inventario disponibles
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Stock Mínimo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Última Actualización</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item) => (
          <TableRow key={item.productId}>
            <TableCell>{getProductName(item.productId)}</TableCell>
            <TableCell className="font-mono text-sm">
              {getProductSku(item.productId)}
            </TableCell>
            <TableCell className="font-medium">{item.quantity}</TableCell>
            <TableCell>{item.minStock}</TableCell>
            <TableCell>
              {item.quantity <= item.minStock ? (
                <Badge variant="destructive">Bajo Stock</Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  OK
                </Badge>
              )}
            </TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell className="text-sm text-gray-600">
              {new Date(item.lastUpdated).toLocaleString("es-ES", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                <Edit className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
