import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, MapPin, Briefcase, Users, DollarSign } from "lucide-react";
import { mockMissions, mockUsers, formatCurrency, cities } from "@/lib/mockData";

export default function MissionMap() {
  // Group missions by city
  const missionsByCity = mockMissions.reduce((acc, mission) => {
    if (!acc[mission.destination]) {
      acc[mission.destination] = [];
    }
    acc[mission.destination].push(mission);
    return acc;
  }, {} as Record<string, typeof mockMissions>);

  const activeMissions = mockMissions.filter(m => m.status === 'in_progress' || m.status === 'accepted');

  return (
    <DashboardLayout userRole="director">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mission Map</h1>
          <p className="text-muted-foreground">
            Geographic view of all active missions in Burundi
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Missions Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeMissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Villes Couvertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(missionsByCity).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Employés en Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockUsers.filter(u => !u.isAvailable).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Total Actif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(activeMissions.reduce((sum, m) => sum + m.budget, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder - Visual representation */}
        <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Map className="h-16 w-16 text-primary" />
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Carte interactive du Burundi avec localisation des missions
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {cities.map((city) => {
                const cityMissions = missionsByCity[city] || [];
                const activeCityMissions = cityMissions.filter(m => m.status === 'in_progress' || m.status === 'accepted');
                return (
                  <Card key={city} className="bg-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">{city}</CardTitle>
                        </div>
                        {activeCityMissions.length > 0 && (
                          <Badge variant="default">{activeCityMissions.length} active</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Total missions
                        </span>
                        <span className="font-medium">{cityMissions.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Employés
                        </span>
                        <span className="font-medium">{activeCityMissions.length}</span>
                      </div>
                      {cityMissions.length > 0 && (
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Budget
                          </span>
                          <span className="font-medium">
                            {formatCurrency(cityMissions.reduce((sum, m) => sum + m.budget, 0))}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Missions by Location */}
        <Card>
          <CardHeader>
            <CardTitle>Active Missions by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(missionsByCity).map(([city, missions]) => {
                const activeMissionsInCity = missions.filter(m => m.status === 'in_progress' || m.status === 'accepted');
                if (activeMissionsInCity.length === 0) return null;
                
                return (
                  <div key={city} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{city}</span>
                      </div>
                      <Badge>{activeMissionsInCity.length} mission(s)</Badge>
                    </div>
                    <div className="space-y-2">
                      {activeMissionsInCity.map(mission => (
                        <div key={mission.id} className="flex items-center justify-between text-sm pl-7">
                          <span className="text-muted-foreground">{mission.title}</span>
                          <Badge variant={mission.status === 'in_progress' ? 'default' : 'secondary'}>
                            {mission.status === 'in_progress' ? 'En Cours' : 'Acceptée'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
