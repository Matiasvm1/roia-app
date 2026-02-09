import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreatePurchaseDialog } from "@/components/purchases/create-purchase-dialog";
import { EditPurchaseDialog } from "@/components/purchases/edit-purchase-dialog";
import { requireAdmin } from "@/lib/auth";

export default async function PurchasesPage() {
  await requireAdmin();

  const purchases = await prisma.purchase.findMany({
    orderBy: { date: "desc" },
  });

  const total = purchases.reduce((sum, p) => sum + p.amount, 0);

  // Serializar fechas para el componente cliente
  const serializedPurchases = purchases.map((p) => ({
    id: p.id,
    supplier: p.supplier,
    description: p.description,
    amount: p.amount,
    category: p.category,
    date: p.date.toISOString(),
    notes: p.notes,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
          <p className="text-muted-foreground mt-1">
            {purchases.length} compras · Total:{" "}
            <span className="font-semibold text-foreground">
              ${total.toLocaleString("es-AR")}
            </span>
          </p>
        </div>
        <CreatePurchaseDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          {purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Package className="h-8 w-8" />
              </div>
              <p className="font-medium">No hay compras registradas todavía</p>
              <p className="text-sm mt-1">
                Hacé click en &quot;Nueva Compra&quot; para agregar la primera.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Proveedor</TableHead>
                  <TableHead className="hidden md:table-cell">Descripción</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="w-10 pr-6">Editar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serializedPurchases.map((purchase, index) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium pl-6">{purchase.supplier}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-50 truncate">
                      {purchase.description}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {purchase.category ? (
                        <Badge variant="secondary">{purchase.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">
                      ${purchase.amount.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(purchase.date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="pr-6">
                      <EditPurchaseDialog purchase={purchase} />
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
