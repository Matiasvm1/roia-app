import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  Package,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";
import { OrdersByStatusChart } from "@/components/dashboard/orders-by-status-chart";
import { RevenueExpensesChart } from "@/components/dashboard/revenue-expenses-chart";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

async function getDashboardData() {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);

  // Queries en paralelo para velocidad
  const [
    activeOrdersCount,
    clientsCount,
    articlesCount,
    monthlyOrders,
    monthlyExpenses,
    monthlyPurchases,
    statusesWithOrders,
    last6MonthsOrders,
    last6MonthsExpenses,
    last6MonthsPurchases,
  ] = await Promise.all([
    // Órdenes activas (no finalizadas ni canceladas ni entregadas)
    prisma.order.count({
      where: {
        status: {
          name: { notIn: ["Finalizado", "Entregado", "Cancelado"] },
        },
      },
    }),
    // Total clientes
    prisma.client.count({ where: { isActive: true } }),
    // Total artículos
    prisma.article.count({ where: { isActive: true } }),
    // Órdenes del mes (ingresos)
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: {
        createdAt: { gte: startOfThisMonth, lte: endOfThisMonth },
      },
    }),
    // Gastos del mes
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: startOfThisMonth, lte: endOfThisMonth },
      },
    }),
    // Compras del mes
    prisma.purchase.aggregate({
      _sum: { amount: true },
      where: {
        date: { gte: startOfThisMonth, lte: endOfThisMonth },
      },
    }),
    // Estados con conteo de órdenes
    prisma.productionStatus.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      include: { _count: { select: { orders: true } } },
    }),
    // Últimos 6 meses - órdenes
    prisma.order.findMany({
      where: { createdAt: { gte: subMonths(startOfThisMonth, 5) } },
      select: { createdAt: true, totalPrice: true },
    }),
    // Últimos 6 meses - gastos
    prisma.expense.findMany({
      where: { date: { gte: subMonths(startOfThisMonth, 5) } },
      select: { date: true, amount: true },
    }),
    // Últimos 6 meses - compras
    prisma.purchase.findMany({
      where: { date: { gte: subMonths(startOfThisMonth, 5) } },
      select: { date: true, amount: true },
    }),
  ]);

  const monthlyIncome = monthlyOrders._sum.totalPrice ?? 0;
  const monthlyExpenseTotal =
    (monthlyExpenses._sum.amount ?? 0) + (monthlyPurchases._sum.amount ?? 0);

  // Preparar datos para gráfico de barras (últimos 6 meses)
  const months: { month: string; ingresos: number; gastos: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const label = format(date, "MMM yy", { locale: es });

    const ingresos = last6MonthsOrders
      .filter((o) => o.createdAt >= monthStart && o.createdAt <= monthEnd)
      .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

    const gastos =
      last6MonthsExpenses
        .filter((e) => e.date >= monthStart && e.date <= monthEnd)
        .reduce((sum, e) => sum + e.amount, 0) +
      last6MonthsPurchases
        .filter((p) => p.date >= monthStart && p.date <= monthEnd)
        .reduce((sum, p) => sum + p.amount, 0);

    months.push({ month: label, ingresos, gastos });
  }

  // Datos para gráfico de torta (órdenes por estado)
  const statusChartData = statusesWithOrders.map((s) => ({
    name: s.name,
    count: s._count.orders,
    colorHex: s.colorHex,
  }));

  return {
    activeOrdersCount,
    clientsCount,
    articlesCount,
    monthlyIncome,
    monthlyExpenseTotal,
    statusChartData,
    monthlyChartData: months,
  };
}

export default async function DashboardPage() {
  await requireAdmin();

  const data = await getDashboardData();

  const stats = [
    {
      title: "Órdenes Activas",
      value: data.activeOrdersCount.toString(),
      description: "En producción",
      icon: ClipboardList,
      color: "text-blue-600",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      title: "Clientes",
      value: data.clientsCount.toString(),
      description: "Total registrados",
      icon: Users,
      color: "text-violet-600",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      title: "Artículos",
      value: data.articlesCount.toString(),
      description: "En catálogo",
      icon: ShoppingBag,
      color: "text-amber-600",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "Ingresos del Mes",
      value: `$${data.monthlyIncome.toLocaleString("es-AR")}`,
      description: "Facturado",
      icon: DollarSign,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Gastos del Mes",
      value: `$${data.monthlyExpenseTotal.toLocaleString("es-AR")}`,
      description: "Gastos + compras",
      icon: TrendingDown,
      color: "text-rose-600",
      iconBg: "bg-rose-100 text-rose-600",
    },
    {
      title: "Balance",
      value: `$${(data.monthlyIncome - data.monthlyExpenseTotal).toLocaleString("es-AR")}`,
      description: "Ingresos - Gastos",
      icon: Package,
      color:
        data.monthlyIncome - data.monthlyExpenseTotal >= 0
          ? "text-emerald-600"
          : "text-rose-600",
      iconBg:
        data.monthlyIncome - data.monthlyExpenseTotal >= 0
          ? "bg-emerald-100 text-emerald-600"
          : "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen general de tu negocio textil.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                  <p className={cn("text-2xl font-bold tracking-tight", stat.color)}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={cn("rounded-xl p-2.5 shrink-0", stat.iconBg)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ingresos vs Gastos</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <RevenueExpensesChart data={data.monthlyChartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Órdenes por Estado</CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <OrdersByStatusChart data={data.statusChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
