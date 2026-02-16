import { cn } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Loader2, 
  CheckCheck 
} from "lucide-react";

type StatusVariant = 'pending' | 'approved' | 'rejected' | 'active' | 'assigned' | 'completed' | 'in_progress' | 'accepted';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<StatusVariant, { 
  label: string; 
  className: string; 
  icon: React.ElementType;
}> = {
  pending: {
    label: 'En attente',
    className: 'bg-status-pending/15 text-status-pending-foreground border border-status-pending/30',
    icon: Clock,
  },
  approved: {
    label: 'Approuvée',
    className: 'bg-status-approved/15 text-status-approved border border-status-approved/30',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejetée',
    className: 'bg-status-rejected/15 text-status-rejected border border-status-rejected/30',
    icon: XCircle,
  },
  active: {
    label: 'Active',
    className: 'bg-status-active/15 text-status-active border border-status-active/30',
    icon: Loader2,
  },
  assigned: {
    label: 'Assignée',
    className: 'bg-primary/15 text-primary border border-primary/30',
    icon: UserCheck,
  },
  completed: {
    label: 'Terminée',
    className: 'bg-secondary/15 text-secondary border border-secondary/30',
    icon: CheckCheck,
  },
  in_progress: {
    label: 'En cours',
    className: 'bg-status-active/15 text-status-active border border-status-active/30',
    icon: Loader2,
  },
  accepted: {
    label: 'Acceptée',
    className: 'bg-status-approved/15 text-status-approved border border-status-approved/30',
    icon: CheckCircle2,
  },
};

export function StatusBadge({ 
  status, 
  label, 
  className,
  showIcon = true 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span 
      className={cn(
        "status-badge",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      <span>{label || config.label}</span>
    </span>
  );
}
