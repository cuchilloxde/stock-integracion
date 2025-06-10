import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { LowStockProduct } from "@/types";

interface LowStockAlertProps {
  products: LowStockProduct[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-5 w-5 text-pink-500 mr-2" />
          Productos con Stock Bajo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-pink-50 border border-pink-200"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                {/* <p className="text-xs text-gray-600">Proveedor: {product.supplier}</p> */}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-pink-600">
                  {product.stock} unidades
                </p>
                <p className="text-xs text-gray-500">Mín: {product.minStock}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
