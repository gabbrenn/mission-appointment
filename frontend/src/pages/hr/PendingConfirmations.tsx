import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Calendar, MapPin, User, CheckCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockMissions, mockUsers, formatDate } from "@/lib/mockData";

export default function PendingConfirmations() {
  const navigate = useNavigate();

  // Filter missions needing HR confirmation
  const pendingConfirmations = mockMissions.filter(m => m.status === 'assigned' || m.status === 'pending');

  return (
    <DashboardLayout userRole="hr">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Confirmations en Attente</h1>
          <p className="text-muted-foreground">
            Missions nécessitant une confirmation RH
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingConfirmations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Employés Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.isAvailable).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {mockUsers.filter(u => !u.isAvailable).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmations List */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {pendingConfirmations.map((mission) => {
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
                        {employee && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{employee.firstName} {employee.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant={employee.isAvailable ? "default" : "secondary"} className="text-xs">
                                {employee.isAvailable ? 'Disponible' : 'En mission'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Équité: {employee.fairnessScore}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-end">
                        <Badge variant="secondary">En Attente</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/hr/confirmation/${mission.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmer
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/hr/confirmation/${mission.id}`)}
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

        {pendingConfirmations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune confirmation en attente</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
