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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download,
  FileText,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Calendar,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { departments, formatCurrency, budgetByDepartment } from "@/lib/mockData";
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
  AreaChart,
  Area,
} from "recharts";

export default function DirectorAnalytics() {
  const [period, setPeriod] = useState('year');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Executive KPIs
  const kpis = {
    totalMissions: 234,
    missionGrowth: 15.2,
    totalBudget: 185000000,
    budgetUtilization: 74,
    avgApprovalTime: 3.2,
    approvalTimeChange: -0.8,
    employeeParticipation: 87,
    participationChange: 5.3,
    roi: 2.8,
  };

  // Department performance data
  const departmentPerformance = budgetByDepartment.map((dept, index) => ({
    ...dept,
    missions: 15 + Math.floor(Math.random() * 30),
    efficiency: 75 + Math.floor(Math.random() * 20),
    avgCost: Math.floor(dept.used / (10 + index)),
  }));

  // Monthly trends
  const monthlyData = [
    { month: 'Jan', missions: 18, budget: 14500000, approved: 16, efficiency: 88 },
    { month: 'Feb', missions: 22, budget: 16800000, approved: 20, efficiency: 91 },
    { month: 'Mar', missions: 25, budget: 18200000, approved: 23, efficiency: 92 },
    { month: 'Apr', missions: 20, budget: 15500000, approved: 18, efficiency: 90 },
    { month: 'May', missions: 28, budget: 21000000, approved: 26, efficiency: 93 },
    { month: 'Jun', missions: 32, budget: 24500000, approved: 30, efficiency: 94 },
    { month: 'Jul', missions: 30, budget: 23000000, approved: 28, efficiency: 93 },
    { month: 'Aug', missions: 26, budget: 19500000, approved: 24, efficiency: 92 },
    { month: 'Sep', missions: 33, budget: 25200000, approved: 31, efficiency: 94 },
    { month: 'Oct', missions: 0, budget: 0, approved: 0, efficiency: 0 },
    { month: 'Nov', missions: 0, budget: 0, approved: 0, efficiency: 0 },
    { month: 'Dec', missions: 0, budget: 0, approved: 0, efficiency: 0 },
  ];

  // Mission types distribution
  const missionTypes = [
    { name: 'Inspection', value: 85, color: '#3b82f6' },
    { name: 'Training', value: 62, color: '#10b981' },
    { name: 'Meeting', value: 48, color: '#f59e0b' },
    { name: 'Audit', value: 28, color: '#8b5cf6' },
    { name: 'Special Delivery', value: 11, color: '#ef4444' },
  ];

  // ROI by category
  const roiData = [
    { category: 'Training', investment: 45000000, returns: 135000000, roi: 3.0 },
    { category: 'Inspection', investment: 65000000, returns: 175000000, roi: 2.7 },
    { category: 'Audit', investment: 25000000, returns: 80000000, roi: 3.2 },
    { category: 'Meeting', investment: 35000000, returns: 70000000, roi: 2.0 },
  ];

  // Regional distribution
  const regionalData = [
    { region: 'Gitega', missions: 42, budget: 35000000 },
    { region: 'Bujumbura', missions: 38, budget: 32000000 },
    { region: 'Ngozi', missions: 35, budget: 28000000 },
    { region: 'Kayanza', missions: 28, budget: 22000000 },
    { region: 'Muyinga', missions: 25, budget: 20000000 },
    { region: 'Others', missions: 66, budget: 48000000 },
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <DashboardLayout userRole="director">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Executive view of RNP performance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('powerpoint')}>
              <FileText className="h-4 w-4 mr-2" />
              PowerPoint
            </Button>
            <Button variant="outline" onClick={() => handleExport('print')}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="lastyear">Previous Year</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Executive KPIs */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">{kpis.totalMissions}</p>
                  <p className={`text-xs flex items-center gap-1 ${kpis.missionGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpis.missionGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpis.missionGrowth > 0 ? '+' : ''}{kpis.missionGrowth}%
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpis.totalBudget)}</p>
                  <p className="text-xs text-muted-foreground">{kpis.budgetUtilization}% of total</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Time</p>
                  <p className="text-2xl font-bold">{kpis.avgApprovalTime}d</p>
                  <p className={`text-xs flex items-center gap-1 ${kpis.approvalTimeChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpis.approvalTimeChange < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {kpis.approvalTimeChange}d
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participation</p>
                  <p className="text-2xl font-bold">{kpis.employeeParticipation}%</p>
                  <p className={`text-xs flex items-center gap-1 text-green-600`}>
                    <TrendingUp className="h-3 w-3" />
                    +{kpis.participationChange}%
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average ROI</p>
                  <p className="text-2xl font-bold text-green-600">{kpis.roi}x</p>
                  <p className="text-xs text-green-600">Return on Investment</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="custom">Custom Report</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Mission Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Evolution of missions and budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData.filter(m => m.missions > 0)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'budget' ? formatCurrency(value) : value,
                          name === 'missions' ? 'Missions' : 
                          name === 'approved' ? 'Approved' : 'Budget'
                        ]}
                      />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="missions" 
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        name="missions"
                      />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="approved" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.3}
                        name="approved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Mission Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Distribution by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={missionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
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

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Missions by province</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'budget' ? formatCurrency(value) : value,
                        name === 'missions' ? 'Missions' : 'Budget'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="missions" fill="#3b82f6" name="missions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            {/* Department Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Performance by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-center">Missions</TableHead>
                      <TableHead className="text-right">Allocated Budget</TableHead>
                      <TableHead className="text-right">Used Budget</TableHead>
                      <TableHead className="text-center">Utilization</TableHead>
                      <TableHead className="text-center">Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentPerformance.map((dept, index) => {
                      const utilization = Math.round((dept.used / dept.allocated) * 100);
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dept.department}</TableCell>
                          <TableCell className="text-center">{dept.missions}</TableCell>
                          <TableCell className="text-right">{formatCurrency(dept.allocated)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(dept.used)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={utilization > 90 ? 'destructive' : utilization > 70 ? 'secondary' : 'default'}>
                              {utilization}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={dept.efficiency >= 90 ? 'bg-green-500' : dept.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'}>
                              {dept.efficiency}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Department Budget Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget/Utilization Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="allocated" fill="#94a3b8" name="Allocated" />
                    <Bar dataKey="used" fill="#3b82f6" name="Used" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            {/* ROI Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              {roiData.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-4">{item.category}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Investment</span>
                        <span>{formatCurrency(item.investment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Returns</span>
                        <span className="text-green-600">{formatCurrency(item.returns)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">ROI</span>
                        <Badge className="bg-green-500 text-lg">{item.roi}x</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ROI Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Return on Investment Analysis</CardTitle>
                <CardDescription>Comparison of investment vs returns by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="investment" fill="#94a3b8" name="Investment" />
                    <Bar dataKey="returns" fill="#10b981" name="Returns" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>
                  Create custom reports according to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Metrics</label>
                    <Select defaultValue="missions">
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missions">Number of Missions</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="efficiency">Efficiency</SelectItem>
                        <SelectItem value="roi">ROI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group by</label>
                    <Select defaultValue="department">
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="type">Mission Type</SelectItem>
                        <SelectItem value="region">Region</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select defaultValue="chart">
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chart">Chart</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
