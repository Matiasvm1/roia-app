import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  name: string;
  colorHex: string;
}

export function StatusBadge({ name, colorHex }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{
        borderColor: colorHex,
        color: colorHex,
        backgroundColor: `${colorHex}15`,
      }}
    >
      {name}
    </Badge>
  );
}
