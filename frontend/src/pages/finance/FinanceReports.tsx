import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { 
  formatCurrency,
  departments,
  budgetByDepartment,
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
  Area,
  AreaChart,
} from "recharts";
import { useState } from "react";

export default function FinanceReports() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6months");

  // Budget utilization by month
  const monthlyUtilization = [
    { month: 'Jan', budget: 18500000, spent: 17200000, saved: 1300000 },
    { month: 'Feb', budget: 20000000, spent: 19500000, saved: 500000 },
    { month: 'Mar', budget: 22000000, spent: 21800000, saved: 200000 },
    { month: 'Apr', budget: 21500000, spent: 20100000, saved: 1400000 },
    { month: 'May', budget: 23000000, spent: 22400000, saved: 600000 },
    { month: 'Jun', budget: 24000000, spent: 23900000, saved: 100000 },
  ];

  // Cost analysis by mission type
  const costByType = [
    { type: 'Inspection', count: 45, total: 67500000, avg: 1500000 },
    { type: 'Training', count: 32, total: 96000000, avg: 3000000 },
    { type: 'Meeting', count: 28, total: 42000000, avg: 1500000 },
    { type: 'Audit', count: 18, total: 54000000, avg: 3000000 },
    { type: 'Delivery', count: 22, total: 33000000, avg: 1500000 },
  ];

  // Cost per employee (top spenders)
  const topSpenders = [
    { name: 'J. Ndayishimiye', missions: 12, total: 18000000 },
    { name: 'M. Nkurunziza', missions: 10, total: 15000000 },
    { name: 'A. Irakoze', missions: 11, total: 14500000 },
    { name: 'B. Hakizimana', missions: 9, total: 13500000 },
    { name: 'C. Ndikumana', missions: 8, total: 12000000 },
  ];

  // Department budget efficiency
  const deptEfficiency = budgetByDepartment.map(dept => ({
    ...dept,
    efficiency: Math.round((dept.used / dept.allocated) * 100),
    saved: dept.allocated - dept.used,
  }));

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Jan', missions: 28, cost: 17200000 },
    { month: 'Fév', missions: 32, cost: 19500000 },
    { month: 'Mar', missions: 35, cost: 21800000 },
    { month: 'Avr', missions: 30, cost: 20100000 },
    { month: 'Mai', missions: 38, cost: 22400000 },
    { month: 'Juin', missions: 40, cost: 23900000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExport = (format: string) => {
    alert(`Export to ${format.toUpperCase()}`);
  };

  return (
    <DashboardLayout userRole="finance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Financial Reports
            </h1>
            <p className="text-muted-foreground">
              Budget analysis and detailed reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 month</SelectItem>
                  <SelectItem value="3months">3 months</SelectItem>
                  <SelectItem value="6months">6 months</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
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
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(monthlyUtilization.reduce((sum, m) => sum + m.spent, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(monthlyUtilization.reduce((sum, m) => sum + m.saved, 0))}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Cost/Mission</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(1478000)}
                  </p>
                </div>
                <PieChartIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Missions</p>
                  <p className="text-2xl font-bold">145</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Utilization Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="budget" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Budget"
                />
                <Area 
                  type="monotone" 
                  dataKey="spent" 
                  stackId="2"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Spent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cost by Mission Type */}
          <Card>
            <CardHeader>
              <CardTitle>Cost by Mission Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Efficiency by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptEfficiency} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" width={80} />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="efficiency" fill="#10b981" name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* More Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend - Missions vs Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="missions" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Missions"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Cost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Spenders */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 - Expenses by Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSpenders} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="total" fill="#f59e0b" name="Total Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deptEfficiency.map((dept, index) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.department}</span>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(dept.used)} / {formatCurrency(dept.allocated)}
                      </span>
                      <span className="ml-2 font-semibold">
                        {dept.efficiency}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        dept.efficiency > 90 ? 'bg-orange-500' : 
                        dept.efficiency > 75 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${dept.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Mission Cost</p>
                <p className="text-3xl font-bold">{formatCurrency(124900000)}</p>
                <p className="text-sm text-green-600">↓ 8% compared to previous quarter</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Savings Achieved</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(4100000)}</p>
                <p className="text-sm text-muted-foreground">3.2% of total budget</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Cost/Mission</p>
                <p className="text-3xl font-bold">{formatCurrency(1478000)}</p>
                <p className="text-sm text-orange-600">↑ 5% compared to previous quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
