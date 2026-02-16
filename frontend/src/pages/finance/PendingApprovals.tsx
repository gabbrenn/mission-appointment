import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, MapPin, User, CheckCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockMissions, mockUsers, formatDate, formatCurrency } from "@/lib/mockData";

export default function PendingApprovals() {
  const navigate = useNavigate();

  // Filter pending missions for finance approval
  const pendingApprovals = mockMissions.filter(m => m.status === 'pending' || m.status === 'assigned');

  return (
    <DashboardLayout userRole="finance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Approbations en Attente</h1>
          <p className="text-muted-foreground">
            Missions nécessitant une validation budgétaire
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(pendingApprovals.reduce((sum, m) => sum + m.budget, 0))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(pendingApprovals.length > 0 ? pendingApprovals.reduce((sum, m) => sum + m.budget, 0) / pendingApprovals.length : 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending List */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pendingApprovals.map((mission) => {
                const employee = mockUsers.find(u => u.id === (typeof mission.assignedTo === 'string' ? mission.assignedTo : mission.assignedTo?.id));
                return (
                  <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 grid gap-3 sm:grid-cols-4">
                      <div>
                        <p className="font-semibold mb-1">{mission.title}</p>
                        <p className="text-xs text-muted-foreground">{mission.id}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{mission.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(mission.startDate)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{employee ? `${employee.firstName} ${employee.lastName}` : 'Non assigné'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-foreground">{formatCurrency(mission.budget)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Badge variant="secondary">En Attente</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/finance/approval/${mission.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/finance/approval/${mission.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {pendingApprovals.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune approbation en attente</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
