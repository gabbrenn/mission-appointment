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
          <h1 className="text-3xl font-bold text-foreground">Pending Confirmations</h1>
          <p className="text-muted-foreground">
            Missions requiring HR confirmation
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingConfirmations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockUsers.filter(u => u.isAvailable).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Mission</CardTitle>
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
                                {employee.isAvailable ? 'Available' : 'On mission'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Fairness: {employee.fairnessScore}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-end">
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/hr/confirmation/${mission.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/hr/confirmation/${mission.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
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
              <p className="text-muted-foreground">No pending confirmations</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
