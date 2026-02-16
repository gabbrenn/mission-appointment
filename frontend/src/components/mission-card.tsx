import { Mission, formatCurrency, formatDate, missionTypes } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Wallet,
  ChevronRight,
  Check,
  X,
  UserMinus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
  variant?: 'compact' | 'full';
  showActions?: boolean;
  onAccept?: (mission: Mission) => void;
  onDecline?: (mission: Mission) => void;
  onSubstitute?: (mission: Mission) => void;
  onViewDetails?: (mission: Mission) => void;
  className?: string;
}

export function MissionCard({
  mission,
  variant = 'compact',
  showActions = false,
  onAccept,
  onDecline,
  onSubstitute,
  onViewDetails,
  className,
}: MissionCardProps) {
  const isPending = mission.status === 'pending' || mission.status === 'assigned';

  return (
    <Card className={cn("card-gov overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {mission.id}
              </span>
              <StatusBadge status={mission.status} />
            </div>
            <h3 className="font-semibold text-base leading-tight line-clamp-2">
              {mission.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{mission.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {formatDate(mission.startDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-4 w-4 shrink-0" />
            <span className="truncate">{missionTypes[mission.type]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium text-foreground">
              {formatCurrency(mission.budget)}
            </span>
          </div>
        </div>

        {variant === 'full' && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mission.description}
          </p>
        )}

        {variant === 'full' && mission.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mission.requiredSkills.map((skill) => (
              <span 
                key={skill}
                className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex gap-2">
        {showActions && isPending ? (
          <>
            <Button 
              size="sm" 
              className="flex-1 btn-gov-primary"
              onClick={() => onAccept?.(mission)}
            >
              <Check className="h-4 w-4 mr-1" />
              Accepter
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => onSubstitute?.(mission)}
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Substitution
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDecline?.(mission)}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between text-primary hover:text-primary"
            onClick={() => onViewDetails?.(mission)}
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
