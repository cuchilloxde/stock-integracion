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
import { ProductTable } from "@/components/products/product-table";
import { ProductForm } from "@/components/products/product-form";
import { CategoryForm } from "@/components/products/category-form";
import { useProducts } from "@/hooks/useProducts";
import type { Product, ProductFormData } from "@/types";

export default function ProductsPage() {
  const {
    products,
    categories,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitError, setSubmitError] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (productData: ProductFormData) => {
    try {
      setSubmitError("");
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      handleCloseDialog();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al guardar el producto"
      );
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setSubmitError("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingProduct(null);
    setSubmitError("");
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        await deleteProduct(id);
      } catch {
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleAddCategory = async (categoryData: {
    name: string;
    description: string;
  }) => {
    try {
      await addCategory(categoryData);
    } catch {
      alert("Error al crear la categoría");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos"
      >
        <div className="flex space-x-2">
          <CategoryForm onSubmit={handleAddCategory} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </DialogTitle>
              </DialogHeader>
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={handleCloseDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
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
              Lista de Productos ({filteredProducts.length})
            </CardTitle>
            <SearchInput
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
