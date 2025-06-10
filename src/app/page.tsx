"use client";

import { Package, Users, AlertTriangle, DollarSign } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { LowStockAlert } from "@/components/dashboard/low-stock-alert";
import { PageHeader } from "@/components/shared/page-header";
import { useProducts } from "@/hooks/useProducts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DashboardStats, Activity, LowStockProduct } from "@/types";

export default function Dashboard() {
  const { products, isLoading, error } = useProducts();

  // Calculate real stats from API data
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * (product.inventory?.quantity || 0),
    0
  );
  const lowStockCount = products.filter(
    (product) =>
      product.inventory &&
      product.inventory.quantity <= product.inventory.minStock
  ).length;

  const stats: DashboardStats[] = [
    {
      title: "Total Productos",
      value: totalProducts.toString(),
      change: "+12%",
      changeType: "positive",
      icon: Package,
      color: "bg-pink-500",
    },
    {
      title: "Categorías Activas",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: Users,
      color: "bg-pink-600",
    },
    {
      title: "Valor Total Stock",
      value: `$${totalValue.toLocaleString()}`,
      change: "+8.2%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-pink-400",
    },
    {
      title: "Productos Bajo Stock",
      value: lowStockCount.toString(),
      change: "-5",
      changeType: "negative",
      icon: AlertTriangle,
      color: "bg-pink-700",
    },
  ];

  const recentActivity: Activity[] = [
    {
      action: "Producto agregado",
      item: "Nuevo producto desde API",
      time: "Hace 2 horas",
      type: "add",
    },
    {
      action: "Stock actualizado",
      item: "Inventario sincronizado",
      time: "Hace 4 horas",
      type: "update",
    },
    {
      action: "Categoría creada",
      item: "Nueva categoría",
      time: "Hace 1 día",
      type: "add",
    },
    {
      action: "Producto eliminado",
      item: "Producto descontinuado",
      time: "Hace 2 días",
      type: "delete",
    },
  ];

  const lowStockProducts: LowStockProduct[] = products
    .filter(
      (product) =>
        product.inventory &&
        product.inventory.quantity <= product.inventory.minStock
    )
    .slice(0, 4)
    .map((product) => ({
      name: product.name,
      stock: product.inventory?.quantity || 0,
      minStock: product.inventory?.minStock || 0,
      location: product.inventory?.location || "N/A",
    }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Resumen general de tu inventario"
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general de tu inventario"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivity} />
        <LowStockAlert products={lowStockProducts} />
      </div>
    </div>
  );
}
