"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusData {
  name: string;
  count: number;
  colorHex: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name?: string; value?: number; payload?: StatusData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
      <p className="text-sm font-medium" style={{ color: d.payload?.colorHex }}>{d.name}</p>
      <p className="text-sm text-muted-foreground">
        {d.value} {d.value === 1 ? "orden" : "órdenes"}
      </p>
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value?: string; color?: string }> }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-2">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function OrdersByStatusChart({ data }: { data: StatusData[] }) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Creá tu primera orden para ver el gráfico
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="relative h-full w-full">
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginBottom: 32 }}>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground">órdenes</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="45%"
            outerRadius="78%"
            paddingAngle={3}
            dataKey="count"
            nameKey="name"
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.colorHex} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
