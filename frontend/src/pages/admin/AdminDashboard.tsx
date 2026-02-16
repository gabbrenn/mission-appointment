import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Shield, 
  Settings, 
  FileText, 
  Activity,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { mockUsers, mockAuditLogs, formatDateTime, roleLabels } from "@/lib/mockData";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const inactiveUsers = mockUsers.filter(u => u.status !== 'active').length;
  
  const recentLogs = mockAuditLogs.slice(0, 5);
  
  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return <UserPlus className="h-4 w-4 text-secondary" />;
      case 'delete': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'approval': return <CheckCircle2 className="h-4 w-4 text-secondary" />;
      default: return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            System Administration
          </h1>
          <p className="text-muted-foreground">
            User, role, and configuration management
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Users"
            value={activeUsers}
            icon={Users}
            trend={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Inactive Users"
            value={inactiveUsers}
            icon={Users}
            variant="warning"
          />
          <StatsCard
            title="Defined Roles"
            value={Object.keys(roleLabels).length}
            icon={Shield}
          />
          <StatsCard
            title="Logs Today"
            value={mockAuditLogs.filter(l => 
              new Date(l.timestamp).toDateString() === new Date().toDateString()
            ).length || 3}
            icon={FileText}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users">
            <Card className="card-gov cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Users</h3>
                  <p className="text-sm text-muted-foreground">Manage accounts</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/roles">
            <Card className="card-gov cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Roles & Permissions</h3>
                  <p className="text-sm text-muted-foreground">Access control</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/config">
            <Card className="card-gov cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Configuration</h3>
                  <p className="text-sm text-muted-foreground">System settings</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/admin/audit">
            <Card className="card-gov cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold">Audit Log</h3>
                  <p className="text-sm text-muted-foreground">Activity history</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="card-gov">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link to="/admin/audit">
              <Button variant="outline" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                    {getLogTypeIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{log.action}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Par {log.user} • {log.ipAddress}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by Role */}
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="text-lg">Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(roleLabels).map(([role, label]) => {
                const count = mockUsers.filter(u => u.role === role).length;
                return (
                  <div key={role} className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-primary">{count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
