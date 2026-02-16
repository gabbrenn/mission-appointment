import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { MissionCard } from "@/components/mission-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase, 
  Target, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { 
  mockMissions, 
  currentUser, 
  formatCurrency, 
  formatDate,
  missionTypes,
} from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  
  // Filter missions for current user
  const pendingMissions = mockMissions.filter(
    m => (m.status === 'pending' || m.status === 'assigned')
  );
  const activeMissions = mockMissions.filter(
    m => m.status === 'in_progress' || m.status === 'accepted'
  );
  const completedMissions = mockMissions.filter(
    m => m.status === 'completed'
  );

  const handleAccept = (mission: typeof mockMissions[0]) => {
    toast.success(`Mission "${mission.title}" accepted`, {
      description: "You will receive a confirmation email.",
    });
  };

  const handleDecline = (mission: typeof mockMissions[0]) => {
    toast.error(`Mission "${mission.title}" declined`, {
      description: "The system will search for another employee.",
    });
  };

  const handleSubstitute = (mission: typeof mockMissions[0]) => {
    navigate(`/employee/substitution/${mission.id}`);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome, Jean-Pierre"
      userRole="employee"
      userName={`${currentUser.firstName} ${currentUser.lastName}`}
      userEmail={currentUser.email}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Missions"
          value={currentUser.totalMissions}
          subtitle="This year"
          icon={Briefcase}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Fairness Score"
          value={`${currentUser.fairnessScore}%`}
          subtitle="Fair distribution"
          icon={Target}
          variant="primary"
        />
        <StatsCard
          title="Pending"
          value={pendingMissions.length}
          subtitle="Response required"
          icon={Clock}
        />
        <StatsCard
          title="Completed"
          value={completedMissions.length}
          subtitle="Reports submitted"
          icon={CheckCircle2}
          variant="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">New Assignments</h2>
            <StatusBadge 
              status="pending" 
              label={`${pendingMissions.length} pending`} 
            />
          </div>

          {pendingMissions.length > 0 ? (
            <div className="grid gap-4">
              {pendingMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  variant="full"
                  showActions
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onSubstitute={handleSubstitute}
                  onViewDetails={() => navigate(`/employee/mission/${mission.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="card-gov">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  No new missions
                </h3>
                <p className="text-sm text-muted-foreground">
                  You have no missions awaiting response.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Active Missions & Quick Stats */}
        <div className="space-y-6">
          {/* Active Mission */}
          {activeMissions.length > 0 && (
            <Card className="card-gov">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
                  Active Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeMissions[0] && (
                  <div className="space-y-3">
                    <p className="font-medium">{activeMissions[0].title}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📍 {activeMissions[0].destination}</p>
                      <p>📅 {formatDate(activeMissions[0].startDate)} - {formatDate(activeMissions[0].endDate)}</p>
                      <p>💰 {formatCurrency(activeMissions[0].budget)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => navigate(`/employee/mission/${activeMissions[0].id}`)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fairness Score */}
          <Card className="card-gov">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Fairness Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${currentUser.fairnessScore * 2.26} 226`}
                      className="text-secondary"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                    {currentUser.fairnessScore}%
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Your score indicates fair distribution of missions.
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-secondary text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    <span>+5% this month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-gov">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/employee/reports')}
              >
                📝 Submit a report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/employee/profile')}
              >
                👤 Update my profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/employee/missions')}
              >
                📋 View history
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent History */}
      <Card className="card-gov mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Mission History
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/employee/missions')}
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mission</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMissions.slice(0, 5).map((mission) => (
                <TableRow 
                  key={mission.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/employee/mission/${mission.id}`)}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-medium">{mission.title}</p>
                      <p className="text-xs text-muted-foreground">{mission.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{missionTypes[mission.type]}</TableCell>
                  <TableCell>{mission.destination}</TableCell>
                  <TableCell>{formatDate(mission.startDate)}</TableCell>
                  <TableCell>{formatCurrency(mission.budget)}</TableCell>
                  <TableCell>
                    <StatusBadge status={mission.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
