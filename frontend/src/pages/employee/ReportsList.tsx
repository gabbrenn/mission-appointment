import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MapPin, Eye, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { missionService, MissionAssignment } from "@/services/mission.service";
import { formatDate, formatCurrency } from "@/lib/mockData";

export default function ReportsList() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<MissionAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    missionService
      .getUserAssignments()
      .then((data) => setAssignments(data))
      .catch((err) => console.error("Failed to load assignments", err))
      .finally(() => setLoading(false));
  }, []);

  // Only show assignments for missions that are in progress or completed
  const relevantAssignments = assignments.filter((a) =>
    ["IN_PROGRESS", "COMPLETED"].includes(a.mission?.status ?? "")
  );

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground">
            Submit and view your mission reports
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Reports List */}
        {!loading && (
          <div className="grid gap-4">
            {relevantAssignments.map((assignment) => {
              const mission = assignment.mission;
              if (!mission) return null;
              const isCompleted = mission.status === "COMPLETED";
              return (
                <Card key={assignment.id}>
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
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        {isCompleted ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(mission.startDate)} -{" "}
                          {formatDate(mission.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          Budget: {formatCurrency(Number(mission.estimatedBudget))}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!isCompleted && (
                        <Button
                          onClick={() =>
                            navigate(`/employee/report/${mission.id}`, {
                              state: { mission },
                            })
                          }
                          className="flex-1"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Submit Report
                        </Button>
                      )}
                      {isCompleted && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            navigate(`/employee/mission/${mission.id}`)
                          }
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && relevantAssignments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No reports to submit at this time
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
