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
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { SupplierTable } from "@/components/suppliers/supplier-table";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { useSuppliers } from "@/hooks/useSuppliers";
import type { Supplier } from "@/types";

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } =
    useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (
    supplierData: Omit<Supplier, "id" | "productsCount" | "rating">
  ) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierData);
    } else {
      addSupplier(supplierData);
    }
    handleCloseDialog();
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingSupplier(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proveedores"
        description="Gestiona tu red de proveedores"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
              </DialogTitle>
            </DialogHeader>
            <SupplierForm
              supplier={editingSupplier}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Lista de Proveedores ({filteredSuppliers.length})
            </CardTitle>
            <SearchInput
              placeholder="Buscar proveedores..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardContent>
          <SupplierTable
            suppliers={filteredSuppliers}
            onEdit={handleEdit}
            onDelete={deleteSupplier}
          />
        </CardContent>
      </Card>
    </div>
  );
}
