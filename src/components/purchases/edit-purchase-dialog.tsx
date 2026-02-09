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
import { Pencil, Trash2 } from "lucide-react";
import { updatePurchase, deletePurchase } from "@/lib/actions";

interface EditPurchaseDialogProps {
  purchase: {
    id: string;
    supplier: string;
    description: string;
    amount: number;
    category: string | null;
    date: string; // serialized
    notes: string | null;
  };
}

export function EditPurchaseDialog({ purchase }: EditPurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    formData.set("id", purchase.id);
    setLoading(true);
    setErrors({});
    const result = await updatePurchase(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
    } else {
      setOpen(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar esta compra?")) return;
    await deletePurchase(purchase.id);
    setOpen(false);
  }

  const dateValue = purchase.date ? purchase.date.split("T")[0] : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Compra</DialogTitle>
          <DialogDescription>Modificá los datos de la compra.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-pur-supplier">Proveedor *</Label>
              <Input id="edit-pur-supplier" name="supplier" defaultValue={purchase.supplier} required />
              {errors.supplier && <p className="text-sm text-red-500">{errors.supplier[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pur-amount">Monto ($) *</Label>
              <Input
                id="edit-pur-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={purchase.amount}
                required
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount[0]}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-pur-desc">Descripción *</Label>
            <Input id="edit-pur-desc" name="description" defaultValue={purchase.description} required />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-pur-cat">Categoría</Label>
              <Input id="edit-pur-cat" name="category" defaultValue={purchase.category ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pur-date">Fecha</Label>
              <Input id="edit-pur-date" name="date" type="date" defaultValue={dateValue} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-pur-notes">Notas</Label>
            <Input id="edit-pur-notes" name="notes" defaultValue={purchase.notes ?? ""} />
          </div>
          <div className="flex justify-between pt-2">
            <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Eliminar
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
