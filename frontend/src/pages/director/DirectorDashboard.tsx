import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { 
  executiveKPIs, 
  formatCurrency, 
  budgetByDepartment,
  missionsByCity,
} from "@/lib/mockData";
import { BudgetGauge } from "@/components/director/budget-gauge";
import { BurundiMap } from "@/components/director/burundi-map";
import { DirectorApprovals } from "@/components/director/director-approvals";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DirectorDashboard() {
  const budgetPercentage = Math.round((executiveKPIs.usedBudget / executiveKPIs.totalBudget) * 100);
  const completionRate = Math.round((executiveKPIs.missionsCompleted / executiveKPIs.missionsThisMonth) * 100);

  return (
    <DashboardLayout userRole="director">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Executive Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of operations and approvals
          </p>
        </div>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Budget"
            value={formatCurrency(executiveKPIs.totalBudget)}
            icon={DollarSign}
            description={`${budgetPercentage}% used`}
          />
          <StatsCard
            title="Missions This Month"
            value={executiveKPIs.missionsThisMonth}
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Pending Approvals"
            value={executiveKPIs.pendingApprovals}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Employees on Mission"
            value={executiveKPIs.employeesOnMission}
            icon={Users}
          />
        </div>

        {/* Budget Gauges & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetGauge 
                used={executiveKPIs.usedBudget} 
                total={executiveKPIs.totalBudget}
                label="Annual Budget"
              />
            </CardContent>
          </Card>

          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetGauge 
                used={executiveKPIs.missionsCompleted} 
                total={executiveKPIs.missionsThisMonth}
                label="Completed Missions"
                color="secondary"
              />
            </CardContent>
          </Card>

          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetGauge 
                used={executiveKPIs.costEfficiency} 
                total={100}
                label="Score d'Efficacité"
                color="accent"
                suffix="%"
              />
            </CardContent>
          </Card>
        </div>

        {/* Map and Budget by Department */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burundi Mission Map */}
          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Carte des Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BurundiMap missions={missionsByCity} />
            </CardContent>
          </Card>

          {/* Budget by Department */}
          <Card className="card-gov">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget par Département
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetByDepartment}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                    <YAxis 
                      type="category" 
                      dataKey="department" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Département: ${label}`}
                    />
                    <Bar dataKey="allocated" name="Alloué" fill="hsl(var(--primary))" opacity={0.3} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="used" name="Used" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                      {budgetByDepartment.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={entry.used / entry.allocated > 0.9 
                            ? "hsl(var(--destructive))" 
                            : "hsl(var(--primary))"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Approvals */}
        <DirectorApprovals />
      </div>
    </DashboardLayout>
  );
}
