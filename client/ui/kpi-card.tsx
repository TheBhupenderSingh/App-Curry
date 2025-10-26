import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  format?: "currency" | "percentage" | "number";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({
  title,
  value,
  previousValue,
  format = "number",
  trend,
  trendValue,
  icon,
  className,
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === "string" ? parseFloat(val) : val;
    
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(numVal);
      case "percentage":
        return `${numVal}%`;
      default:
        return new Intl.NumberFormat("en-US").format(numVal);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-dashboard-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-dashboard-danger" />;
      case "neutral":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-dashboard-success";
      case "down":
        return "text-dashboard-danger";
      case "neutral":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {(trend || trendValue) && (
          <div className="flex items-center space-x-1 text-xs mt-1">
            {getTrendIcon()}
            {trendValue && (
              <span className={getTrendColor()}>{trendValue}</span>
            )}
            {previousValue && (
              <span className="text-muted-foreground">
                from {formatValue(previousValue)}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
