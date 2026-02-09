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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { createOrder } from "@/lib/actions";

type ClientOption = { id: string; name: string };
type StatusOption = { id: string; name: string };
type ArticleOption = { id: string; name: string; basePrice: number };

type OrderItem = {
  articleId: string;
  articleName: string;
  quantity: number;
  unitPrice: number;
  size: string;
  color: string;
};

interface CreateOrderDialogProps {
  clients: ClientOption[];
  statuses: StatusOption[];
  articles: ArticleOption[];
}

export function CreateOrderDialog({ clients, statuses, articles }: CreateOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [items, setItems] = useState<OrderItem[]>([]);
  const [clientId, setClientId] = useState("");
  const [statusId, setStatusId] = useState("");

  function addItem() {
    setItems([
      ...items,
      { articleId: "", articleName: "", quantity: 1, unitPrice: 0, size: "", color: "" },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof OrderItem, value: string | number) {
    const updated = [...items];
    (updated[index] as Record<string, string | number>)[field] = value;
    setItems(updated);
  }

  function handleArticleSelect(index: number, articleId: string) {
    const article = articles.find((a) => a.id === articleId);
    if (article) {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        articleId: article.id,
        articleName: article.name,
        unitPrice: article.basePrice,
      };
      setItems(updated);
    }
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  async function handleSubmit(formData: FormData) {
    formData.set("clientId", clientId);
    formData.set("statusId", statusId);
    formData.set(
      "items",
      JSON.stringify(
        items.map((item) => ({
          articleId: item.articleId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          size: item.size || undefined,
          color: item.color || undefined,
        }))
      )
    );

    setLoading(true);
    setErrors({});
    const result = await createOrder(formData);
    setLoading(false);

    if (result.error) {
      setErrors(result.error);
    } else {
      setOpen(false);
      setItems([]);
      setClientId("");
      setStatusId("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Orden
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Producción</DialogTitle>
          <DialogDescription>
            Seleccioná un cliente, estado y agregá los artículos.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {/* Cliente y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientId && <p className="text-sm text-red-500">{errors.clientId[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select value={statusId} onValueChange={setStatusId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.statusId && <p className="text-sm text-red-500">{errors.statusId[0]}</p>}
            </div>
          </div>

          {/* Fecha y Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Fecha de entrega</Label>
              <Input id="deliveryDate" name="deliveryDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input id="notes" name="notes" placeholder="Observaciones..." />
            </div>
          </div>

          {/* Artículos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Artículos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-3 w-3" />
                Agregar
              </Button>
            </div>
            {errors.items && <p className="text-sm text-red-500">{errors.items[0]}</p>}

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                Hacé click en &quot;Agregar&quot; para añadir artículos a la orden.
              </p>
            )}

            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Artículo #{index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Artículo</Label>
                    <Select
                      value={item.articleId}
                      onValueChange={(val) => handleArticleSelect(index, val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar artículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {articles.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name} - ${a.basePrice.toLocaleString("es-AR")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Precio unitario ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Talle</Label>
                    <Input
                      placeholder="Ej: M, L, XL"
                      value={item.size}
                      onChange={(e) => updateItem(index, "size", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Color</Label>
                    <Input
                      placeholder="Ej: Negro, Blanco"
                      value={item.color}
                      onChange={(e) => updateItem(index, "color", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-sm text-right text-muted-foreground">
                  Subtotal: <span className="font-medium text-foreground">${(item.unitPrice * item.quantity).toLocaleString("es-AR")}</span>
                </p>
              </div>
            ))}

            {items.length > 0 && (
              <div className="text-right border-t pt-3">
                <span className="text-lg font-bold">
                  Total: ${total.toLocaleString("es-AR")}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || items.length === 0}>
              {loading ? "Guardando..." : "Crear Orden"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
