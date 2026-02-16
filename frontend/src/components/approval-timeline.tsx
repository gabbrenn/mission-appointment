import { ApprovalStep } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Check, X, Clock, ChevronRight } from "lucide-react";

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
}

const stepIcons = {
  pending: Clock,
  approved: Check,
  rejected: X,
};

const stepStyles = {
  pending: {
    icon: 'bg-muted text-muted-foreground',
    line: 'bg-muted',
    text: 'text-muted-foreground',
  },
  approved: {
    icon: 'bg-status-approved text-status-approved-foreground',
    line: 'bg-status-approved',
    text: 'text-status-approved',
  },
  rejected: {
    icon: 'bg-status-rejected text-status-rejected-foreground',
    line: 'bg-status-rejected',
    text: 'text-status-rejected',
  },
};

export function ApprovalTimeline({ 
  steps, 
  className,
  orientation = 'horizontal',
  compact = false,
}: ApprovalTimelineProps) {
  if (orientation === 'vertical') {
    return (
      <div className={cn("space-y-0", className)}>
        {steps.map((step, index) => {
          const Icon = stepIcons[step.status];
          const styles = stepStyles[step.status];
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  styles.icon
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                {!isLast && (
                  <div className={cn(
                    "w-0.5 h-12 my-1",
                    styles.line
                  )} />
                )}
              </div>
              <div className="pt-1 pb-4">
                <p className={cn("font-medium text-sm", styles.text)}>
                  {step.role}
                </p>
                {step.approver && (
                  <p className="text-xs text-muted-foreground">
                    {step.approver}
                  </p>
                )}
                {step.date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(step.date).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {step.comment && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "{step.comment}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 flex-wrap", className)}>
        {steps.map((step, index) => {
          const Icon = stepIcons[step.status];
          const styles = stepStyles[step.status];
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center gap-1.5">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                styles.icon
              )}>
                <Icon className="h-3 w-3" />
              </div>
              <span className={cn(
                "text-xs font-medium",
                styles.text
              )}>
                {step.role}
              </span>
              {!isLast && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const Icon = stepIcons[step.status];
        const styles = stepStyles[step.status];
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                styles.icon
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-xs font-medium text-center max-w-[80px]",
                styles.text
              )}>
                {step.role}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                "flex-1 h-0.5 mx-2",
                step.status === 'approved' ? styles.line : 'bg-muted'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
