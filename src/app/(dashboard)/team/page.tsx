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
import { UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { CreateUserDialog } from "@/components/team/create-user-dialog";
import { EditUserDialog } from "@/components/team/edit-user-dialog";
import { ResetPasswordDialog } from "@/components/team/reset-password-dialog";

export default async function TeamPage() {
  await requireAdmin();

  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipo</h1>
          <p className="text-muted-foreground mt-1">
            Gestioná los usuarios y sus permisos.
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total usuarios
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <UsersRound className="h-4.5 w-4.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter((p) => p.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empleados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter((p) => p.role === "employee").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <UsersRound className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                No hay usuarios registrados
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Creá el primer usuario para empezar.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.fullName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      @{profile.username}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          profile.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {profile.role === "admin" ? "Admin" : "Empleado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={profile.isActive ? "outline" : "destructive"}
                      >
                        {profile.isActive ? "Activo" : "Desactivado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditUserDialog
                          profile={{
                            id: profile.id,
                            fullName: profile.fullName,
                            role: profile.role,
                            isActive: profile.isActive,
                          }}
                        />
                        <ResetPasswordDialog
                          authUserId={profile.authUserId}
                          userName={profile.fullName}
                        />
                      </div>
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
