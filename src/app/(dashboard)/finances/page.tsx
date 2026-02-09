import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { RevenueExpensesChart } from "@/components/dashboard/revenue-expenses-chart";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { es } from "date-fns/locale";

async function getFinancesData() {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);

  const [monthlyOrders, monthlyExpenses, monthlyPurchases, allOrders, allExpenses, allPurchases] =
    await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { createdAt: { gte: startOfThisMonth, lte: endOfThisMonth } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfThisMonth, lte: endOfThisMonth } },
      }),
      prisma.purchase.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfThisMonth, lte: endOfThisMonth } },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: subMonths(startOfThisMonth, 5) } },
        select: { createdAt: true, totalPrice: true },
      }),
      prisma.expense.findMany({
        where: { date: { gte: subMonths(startOfThisMonth, 5) } },
        select: { date: true, amount: true },
      }),
      prisma.purchase.findMany({
        where: { date: { gte: subMonths(startOfThisMonth, 5) } },
        select: { date: true, amount: true },
      }),
    ]);

  const income = monthlyOrders._sum.totalPrice ?? 0;
  const expenses = (monthlyExpenses._sum.amount ?? 0) + (monthlyPurchases._sum.amount ?? 0);

  // Datos mensuales para el gráfico
  const months: { month: string; ingresos: number; gastos: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i);
    const mStart = startOfMonth(date);
    const mEnd = endOfMonth(date);
    const label = format(date, "MMM yy", { locale: es });

    const ing = allOrders
      .filter((o) => o.createdAt >= mStart && o.createdAt <= mEnd)
      .reduce((s, o) => s + (o.totalPrice ?? 0), 0);
    const gas =
      allExpenses.filter((e) => e.date >= mStart && e.date <= mEnd).reduce((s, e) => s + e.amount, 0) +
      allPurchases.filter((p) => p.date >= mStart && p.date <= mEnd).reduce((s, p) => s + p.amount, 0);

    months.push({ month: label, ingresos: ing, gastos: gas });
  }

  return { income, expenses, balance: income - expenses, chartData: months };
}

import { requireAdmin } from "@/lib/auth";

export default async function FinancesPage() {
  await requireAdmin();

  const data = await getFinancesData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
        <p className="text-muted-foreground mt-1">
          Resumen financiero: ingresos, gastos y balance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Ingresos del Mes</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              ${data.income.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total este mes</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Gastos del Mes</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              ${data.expenses.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Gastos + compras este mes</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Balance</p>
            <p className={`text-2xl font-bold mt-1 ${data.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ${data.balance.toLocaleString("es-AR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Ingresos - Gastos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolución Financiera</CardTitle>
          <CardDescription>Ingresos vs Gastos — Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent className="h-100">
          <RevenueExpensesChart data={data.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
