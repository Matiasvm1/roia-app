"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Save, Trash2, Calendar, FileText } from "lucide-react";
import { updateOrder, deleteOrder } from "@/lib/actions";
import { StatusBadge } from "@/components/orders/status-badge";
import { OrderImageGallery } from "@/components/orders/order-image-gallery";
import type { ImageData } from "@/components/orders/order-image-gallery";

// Tipos serializados (las fechas llegan como string desde RSC)
export type SerializedOrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  size: string | null;
  notes: string | null;
  article: { name: string; basePrice: number };
};

export type SerializedOrder = {
  id: string;
  orderNumber: number;
  totalPrice: number;
  deliveryDate: string | null;
  notes: string | null;
  createdAt: string;
  client: { name: string };
  status: { id: string; name: string; colorHex: string };
  items: SerializedOrderItem[];
  images: ImageData[];
};

type StatusOption = { id: string; name: string; colorHex: string };

interface OrderDetailDialogProps {
  order: SerializedOrder;
  statuses: StatusOption[];
}

export function OrderDetailDialog({ order, statuses }: OrderDetailDialogProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Campos editables
  const [statusId, setStatusId] = useState(order.status.id);
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");

  const currentStatus = statuses.find((s) => s.id === statusId) ?? order.status;

  async function handleSave() {
    setLoading(true);
    const formData = new FormData();
    formData.set("orderId", order.id);
    formData.set("statusId", statusId);
    formData.set("deliveryDate", deliveryDate);
    formData.set("notes", notes);

    await updateOrder(formData);
    setLoading(false);
    setEditing(false);
    setOpen(false);
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar esta orden? Se borrarán también sus imágenes. Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    await deleteOrder(order.id);
    setDeleting(false);
    setOpen(false);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setEditing(false);
      setStatusId(order.status.id);
      setDeliveryDate(order.deliveryDate ?? "");
      setNotes(order.notes ?? "");
    }
  }

  const formattedCreatedAt = new Date(order.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedDelivery = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Ver detalle">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle className="text-xl">
              Orden #{order.orderNumber}
            </DialogTitle>
            <StatusBadge name={currentStatus.name} colorHex={currentStatus.colorHex} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* ── Información General ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <span className="text-xs text-muted-foreground">Cliente</span>
              <p className="font-semibold">{order.client.name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Creada</span>
              <p className="font-medium">{formattedCreatedAt}</p>
            </div>

            {/* Estado */}
            <div>
              <span className="text-xs text-muted-foreground">Estado</span>
              {editing ? (
                <Select value={statusId} onValueChange={setStatusId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: s.colorHex }}
                          />
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-0.5">
                  <StatusBadge name={currentStatus.name} colorHex={currentStatus.colorHex} />
                </div>
              )}
            </div>

            {/* Fecha de Entrega */}
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Fecha de Entrega
              </span>
              {editing ? (
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{formattedDelivery ?? "Sin definir"}</p>
              )}
            </div>
          </div>

          {/* ── Imágenes de Diseño ─────────────────────── */}
          <OrderImageGallery
            orderId={order.id}
            images={order.images}
            editable={true}
          />

          {/* ── Notas ──────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> Notas
            </Label>
            {editing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Observaciones de la orden..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            ) : (
              <p className="text-sm">{order.notes || "Sin notas."}</p>
            )}
          </div>

          {/* ── Detalle de Artículos ───────────────────── */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Artículos ({order.items.length})
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artículo</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">P. Unit.</TableHead>
                    <TableHead className="hidden sm:table-cell">Talle</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => {
                    const subtotal = item.unitPrice * item.quantity;
                    const priceChanged = item.unitPrice !== item.article.basePrice;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="font-medium">{item.article.name}</span>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <span className={priceChanged ? "text-amber-600 font-medium" : ""}>
                            ${item.unitPrice.toLocaleString("es-AR")}
                          </span>
                          {priceChanged && (
                            <span className="block text-xs text-muted-foreground line-through">
                              ${item.article.basePrice.toLocaleString("es-AR")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {item.size ? (
                            <Badge variant="outline">{item.size}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${subtotal.toLocaleString("es-AR")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile: mostrar talle y color debajo de cada item */}
            <div className="sm:hidden space-y-2">
              {order.items
                .filter((item) => item.size)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span className="font-medium">{item.article.name}:</span>
                    {item.size && <Badge variant="outline" className="text-xs">{item.size}</Badge>}
                  </div>
                ))}
            </div>

            {/* Total */}
            <div className="flex justify-end pt-2 border-t">
              <span className="text-lg font-bold">
                Total: ${order.totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          {/* ── Acciones ───────────────────────────────── */}
          <div className="flex flex-wrap gap-2 justify-between pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setStatusId(order.status.id);
                      setDeliveryDate(order.deliveryDate ?? "");
                      setNotes(order.notes ?? "");
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="mr-1 h-4 w-4" />
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Editar Orden
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
