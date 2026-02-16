import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Download,
  FileText,
  Filter,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useState } from "react";
import { mockMissions, mockUsers, formatCurrency, formatDate } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function DepartmentReports() {
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('missions');

  // Mock data for charts
  const missionsPerEmployee = mockUsers
    .filter(u => u.role === 'employee')
    .slice(0, 6)
    .map(user => ({
      name: `${user.firstName[0]}. ${user.lastName}`,
      missions: Math.floor(Math.random() * 8) + 1,
      budget: Math.floor(Math.random() * 2000000) + 500000,
    }));

  const monthlyTrends = [
    { month: 'Jan', missions: 12, budget: 3500000, approved: 10 },
    { month: 'Fév', missions: 15, budget: 4200000, approved: 13 },
    { month: 'Mar', missions: 18, budget: 5100000, approved: 16 },
    { month: 'Avr', missions: 14, budget: 3800000, approved: 12 },
    { month: 'Mai', missions: 20, budget: 5500000, approved: 18 },
    { month: 'Juin', missions: 22, budget: 6200000, approved: 20 },
  ];

  const missionTypes = [
    { name: 'Inspection', value: 35, color: '#3b82f6' },
    { name: 'Formation', value: 25, color: '#10b981' },
    { name: 'Réunion', value: 20, color: '#f59e0b' },
    { name: 'Audit', value: 15, color: '#8b5cf6' },
    { name: 'Livraison', value: 5, color: '#ef4444' },
  ];

  const destinationStats = [
    { destination: 'Gitega', count: 18, budget: 4500000 },
    { destination: 'Ngozi', count: 15, budget: 3800000 },
    { destination: 'Bujumbura', count: 12, budget: 3200000 },
    { destination: 'Kayanza', count: 10, budget: 2500000 },
    { destination: 'Muyinga', count: 8, budget: 2000000 },
  ];

  // Recent missions for table
  const recentMissions = mockMissions.slice(0, 8);

  const handleExport = (format: string) => {
    // Mock export
    console.log(`Exporting report as ${format}`);
  };

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Rapports du Département
            </h1>
            <p className="text-muted-foreground">
              Analyse et statistiques des missions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette Semaine</SelectItem>
                  <SelectItem value="month">Ce Mois</SelectItem>
                  <SelectItem value="quarter">Ce Trimestre</SelectItem>
                  <SelectItem value="year">Cette Année</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type de rapport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="missions">Missions</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="employees">Employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-green-600">+12% vs période précédente</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Utilisé</p>
                  <p className="text-2xl font-bold">{formatCurrency(18500000)}</p>
                  <p className="text-xs text-muted-foreground">sur {formatCurrency(25000000)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Employés Actifs</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">sur 32 total</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux d'Approbation</p>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-green-600">+5% ce mois</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Missions per Employee */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Missions par Employé
              </CardTitle>
              <CardDescription>
                Répartition des missions entre les membres de l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={missionsPerEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'budget' ? formatCurrency(value) : value,
                      name === 'missions' ? 'Missions' : 'Budget'
                    ]}
                  />
                  <Bar dataKey="missions" fill="#3b82f6" name="missions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mission Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Types de Missions
              </CardTitle>
              <CardDescription>
                Distribution par catégorie de mission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={missionTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {missionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Mensuelles</CardTitle>
            <CardDescription>
              Évolution des missions et du budget sur les 6 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'budget' ? formatCurrency(value) : value,
                    name === 'missions' ? 'Total Missions' : 
                    name === 'approved' ? 'Approuvées' : 'Budget'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="missions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="missions"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="approved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Destination Stats & Recent Missions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* By Destination */}
          <Card>
            <CardHeader>
              <CardTitle>Missions par Destination</CardTitle>
              <CardDescription>
                Top 5 des destinations les plus fréquentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinationStats.map((dest, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dest.destination}</span>
                      <span className="text-muted-foreground">
                        {dest.count} missions • {formatCurrency(dest.budget)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(dest.count / 18) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Missions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Missions Récentes</CardTitle>
              <CardDescription>
                Dernières missions du département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mission</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMissions.map((mission) => (
                    <TableRow key={mission.id}>
                      <TableCell className="font-medium">
                        {mission.title.substring(0, 20)}...
                      </TableCell>
                      <TableCell>{mission.destination}</TableCell>
                      <TableCell>
                        <Badge variant={
                          mission.status === 'completed' ? 'default' :
                          mission.status === 'pending' ? 'secondary' :
                          mission.status === 'rejected' ? 'destructive' : 'outline'
                        }>
                          {mission.status === 'completed' ? 'Approuvée' :
                           mission.status === 'pending' ? 'En attente' :
                           mission.status === 'rejected' ? 'Refusée' : mission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(mission.budget)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
