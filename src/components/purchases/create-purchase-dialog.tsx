"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createPurchase } from "@/lib/actions";

export function CreatePurchaseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await createPurchase(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Compra</DialogTitle>
          <DialogDescription>
            Registrá una compra de insumos.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplier">Proveedor *</Label>
            <Input id="supplier" name="supplier" placeholder="Nombre del proveedor" required />
            {errors.supplier && <p className="text-sm text-red-500">{errors.supplier[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Input id="description" name="description" placeholder="Ej: 50m tela algodón" required />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto ($) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="15000"
                required
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" placeholder="Ej: Telas" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" name="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Input id="notes" name="notes" placeholder="Observaciones..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
