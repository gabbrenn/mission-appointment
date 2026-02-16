import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { MissionCard } from "@/components/mission-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock,
  Plus,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, mockMissions, mockUsers } from "@/lib/mockData";
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
  ResponsiveContainer,
} from "recharts";

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  // Department stats
  const teamMembers = mockUsers.filter(u => u.role === 'employee');
  const onMission = teamMembers.filter(u => !u.isAvailable).length;
  const available = teamMembers.filter(u => u.isAvailable).length;
  
  const departmentBudget = 25000000;
  const usedBudget = 18750000;
  const budgetPercentage = Math.round((usedBudget / departmentBudget) * 100);

  // Pending approvals
  const pendingApprovals = mockMissions.filter(
    m => m.approvalStatus.find(a => a.role === 'Chef' && a.status === 'pending')
  );

  // Substitution requests
  const substitutionRequests = [
    { 
      id: '1', 
      employee: 'J. Ndayishimiye', 
      mission: 'Inspection Gitega',
      reason: 'Raison de Santé',
      date: '2026-01-15',
    },
    { 
      id: '2', 
      employee: 'M. Nkurunziza', 
      mission: 'Formation Ngozi',
      reason: 'Conflit de Planning',
      date: '2026-01-18',
    },
  ];

  // Mission distribution
  const missionsByType = [
    { name: 'Inspection', value: 12, color: '#3b82f6' },
    { name: 'Formation', value: 8, color: '#10b981' },
    { name: 'Réunion', value: 6, color: '#f59e0b' },
    { name: 'Audit', value: 4, color: '#8b5cf6' },
    { name: 'Livraison', value: 5, color: '#ef4444' },
  ];

  // Monthly missions
  const monthlyMissions = [
    { month: 'Oct', count: 8 },
    { month: 'Nov', count: 12 },
    { month: 'Déc', count: 10 },
    { month: 'Jan', count: 15 },
  ];

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Tableau de Bord - Chef de Département
            </h1>
            <p className="text-muted-foreground">
              Gestion des missions et de l'équipe
            </p>
          </div>
          <Button onClick={() => navigate('/department/create-mission')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Mission
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Personnel en Mission"
            value={`${onMission}/${teamMembers.length}`}
            icon={Users}
            description={`${available} disponibles`}
          />
          <StatsCard
            title="Approbations en Attente"
            value={pendingApprovals.length.toString()}
            icon={Clock}
            description="À examiner"
          />
          <StatsCard
            title="Demandes de Remplacement"
            value={substitutionRequests.length.toString()}
            icon={RefreshCw}
            description="En attente"
            variant="warning"
          />
          <StatsCard
            title="Budget Utilisé"
            value={`${budgetPercentage}%`}
            icon={DollarSign}
            description={formatCurrency(usedBudget)}
            variant={budgetPercentage > 90 ? 'warning' : 'default'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Approvals */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/department/approvals')}
              >
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.slice(0, 4).map((mission) => (
                  <div 
                    key={mission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate(`/department/approvals/${mission.id}`)}
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{mission.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {mission.assignedTo ? 
                            `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 
                            'Not assigned'
                          }
                        </span>
                        <span>•</span>
                        <span>{mission.destination}</span>
                        <span>•</span>
                        <span>{formatDate(mission.startDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{formatCurrency(mission.budget)}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No pending approvals
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mission Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Mission Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={missionsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {missionsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {missionsByType.map((type, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span>{type.name}</span>
                    <span className="text-muted-foreground">({type.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Substitution Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Substitution Requests
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/department/substitutions')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {substitutionRequests.map((request) => (
                <div 
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/department/substitutions/${request.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">{request.employee}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.mission} • {request.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{formatDate(request.date)}</span>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team & Monthly Stats */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team Table */}
          <Card>
            <CardHeader>
              <CardTitle>My Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Missions</TableHead>
                    <TableHead>Fairness</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.slice(0, 6).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.isAvailable ? "default" : "secondary"}
                          className={member.isAvailable ? "bg-green-500" : "bg-orange-500"}
                        >
                          {member.isAvailable ? 'Available' : 'On Mission'}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.totalMissions}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.fairnessScore}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Monthly Missions Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Missions by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyMissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Missions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
