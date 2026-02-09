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
import { Receipt } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreateExpenseDialog } from "@/components/expenses/create-expense-dialog";
import { EditExpenseDialog } from "@/components/expenses/edit-expense-dialog";
import { requireAdmin } from "@/lib/auth";

export default async function ExpensesPage() {
  await requireAdmin();

  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Serializar fechas para el componente cliente
  const serializedExpenses = expenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    category: e.category,
    date: e.date.toISOString(),
    notes: e.notes,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gastos</h1>
          <p className="text-muted-foreground mt-1">
            {expenses.length} gastos · Total:{" "}
            <span className="font-semibold text-foreground">
              ${total.toLocaleString("es-AR")}
            </span>
          </p>
        </div>
        <CreateExpenseDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Receipt className="h-8 w-8" />
              </div>
              <p className="font-medium">No hay gastos registrados todavía</p>
              <p className="text-sm mt-1">
                Hacé click en &quot;Nuevo Gasto&quot; para agregar el primero.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Descripción</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="w-10 pr-6">Editar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serializedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium pl-6">{expense.description}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {expense.category ? (
                        <Badge variant="secondary">{expense.category}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-rose-600">
                      ${expense.amount.toLocaleString("es-AR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(expense.date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="pr-6">
                      <EditExpenseDialog expense={expense} />
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
