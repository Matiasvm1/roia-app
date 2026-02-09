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
import { Pencil } from "lucide-react";
import { updateArticle, toggleArticleActive } from "@/lib/actions";

interface EditArticleDialogProps {
  article: {
    id: string;
    name: string;
    basePrice: number;
    category: string | null;
    description: string | null;
    isActive: boolean;
  };
}

export function EditArticleDialog({ article }: EditArticleDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    formData.set("id", article.id);
    setLoading(true);
    setErrors({});
    const result = await updateArticle(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
    } else {
      setOpen(false);
    }
  }

  async function handleToggleActive() {
    await toggleArticleActive(article.id);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <DialogDescription>Modificá los datos del artículo.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-art-name">Nombre *</Label>
            <Input id="edit-art-name" name="name" defaultValue={article.name} required />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-art-price">Precio base ($) *</Label>
              <Input
                id="edit-art-price"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={article.basePrice}
                required
              />
              {errors.basePrice && <p className="text-sm text-red-500">{errors.basePrice[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-art-cat">Categoría</Label>
              <Input id="edit-art-cat" name="category" defaultValue={article.category ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-art-desc">Descripción</Label>
            <Input id="edit-art-desc" name="description" defaultValue={article.description ?? ""} />
          </div>
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant={article.isActive ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleActive}
            >
              {article.isActive ? "Desactivar" : "Activar"}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
