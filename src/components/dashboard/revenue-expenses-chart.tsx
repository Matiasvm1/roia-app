"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyData {
  month: string;
  ingresos: number;
  gastos: number;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; fill?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2.5 shadow-lg">
      <p className="text-sm font-medium mb-1.5 capitalize">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">${Number(entry.value ?? 0).toLocaleString("es-AR")}</span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value?: string; color?: string }> }) {
  return (
    <div className="flex justify-center gap-6 pt-2">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueExpensesChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0 || data.every((d) => d.ingresos === 0 && d.gastos === 0)) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Los datos aparecerán cuando registres órdenes y gastos
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickFormatter={formatCurrency}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)', opacity: 0.5 }} />
        <Legend content={<CustomLegend />} />
        <Bar
          dataKey="ingresos"
          fill="#10B981"
          name="Ingresos"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
        <Bar
          dataKey="gastos"
          fill="#F43F5E"
          name="Gastos"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
