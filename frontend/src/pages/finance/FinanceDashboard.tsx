import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { 
  formatCurrency, 
  mockMissions,
  budgetByDepartment,
} from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
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
} from "recharts";

export default function FinanceDashboard() {
  const navigate = useNavigate();

  // Finance stats
  const totalBudget = 250000000; // 250M BIF
  const usedBudget = 187500000; // 187.5M BIF
  const budgetPercentage = Math.round((usedBudget / totalBudget) * 100);

  const pendingApprovals = mockMissions.filter(
    m => m.approvalStatus.find(a => a.role === 'Finance' && a.status === 'pending')
  );

  const pendingReimbursements = 12;
  const totalVariance = 3250000; // 3.25M BIF variance

  // Budget utilization by month
  const monthlyBudget = [
    { month: 'Jan', budget: 18500000, spent: 17200000 },
    { month: 'Feb', budget: 20000000, spent: 19500000 },
    { month: 'Mar', budget: 22000000, spent: 21800000 },
    { month: 'Apr', budget: 21500000, spent: 20100000 },
    { month: 'May', budget: 23000000, spent: 22400000 },
    { month: 'Jun', budget: 24000000, spent: 23900000 },
  ];

  // Department budget distribution
  const deptBudgetData = budgetByDepartment.map(dept => ({
    ...dept,
    percentage: Math.round((dept.used / dept.allocated) * 100),
  }));

  // Expense categories
  const expenseCategories = [
    { name: 'Transport', value: 45000000, color: '#3b82f6' },
    { name: 'Accommodation', value: 38000000, color: '#10b981' },
    { name: 'Per Diem', value: 52000000, color: '#f59e0b' },
    { name: 'Fuel', value: 32500000, color: '#ef4444' },
    { name: 'Other', value: 20000000, color: '#8b5cf6' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <DashboardLayout userRole="finance">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Finance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Budget management and financial approvals
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Budget Total"
            value={formatCurrency(totalBudget)}
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
            description="Annual allocated budget"
          />
          <StatsCard
            title="Budget Used"
            value={`${budgetPercentage}%`}
            icon={TrendingUp}
            trend={{ value: budgetPercentage, isPositive: budgetPercentage < 85 }}
            description={formatCurrency(usedBudget)}
            variant={budgetPercentage > 90 ? 'warning' : 'default'}
          />
          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals.length.toString()}
            icon={Clock}
            description="Budgets to approve"
          />
          <StatsCard
            title="Pending Reimbursements"
            value={pendingReimbursements.toString()}
            icon={AlertCircle}
            description={`Variance: ${formatCurrency(totalVariance)}`}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Budget Utilization Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyBudget}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Allocated Budget"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Spent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Budget Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Budget by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptBudgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="allocated" fill="#3b82f6" name="Budget" />
                <Bar dataKey="used" fill="#10b981" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Approvals Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Budget Approvals</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/finance/approvals')}
            >
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.slice(0, 5).map((mission) => (
                <div 
                  key={mission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => navigate(`/finance/approvals/${mission.id}`)}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{mission.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{mission.department}</span>
                      <span>•</span>
                      <span>{mission.destination}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-lg">
                      {formatCurrency(mission.budget)}
                    </p>
                    <StatusBadge status="pending" />
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
