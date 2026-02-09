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
import { updateExpense, deleteExpense } from "@/lib/actions";

interface EditExpenseDialogProps {
  expense: {
    id: string;
    description: string;
    amount: number;
    category: string | null;
    date: string; // serialized
    notes: string | null;
  };
}

export function EditExpenseDialog({ expense }: EditExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    formData.set("id", expense.id);
    setLoading(true);
    setErrors({});
    const result = await updateExpense(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
    } else {
      setOpen(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este gasto?")) return;
    await deleteExpense(expense.id);
    setOpen(false);
  }

  const dateValue = expense.date ? expense.date.split("T")[0] : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
          <DialogDescription>Modificá los datos del gasto.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-exp-desc">Descripción *</Label>
            <Input id="edit-exp-desc" name="description" defaultValue={expense.description} required />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-exp-amount">Monto ($) *</Label>
              <Input
                id="edit-exp-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={expense.amount}
                required
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-cat">Categoría</Label>
              <Input id="edit-exp-cat" name="category" defaultValue={expense.category ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exp-date">Fecha</Label>
            <Input id="edit-exp-date" name="date" type="date" defaultValue={dateValue} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-exp-notes">Notas</Label>
            <Input id="edit-exp-notes" name="notes" defaultValue={expense.notes ?? ""} />
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
