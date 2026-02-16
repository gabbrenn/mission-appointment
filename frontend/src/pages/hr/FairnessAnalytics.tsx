import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Download,
  Target,
  Award,
} from "lucide-react";
import { 
  mockUsers,
  departments,
} from "@/lib/mockData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { useState } from "react";

export default function FairnessAnalytics() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6months");

  const employees = mockUsers.filter(u => u.role === 'employee');

  // Fairness distribution
  const fairnessDistribution = [
    { range: '0-20%', count: 3, color: '#ef4444' },
    { range: '20-40%', count: 8, color: '#f59e0b' },
    { range: '40-60%', count: 15, color: '#eab308' },
    { range: '60-80%', count: 12, color: '#10b981' },
    { range: '80-100%', count: 7, color: '#3b82f6' },
  ];

  // Mission distribution by employee (with scatter data)
  const employeeData = employees.map(emp => ({
    name: `${emp.firstName[0]}. ${emp.lastName}`,
    missions: emp.totalMissions,
    fairness: emp.fairnessScore,
    department: emp.department,
  })).sort((a, b) => b.missions - a.missions);

  // Top and bottom performers
  const topPerformers = employeeData.slice(0, 5);
  const bottomPerformers = employeeData.slice(-5).reverse();

  // Department comparison
  const deptFairness = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const avgFairness = deptEmployees.reduce((sum, e) => sum + e.fairnessScore, 0) / deptEmployees.length;
    const avgMissions = deptEmployees.reduce((sum, e) => sum + e.totalMissions, 0) / deptEmployees.length;
    
    return {
      name: dept,
      fairness: Math.round(avgFairness),
      missions: Math.round(avgMissions),
      employees: deptEmployees.length,
    };
  });

  // Equity scores over time
  const equityTrend = [
    { month: 'Jan', avg: 62, min: 35, max: 95 },
    { month: 'Feb', avg: 64, min: 38, max: 93 },
    { month: 'Mar', avg: 67, min: 42, max: 94 },
    { month: 'Apr', avg: 69, min: 45, max: 95 },
    { month: 'May', avg: 71, min: 48, max: 96 },
    { month: 'Jun', avg: 73, min: 52, max: 97 },
  ];

  // Outlier identification
  const outliers = employees.filter(e => e.fairnessScore < 40 || e.fairnessScore > 95);

  // Distribution metrics
  const avgFairness = Math.round(
    employees.reduce((sum, e) => sum + e.fairnessScore, 0) / employees.length
  );
  const medianFairness = 72;
  const stdDeviation = 18;

  // Radar chart data for multi-dimensional analysis
  const radarData = [
    { metric: 'Missions', value: 75 },
    { metric: 'Fairness', value: avgFairness },
    { metric: 'Availability', value: 82 },
    { metric: 'Skills', value: 78 },
    { metric: 'Experience', value: 68 },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6'];

  const handleExport = () => {
    alert("Fairness report export");
  };

  return (
    <DashboardLayout userRole="hr">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Fairness Analytics
            </h1>
            <p className="text-muted-foreground">
              Distribution and analysis of fairness scores
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 mois</SelectItem>
                  <SelectItem value="3months">3 mois</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score Moyen</p>
                  <p className="text-3xl font-bold">{avgFairness}%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +5% ce mois
                  </p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Médiane</p>
                  <p className="text-3xl font-bold">{medianFairness}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Écart type: {stdDeviation}
                  </p>
                </div>
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Équilibrés (&gt;60%)</p>
                  <p className="text-3xl font-bold text-green-600">
                    {employees.filter(e => e.fairnessScore >= 60).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((employees.filter(e => e.fairnessScore >= 60).length / employees.length) * 100)}% du total
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Déséquilibrés (&lt;40%)</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {employees.filter(e => e.fairnessScore < 40).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nécessitent attention
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outliers Alert */}
        {outliers.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    {outliers.length} employé(s) identifié(s) comme valeurs aberrantes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {outliers.map(emp => (
                      <Badge 
                        key={emp.id} 
                        variant="secondary"
                        className="bg-orange-100 dark:bg-orange-900"
                      >
                        {emp.firstName} {emp.lastName} - {emp.fairnessScore}%
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-3">
                    Recommandation: Prioriser ces agents pour les prochaines missions ou enquêter sur les raisons du déséquilibre
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Fairness Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Scores d'Équité</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fairnessDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip labelStyle={{ color: '#000' }} />
                  <Bar dataKey="count" name="Employés">
                    {fairnessDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {fairnessDistribution.map(item => (
                  <div key={item.range} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.range}</span>
                    </div>
                    <span className="font-semibold">{item.count} employés</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Equity Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendance d'Équité</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={equityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip labelStyle={{ color: '#000' }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Moyenne"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="min" 
                    stroke="#ef4444" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="Minimum"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="max" 
                    stroke="#10b981" 
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    name="Maximum"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* More Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Department Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparaison par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptFairness} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip labelStyle={{ color: '#000' }} />
                  <Legend />
                  <Bar dataKey="fairness" fill="#3b82f6" name="Score d'Équité" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Multi-Dimensionnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar 
                    name="Performance Globale" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Mission vs Fairness Scatter */}
        <Card>
          <CardHeader>
            <CardTitle>Corrélation Missions vs Équité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="missions" 
                  name="Missions" 
                  label={{ value: 'Nombre de Missions', position: 'bottom' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="fairness" 
                  name="Équité" 
                  label={{ value: 'Score d\'Équité (%)', angle: -90, position: 'left' }}
                  domain={[0, 100]}
                />
                <ZAxis range={[100, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  labelStyle={{ color: '#000' }}
                />
                <Scatter 
                  name="Employés" 
                  data={employeeData} 
                  fill="#3b82f6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top & Bottom Performers */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Top 5 - Meilleurs Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((emp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 font-semibold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-500">
                          {emp.fairness}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {emp.missions} missions
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${emp.fairness}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Top 5 - Nécessitent Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottomPerformers.map((emp, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-300 font-semibold text-sm">
                          !
                        </div>
                        <div>
                          <p className="font-medium text-sm">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-orange-500 text-white">
                          {emp.fairness}%
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {emp.missions} missions
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${emp.fairness}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Score moyen en amélioration</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The average fairness score increased by 5% this month. Continue to prioritize employees with low scores.
                  </p>
                </div>
              </div>

              {outliers.length > 0 && (
                <div className="flex items-start gap-3 p-4 border rounded-lg bg-orange-50 dark:bg-orange-950 border-orange-200">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                      Action requise pour {outliers.length} employé(s)
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Prioriser ces agents pour les prochaines missions pour rééquilibrer la distribution.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Objectif: Score minimum de 60%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {employees.filter(e => e.fairnessScore < 60).length} employés sous l'objectif. 
                    Plan a redistribution of missions to reach the goal.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
