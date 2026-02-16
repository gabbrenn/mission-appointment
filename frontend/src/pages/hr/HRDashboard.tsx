import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  Calendar as CalendarIcon,
} from "lucide-react";
import { 
  formatDate,
  mockMissions,
  mockUsers,
} from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // HR stats
  const totalEmployees = mockUsers.filter(u => u.role === 'employee').length;
  const availableEmployees = mockUsers.filter(u => u.role === 'employee' && u.isAvailable).length;
  const onMission = mockUsers.filter(u => u.role === 'employee' && !u.isAvailable).length;

  const pendingConfirmations = mockMissions.filter(
    m => m.approvalStatus.find(a => a.role === 'HR' && a.status === 'pending')
  );

  // Fairness distribution data
  const fairnessDistribution = [
    { range: '0-20%', count: 3, color: '#ef4444' },
    { range: '20-40%', count: 8, color: '#f59e0b' },
    { range: '40-60%', count: 15, color: '#eab308' },
    { range: '60-80%', count: 12, color: '#10b981' },
    { range: '80-100%', count: 7, color: '#3b82f6' },
  ];

  // Mission distribution by employee
  const missionsByEmployee = [
    { name: 'J. Ndayishimiye', missions: 12, fairness: 85 },
    { name: 'M. Nkurunziza', missions: 10, fairness: 78 },
    { name: 'A. Irakoze', missions: 11, fairness: 82 },
    { name: 'B. Hakizimana', missions: 9, fairness: 72 },
    { name: 'C. Ndikumana', missions: 8, fairness: 68 },
    { name: 'D. Bizimana', missions: 5, fairness: 45 },
    { name: 'E. Ntirampeba', missions: 3, fairness: 32 },
  ];

  // Availability status
  const availabilityData = [
    { status: 'Available', count: availableEmployees, color: '#10b981' },
    { status: 'On Mission', count: onMission, color: '#f59e0b' },
    { status: 'Leave', count: 5, color: '#3b82f6' },
    { status: 'Unavailable', count: 3, color: '#ef4444' },
  ];

  // Calendar events (missions)
  const missionDates = mockMissions
    .filter(m => m.status === 'in_progress' || m.status === 'accepted')
    .map(m => new Date(m.startDate));

  return (
    <DashboardLayout userRole="hr">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            HR Dashboard
          </h1>
          <p className="text-muted-foreground">
            Human resources and availability management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={totalEmployees.toString()}
            icon={Users}
            description="Active agents"
          />
          <StatsCard
            title="Available"
            value={availableEmployees.toString()}
            icon={UserCheck}
            description={`${Math.round((availableEmployees / totalEmployees) * 100)}% availability`}
            variant="default"
          />
          <StatsCard
            title="On Mission"
            value={onMission.toString()}
            icon={Clock}
            description="Currently deployed"
            variant="warning"
          />
          <StatsCard
            title="Pending Confirmations"
            value={pendingConfirmations.length.toString()}
            icon={AlertCircle}
            description="To process"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Availability Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Availability Calendar</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/hr/availability')}
                >
                  Full View
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Today's Missions</h3>
                    <div className="space-y-2">
                      {mockMissions
                        .filter(m => 
                          new Date(m.startDate).toDateString() === (date || new Date()).toDateString()
                        )
                        .slice(0, 5)
                        .map(mission => (
                          <div 
                            key={mission.id}
                            className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          >
                            <p className="font-medium text-sm">{mission.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {mission.assignedTo ? 
                                `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 
                                'Unassigned'
                              }
                            </p>
                          </div>
                        ))}
                      {mockMissions.filter(m => 
                        new Date(m.startDate).toDateString() === (date || new Date()).toDateString()
                      ).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No missions today
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span>On Mission</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Leave</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Status */}
          <Card>
            <CardHeader>
              <CardTitle>Availability Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={availabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {availabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {availabilityData.map(item => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.status}</span>
                    </div>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fairness Monitor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fairness Monitor</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/hr/fairness')}
              >
                Detailed Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Fairness Distribution */}
              <div>
                <h3 className="font-semibold mb-4">Fairness Score Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fairnessDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip labelStyle={{ color: '#000' }} />
                    <Bar dataKey="count" name="Employees">
                      {fairnessDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mission Distribution */}
              <div>
                <h3 className="font-semibold mb-4">Mission Distribution</h3>
                <div className="space-y-3">
                  {missionsByEmployee.slice(0, 7).map((employee, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{employee.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {employee.missions} missions
                          </span>
                          <Badge 
                            variant={employee.fairness >= 70 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {employee.fairness}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            employee.fairness >= 70 ? 'bg-green-500' : 
                            employee.fairness >= 50 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${employee.fairness}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outliers Alert */}
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-100">
                    3 employees with low fairness score (&lt; 40%)
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Consider prioritizing these agents for upcoming missions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Confirmations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Confirmations</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/hr/confirmations')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingConfirmations.slice(0, 5).map((mission) => (
                <div 
                  key={mission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/hr/confirmations/${mission.id}`)}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{mission.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {mission.assignedTo ? 
                          `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 
                          'Unassigned'
                        }
                      </span>
                      <span>•</span>
                      <span>{mission.destination}</span>
                      <span>•</span>
                      <span>{formatDate(mission.startDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {mission.assignedTo?.isAvailable ? (
                      <Badge variant="default" className="bg-green-500">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-500 text-white">
                        <UserX className="h-3 w-3 mr-1" />
                        Busy
                      </Badge>
                    )}
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
