import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Calendar, MapPin, User, DollarSign, CheckCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockMissions, mockUsers, formatDate, formatCurrency } from "@/lib/mockData";

export default function ApprovalsList() {
  const navigate = useNavigate();

  // Filter missions needing director approval (approved by all other stages)
  const pendingApprovals = mockMissions.filter(m => m.status === 'accepted' || m.status === 'in_progress');

  return (
    <DashboardLayout userRole="director">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Final Approvals</h1>
          <p className="text-muted-foreground">
            Missions requiring your final approval
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Missions Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {mockMissions.filter(m => m.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Complétées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockMissions.filter(m => m.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approvals List */}
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
                        <Badge variant="outline" className="mt-1 text-xs">
                          {mission.department}
                        </Badge>
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
                        {employee && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{employee.firstName} {employee.lastName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-foreground">{formatCurrency(mission.budget)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Badge variant={mission.status === 'in_progress' ? 'default' : 'secondary'}>
                        {mission.status === 'in_progress' ? 'In Progress' : 'Accepted'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/director/approval/${mission.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/director/approval/${mission.id}`)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Details
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
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune approbation en attente</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
