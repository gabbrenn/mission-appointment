import { formatCurrency } from "@/lib/mockData";

interface BudgetGaugeProps {
  used: number;
  total: number;
  label: string;
  color?: "primary" | "secondary" | "accent" | "destructive";
  suffix?: string;
}

export function BudgetGauge({ 
  used, 
  total, 
  label, 
  color = "primary",
  suffix = ""
}: BudgetGaugeProps) {
  const percentage = Math.round((used / total) * 100);
  const strokeDasharray = 283; // Circumference of circle with r=45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  
  const colorClasses = {
    primary: "stroke-primary",
    secondary: "stroke-secondary",
    accent: "stroke-accent",
    destructive: "stroke-destructive",
  };

  const getStatusColor = () => {
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 75) return "text-orange-500";
    return `text-${color}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className={colorClasses[color]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getStatusColor()}`}>
            {percentage}{suffix || "%"}
          </span>
          <span className="text-xs text-muted-foreground mt-1">used</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-medium">{label}</p>
        {!suffix && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(used)} / {formatCurrency(total)}
          </p>
        )}
        {suffix && (
          <p className="text-xs text-muted-foreground mt-1">
            {used} / {total}
          </p>
        )}
      </div>
    </div>
  );
}
