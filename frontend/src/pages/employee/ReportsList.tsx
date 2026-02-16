import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockMissions, formatDate, formatCurrency } from "@/lib/mockData";

export default function ReportsList() {
  const navigate = useNavigate();

  // Filter completed missions that need reports
  const completedMissions = mockMissions.filter(m => m.status === 'completed' || m.status === 'in_progress');

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Rapports</h1>
          <p className="text-muted-foreground">
            Submit and view your mission reports
          </p>
        </div>

        {/* Reports List */}
        <div className="grid gap-4">
          {completedMissions.map((mission) => (
            <Card key={mission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{mission.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mission.destination}
                      </p>
                    </div>
                  </div>
                  <Badge variant={mission.status === 'completed' ? 'default' : 'secondary'}>
                    {mission.status === 'completed' ? 'Complétée' : 'En Cours'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Budget: {formatCurrency(mission.budget)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {mission.status === 'in_progress' && (
                    <Button 
                      onClick={() => navigate(`/employee/report/${mission.id}`)}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Soumettre Rapport
                    </Button>
                  )}
                  {mission.status === 'completed' && (
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/employee/mission/${mission.id}`)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir Rapport
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {completedMissions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun rapport à soumettre pour le moment</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
