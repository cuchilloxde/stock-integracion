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
import { Edit, Trash2, Users, Phone, Mail, MapPin } from "lucide-react";
import { Supplier } from "@/types";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

export function SupplierTable({
  suppliers,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proveedor</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Calificación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell>
              <div>
                <div className="font-medium text-gray-900">{supplier.name}</div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  {supplier.contactPerson}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="text-sm flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-gray-400" />
                  {supplier.email}
                </div>
                <div className="text-sm flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-gray-400" />
                  {supplier.phone}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                {supplier.city}, {supplier.country}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{supplier.category}</Badge>
            </TableCell>
            <TableCell className="font-medium">
              {supplier.productsCount}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">
                  {getRatingStars(supplier.rating)}
                </span>
                <span className="text-sm text-gray-600">
                  ({supplier.rating})
                </span>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(supplier.status)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(supplier)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(supplier.id)}
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
  );
}
