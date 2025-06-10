"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { useInventory } from "@/hooks/useInventory";
import { useProducts } from "@/hooks/useProducts";
import type { Inventory } from "@/types";

export default function InventoryPage() {
  const {
    inventory,
    isLoading: isLoadingInventory,
    error: inventoryError,
    addInventory,
    updateInventory,
  } = useInventory();
  const {
    products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(
    null
  );
  const [submitError, setSubmitError] = useState("");

  const isLoading = isLoadingInventory || isLoadingProducts;
  const error = inventoryError || productsError;

  // Filtrar inventario por nombre de producto o ubicación
  const filteredInventory = inventory.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    return (
      product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = async (inventoryData: Inventory) => {
    try {
      setSubmitError("");
      if (editingInventory) {
        await updateInventory(inventoryData);
      } else {
        await addInventory(inventoryData);
      }
      handleCloseDialog();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al guardar el inventario"
      );
    }
  };

  const handleEdit = (inventory: Inventory) => {
    setEditingInventory(inventory);
    setSubmitError("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingInventory(null);
    setSubmitError("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        description="Gestiona el stock de tus productos"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingInventory
                  ? "Actualizar Stock"
                  : "Nuevo Registro de Inventario"}
              </DialogTitle>
            </DialogHeader>
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <InventoryForm
              inventory={editingInventory}
              products={products}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              isUpdate={!!editingInventory}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Registros de Inventario ({filteredInventory.length})
            </CardTitle>
            <SearchInput
              placeholder="Buscar por producto o ubicación..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardContent>
          <InventoryTable
            inventory={filteredInventory}
            products={products}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
