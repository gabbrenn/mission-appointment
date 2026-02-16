import { useState } from "react";
import { formatCurrency, cityCoordinates } from "@/lib/mockData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MissionCity {
  city: string;
  count: number;
  budget: number;
}

interface BurundiMapProps {
  missions: MissionCity[];
}

export function BurundiMap({ missions }: BurundiMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  
  // Calculate relative positions for cities on map (simplified)
  const getPosition = (city: string) => {
    const coords = cityCoordinates[city];
    if (!coords) return { x: 50, y: 50 };
    
    // Normalize to map dimensions (rough approximation for Burundi)
    // Burundi roughly spans: lat -2.3 to -4.5, lng 28.8 to 30.9
    const x = ((coords.lng - 28.8) / (30.9 - 28.8)) * 80 + 10;
    const y = ((coords.lat + 2.3) / (-4.5 + 2.3)) * 80 + 10;
    
    return { x, y };
  };

  const maxMissions = Math.max(...missions.map(m => m.count));

  return (
    <div className="relative h-[300px] bg-muted/30 rounded-lg overflow-hidden">
      {/* Simplified Burundi outline */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ minHeight: '280px' }}
      >
        {/* Simplified Burundi shape */}
        <path
          d="M30 15 L70 10 L85 30 L80 55 L75 75 L55 90 L35 85 L20 65 L15 40 Z"
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
        />
        
        {/* City markers */}
        {missions.map((mission) => {
          const pos = getPosition(mission.city);
          const size = 6 + (mission.count / maxMissions) * 10;
          const isHovered = hoveredCity === mission.city;
          
          return (
            <g key={mission.city}>
              {/* Pulse animation for active cities */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size + 4}
                fill="hsl(var(--primary))"
                opacity={0.2}
                className="animate-pulse"
              />
              {/* Main marker */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? size + 2 : size}
                    fill={isHovered ? "hsl(var(--secondary))" : "hsl(var(--primary))"}
                    stroke="white"
                    strokeWidth="1"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredCity(mission.city)}
                    onMouseLeave={() => setHoveredCity(null)}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="z-50">
                  <div className="text-center">
                    <p className="font-semibold">{mission.city}</p>
                    <p className="text-sm">{mission.count} mission(s)</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(mission.budget)}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
              {/* Mission count label */}
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white font-bold text-[4px] pointer-events-none"
              >
                {mission.count}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 border shadow-sm">
        <p className="text-xs font-medium mb-1">Missions par ville</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Faible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Moyen</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span>Élevé</span>
          </div>
        </div>
      </div>

      {/* City List */}
      <div className="absolute top-2 right-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 border shadow-sm max-h-[200px] overflow-y-auto">
        <p className="text-xs font-medium mb-2">Top Destinations</p>
        <div className="space-y-1">
          {missions.slice(0, 5).map((m) => (
            <div 
              key={m.city}
              className="flex items-center justify-between gap-3 text-xs"
              onMouseEnter={() => setHoveredCity(m.city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <span className={hoveredCity === m.city ? "text-primary font-medium" : ""}>
                {m.city}
              </span>
              <span className="text-muted-foreground">{m.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
