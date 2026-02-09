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
import { createArticle } from "@/lib/actions";

export function CreateArticleDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setErrors({});
    const result = await createArticle(formData);
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
          Nuevo Artículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Artículo</DialogTitle>
          <DialogDescription>
            Agregá un producto al catálogo.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" placeholder="Ej: Remera Oversize" required />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Precio Base *</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="5500"
                required
              />
              {errors.basePrice && <p className="text-sm text-red-500">{errors.basePrice[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" name="category" placeholder="Ej: Remeras" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" placeholder="Descripción del artículo..." />
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
