import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  FileText,
  UserCheck,
  UserX,
} from "lucide-react";
import { 
  formatDate,
  mockMissions,
} from "@/lib/mockData";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export default function HRConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  // Find pending HR confirmations
  const pendingMissions = mockMissions.filter(
    m => m.approvalStatus.find(a => a.role === 'HR' && a.status === 'pending')
  );

  const mission = id 
    ? mockMissions.find(m => m.id === id)
    : pendingMissions[0];

  if (!mission) {
    return (
      <DashboardLayout userRole="hr">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No confirmation found</p>
        </div>
      </DashboardLayout>
    );
  }

  const employee = mission.assignedTo;

  // Mock leave/conflict data
  const hasLeave = false;
  const hasConflict = !employee?.isAvailable;
  const leaveDetails = hasLeave ? {
    type: 'Annual Leave',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
  } : null;

  // Employee history
  const recentMissions = [
    { date: '2024-05-10', destination: 'Gitega', status: 'Completed' },
    { date: '2024-04-22', destination: 'Ngozi', status: 'Completed' },
    { date: '2024-03-15', destination: 'Bururi', status: 'Completed' },
  ];

  const handleConfirm = () => {
    if (hasConflict && !comment) {
      toast.error("Comment required", {
        description: "Please document the confirmation despite the conflict",
      });
      return;
    }
    toast.success("Availability confirmed", {
      description: `Agent confirmed for mission "${mission.title}"`,
    });
    navigate('/hr');
  };

  const handleReject = () => {
    if (!comment) {
      toast.error("Comment required", {
        description: "Please provide a reason for rejection",
      });
      return;
    }
    toast.error("Mission rejected", {
      description: "The agent cannot be confirmed for this mission",
    });
    navigate('/hr');
  };

  return (
    <DashboardLayout userRole="hr">
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Availability Confirmation
            </h1>
            <p className="text-muted-foreground">
              Agent availability verification and confirmation
            </p>
          </div>
          {pendingMissions.length > 1 && (
            <Badge variant="secondary">
              {pendingMissions.indexOf(mission) + 1} of {pendingMissions.length}
            </Badge>
          )}
        </div>

        {/* Status Overview */}
        {(hasLeave || hasConflict) && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-semibold text-orange-900 dark:text-orange-100">
                    Availability Conflict Detected
                  </p>
                  {hasLeave && leaveDetails && (
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      {leaveDetails.type} from {formatDate(leaveDetails.startDate)} to {formatDate(leaveDetails.endDate)}
                    </p>
                  )}
                  {hasConflict && (
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Agent currently marked as unavailable
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasLeave && !hasConflict && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    No Conflict Detected
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    The agent is available for this mission
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Title
                </p>
                <p className="font-medium">{mission.title}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge>{mission.type}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destination
                </p>
                <p className="font-medium">{mission.destination}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Period
                </p>
                <p className="font-medium">
                  {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration
                </p>
                <p className="font-medium">
                  {Math.ceil((new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{mission.department}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{mission.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {mission.requiredSkills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Profile */}
        {employee && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={employee.isAvailable ? "default" : "secondary"}>
                      {employee.isAvailable ? (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Unavailable
                        </>
                      )}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {employee.department}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">{employee.totalMissions}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fairness Score</p>
                  <p className="text-2xl font-bold">{employee.fairnessScore}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Mission</p>
                  <p className="text-sm font-medium">
                    {employee.lastMissionDate ? formatDate(employee.lastMissionDate) : 'None'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map(skill => {
                    const isRequired = mission.requiredSkills.includes(skill);
                    return (
                      <Badge 
                        key={skill} 
                        variant={isRequired ? "default" : "secondary"}
                        className={isRequired ? "bg-green-500" : ""}
                      >
                        {skill}
                        {isRequired && " ✓"}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Mission History */}
        {employee && (
          <Card>
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMissions.map((rm, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{rm.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(rm.date)}
                      </p>
                    </div>
                    <Badge variant="secondary">{rm.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leave Check */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Verification</CardTitle>
          </CardHeader>
          <CardContent>
            {hasLeave && leaveDetails ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                      {leaveDetails.type}
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      From {formatDate(leaveDetails.startDate)} to {formatDate(leaveDetails.endDate)}
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                      The mission conflicts with this planned leave
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    No Planned Leave
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    The agent has no planned leave during this period
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conflict Detection */}
        <Card>
          <CardHeader>
            <CardTitle>Conflict Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Calendar conflicts</span>
                </div>
                {hasLeave ? (
                  <Badge variant="destructive">Detected</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-500">None</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Agent availability</span>
                </div>
                {employee?.isAvailable ? (
                  <Badge variant="default" className="bg-green-500">Available</Badge>
                ) : (
                  <Badge variant="secondary">Unavailable</Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Required skills</span>
                </div>
                {mission.requiredSkills.every(skill => employee?.skills.includes(skill)) ? (
                  <Badge variant="default" className="bg-green-500">Match</Badge>
                ) : (
                  <Badge variant="secondary">Partial</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>HR Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={hasConflict ? "Comment required in case of conflict..." : "Add your observations (optional)..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/hr')}
          >
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleReject}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleConfirm}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>

        {/* Navigation to Next */}
        {pendingMissions.length > 1 && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const currentIndex = pendingMissions.indexOf(mission);
                const nextMission = pendingMissions[currentIndex + 1] || pendingMissions[0];
                navigate(`/hr/confirmations/${nextMission.id}`);
              }}
            >
              Next Confirmation →
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
