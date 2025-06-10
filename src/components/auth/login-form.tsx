"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Package, Info } from "lucide-react";

/* interface LoginFormProps {
  onToggleMode: () => void;
} */

export function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "admin@stockmaster.com",
    password: "admin123",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
    } catch {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Iniciar Sesión
          </CardTitle>
          <p className="text-gray-600">Accede a tu cuenta de StockMaster</p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-pink-200 bg-pink-50">
            <Info className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-700">
              <strong>Credenciales de prueba:</strong>
              <br />
              Email: admin@stockmaster.com
              <br />
              Contraseña: admin123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            {/*  <div className="text-center">
              <button
                type="button"
                onClick={onToggleMode}
                className="text-pink-600 hover:text-pink-700 text-sm"
                disabled={isLoading}
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
