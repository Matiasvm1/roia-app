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
import { Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { EditClientDialog } from "@/components/clients/edit-client-dialog";
import { requireAdmin } from "@/lib/auth";

export default async function ClientsPage() {
  await requireAdmin();

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            {clients.length} clientes registrados.
          </p>
        </div>
        <CreateClientDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <p className="font-medium">No hay clientes registrados todavía</p>
              <p className="text-sm mt-1">
                Hacé click en &quot;Nuevo Cliente&quot; para agregar el primero.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                  <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
                  <TableHead className="text-center">Órdenes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-10 pr-6">Editar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className={!client.isActive ? "opacity-50" : ""}>
                    <TableCell className="font-medium pl-6">{client.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email ?? <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.phone ?? <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {client.city ?? <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">{client._count.orders}</TableCell>
                    <TableCell>
                      <Badge variant={client.isActive ? "default" : "secondary"}>
                        {client.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <EditClientDialog client={client} />
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
