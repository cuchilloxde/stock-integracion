"use client"

import { useState } from "react"
import type { Supplier } from "@/types"

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Dell Inc.",
    contactPerson: "María González",
    email: "maria.gonzalez@dell.com",
    phone: "+1-555-0123",
    address: "123 Tech Street",
    city: "Austin",
    country: "Estados Unidos",
    category: "Tecnología",
    status: "active",
    productsCount: 15,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Logitech",
    contactPerson: "Carlos Rodríguez",
    email: "carlos@logitech.com",
    phone: "+1-555-0456",
    address: "456 Innovation Ave",
    city: "Lausanne",
    country: "Suiza",
    category: "Accesorios",
    status: "active",
    productsCount: 23,
    rating: 4.6,
  },
  {
    id: 3,
    name: "Samsung Electronics",
    contactPerson: "Ana Kim",
    email: "ana.kim@samsung.com",
    phone: "+82-555-0789",
    address: "789 Digital Road",
    city: "Seúl",
    country: "Corea del Sur",
    category: "Electrónicos",
    status: "active",
    productsCount: 31,
    rating: 4.7,
  },
]

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)

  const addSupplier = (supplier: Omit<Supplier, "id" | "productsCount" | "rating">) => {
    const newSupplier = { ...supplier, id: Date.now(), productsCount: 0, rating: 0 }
    setSuppliers((prev) => [...prev, newSupplier])
  }

  const updateSupplier = (id: number, supplier: Omit<Supplier, "id" | "productsCount" | "rating">) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...supplier, id, productsCount: s.productsCount, rating: s.rating } : s)),
    )
  }

  const deleteSupplier = (id: number) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id))
  }

  return {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  }
}
