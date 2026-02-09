import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/orders/status-badge";
import { CreateOrderDialog } from "@/components/orders/create-order-dialog";
import { OrderDetailDialog } from "@/components/orders/order-detail-dialog";
import type { SerializedOrder } from "@/components/orders/order-detail-dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function OrdersPage() {
  const [orders, clients, statuses, articles] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        status: true,
        items: { include: { article: true } },
        images: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.client.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.productionStatus.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      select: { id: true, name: true, colorHex: true },
    }),
    prisma.article.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, basePrice: true },
    }),
  ]);

  // Serializar fechas para poder pasar a Client Components
  const serializedOrders: SerializedOrder[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    totalPrice: o.totalPrice,
    deliveryDate: o.deliveryDate ? o.deliveryDate.toISOString().split("T")[0] : null,
    notes: o.notes,
    createdAt: o.createdAt.toISOString(),
    client: { name: o.client.name },
    status: { id: o.status.id, name: o.status.name, colorHex: o.status.colorHex },
    items: o.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      size: item.size,
      color: item.color,
      notes: item.notes,
      article: { name: item.article.name, basePrice: item.article.basePrice },
    })),
    images: o.images.map((img) => ({
      id: img.id,
      url: img.url,
      fileName: img.fileName,
    })),
  }));

  const totalIncome = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} órdenes · Total :{" "}
            <span className="font-semibold text-foreground">
              ${totalIncome.toLocaleString("es-AR")}
            </span>
          </p>
        </div>
        <CreateOrderDialog clients={clients} statuses={statuses} articles={articles} />
      </div>

      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <ClipboardList className="h-8 w-8" />
              </div>
              <p className="font-medium">No hay órdenes registradas todavía</p>
              <p className="text-sm mt-1">
                Hacé click en &quot;Nueva Orden&quot; para crear la primera.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 pl-6">#</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Artículos</TableHead>
                  <TableHead className="hidden lg:table-cell">Entrega</TableHead>
                  <TableHead className="hidden lg:table-cell">Diseño</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="w-10 pr-6">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serializedOrders.map((order, index) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-medium pl-6 text-muted-foreground">#{order.orderNumber}</TableCell>
                    <TableCell className="font-medium">{order.client.name}</TableCell>
                    <TableCell>
                      <StatusBadge
                        name={order.status.name}
                        colorHex={order.status.colorHex}
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-1 text-sm">
                            <span>{item.article.name}</span>
                            <span className="text-muted-foreground">×{item.quantity}</span>
                            {item.size && (
                              <Badge variant="outline" className="text-xs py-0 px-1">
                                {item.size}
                              </Badge>
                            )}
                            {item.color && (
                              <Badge variant="secondary" className="text-xs py-0 px-1">
                                {item.color}
                              </Badge>
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{order.items.length - 2} más
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">
                      {order.deliveryDate
                        ? format(new Date(order.deliveryDate), "dd MMM yyyy", { locale: es })
                        : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.images.length > 0 ? (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {order.images.length} img
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${order.totalPrice.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "dd MMM yy", { locale: es })}
                    </TableCell>
                    <TableCell className="pr-6">
                      <OrderDetailDialog order={order} statuses={statuses} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
