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
import { updateClient, toggleClientActive } from "@/lib/actions";

interface EditClientDialogProps {
  client: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    notes: string | null;
    isActive: boolean;
  };
}

export function EditClientDialog({ client }: EditClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    formData.set("id", client.id);
    setLoading(true);
    setErrors({});
    const result = await updateClient(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error as Record<string, string[]>);
    } else {
      setOpen(false);
    }
  }

  async function handleToggleActive() {
    await toggleClientActive(client.id);
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
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>Modificá los datos del cliente.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre *</Label>
            <Input id="edit-name" name="name" defaultValue={client.name} required />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" defaultValue={client.email ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input id="edit-phone" name="phone" defaultValue={client.phone ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Input id="edit-address" name="address" defaultValue={client.address ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">Ciudad</Label>
              <Input id="edit-city" name="city" defaultValue={client.city ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notas</Label>
            <Input id="edit-notes" name="notes" defaultValue={client.notes ?? ""} />
          </div>
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant={client.isActive ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleActive}
            >
              {client.isActive ? "Desactivar" : "Activar"}
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
