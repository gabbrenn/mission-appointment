import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Database,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Trash2,
  Settings,
  HardDrive,
  Server,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminMaintenance() {
  const [isClearing, setIsClearing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // System status
  const systemStatus = {
    database: 'healthy',
    cache: 'healthy',
    storage: 'warning',
    api: 'healthy',
    lastBackup: '2026-01-20 03:00:00',
    uptime: '45 days, 12 hours',
    cacheSize: '256 MB',
    dbSize: '2.4 GB',
    storageUsed: 78,
  };

  // Scheduled jobs
  const [scheduledJobs] = useState([
    { id: '1', name: 'Automatic backup', schedule: 'Daily at 03:00', status: 'active', lastRun: '2026-01-20 03:00', nextRun: '2026-01-21 03:00' },
    { id: '2', name: 'Cache cleanup', schedule: 'Weekly', status: 'active', lastRun: '2026-01-15 02:00', nextRun: '2026-01-22 02:00' },
    { id: '3', name: 'Performance report', schedule: 'Monthly', status: 'active', lastRun: '2026-01-01 00:00', nextRun: '2026-02-01 00:00' },
    { id: '4', name: 'Mission archiving', schedule: 'Quarterly', status: 'paused', lastRun: '2025-10-01 00:00', nextRun: '-' },
    { id: '5', name: 'Integrity check', schedule: 'Daily at 04:00', status: 'active', lastRun: '2026-01-20 04:00', nextRun: '2026-01-21 04:00' },
  ]);

  // Error logs
  const [errorLogs] = useState([
    { id: '1', timestamp: '2026-01-20 14:32:15', level: 'error', message: 'Failed to connect to secondary database', source: 'DatabaseService' },
    { id: '2', timestamp: '2026-01-20 12:15:42', level: 'warning', message: 'High latency detected on API', source: 'ApiGateway' },
    { id: '3', timestamp: '2026-01-20 10:08:33', level: 'error', message: 'Timeout sending notification', source: 'NotificationService' },
    { id: '4', timestamp: '2026-01-19 23:45:12', level: 'warning', message: 'Low disk space (22% remaining)', source: 'StorageMonitor' },
    { id: '5', timestamp: '2026-01-19 18:22:05', level: 'info', message: 'Scheduled maintenance completed successfully', source: 'MaintenanceJob' },
  ]);

  const handleClearCache = async () => {
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Cache cleared successfully");
    setIsClearing(false);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success("Backup created successfully");
    setIsBackingUp(false);
  };

  const handleToggleJob = (jobId: string) => {
    toast.success("Task status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warning': return <Badge className="bg-amber-500">Warning</Badge>;
      case 'info': return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            System Maintenance
          </h1>
          <p className="text-muted-foreground">
            Database, cache and scheduled tasks management
          </p>
        </div>

        {/* System Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(systemStatus.database)}`} />
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">{systemStatus.dbSize}</p>
                  </div>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(systemStatus.cache)}`} />
                  <div>
                    <p className="font-medium">Cache</p>
                    <p className="text-sm text-muted-foreground">{systemStatus.cacheSize}</p>
                  </div>
                </div>
                <RefreshCw className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(systemStatus.storage)}`} />
                  <div>
                    <p className="font-medium">Storage</p>
                    <p className="text-sm text-muted-foreground">{systemStatus.storageUsed}% used</p>
                  </div>
                </div>
                <HardDrive className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(systemStatus.api)}`} />
                  <div>
                    <p className="font-medium">API</p>
                    <p className="text-sm text-muted-foreground">Uptime: {systemStatus.uptime}</p>
                  </div>
                </div>
                <Server className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="jobs">Scheduled Tasks</TabsTrigger>
            <TabsTrigger value="logs">Error Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Database Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database
                  </CardTitle>
                  <CardDescription>
                    Database maintenance operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Last Backup</p>
                      <p className="text-sm text-muted-foreground">{systemStatus.lastBackup}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={handleBackup}
                      disabled={isBackingUp}
                    >
                      {isBackingUp ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Backup in progress...
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 mr-2" />
                          Create Backup
                        </>
                      )}
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Activity className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Check Integrity
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cache Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Cache Management
                  </CardTitle>
                  <CardDescription>
                    System cache control and cleanup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Cache Size</p>
                      <p className="text-sm text-muted-foreground">{systemStatus.cacheSize}</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={handleClearCache}
                      disabled={isClearing}
                    >
                      {isClearing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Cleaning in progress...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Cache
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Automatic Cache</p>
                        <p className="text-sm text-muted-foreground">Clean weekly</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Storage
                  </CardTitle>
                  <CardDescription>
                    Disk space usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{systemStatus.storageUsed}%</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${systemStatus.storageUsed > 80 ? 'bg-red-500' : systemStatus.storageUsed > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${systemStatus.storageUsed}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      78 GB used out of 100 GB
                    </p>
                  </div>

                  {systemStatus.storageUsed > 70 && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-700">Low space</p>
                        <p className="text-amber-600">Consider archiving old data.</p>
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Temporary Files
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    System Diagnostic
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Maintenance Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheduled Tasks</CardTitle>
                    <CardDescription>Automatic job management</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.name}</TableCell>
                        <TableCell>{job.schedule}</TableCell>
                        <TableCell>{job.lastRun}</TableCell>
                        <TableCell>{job.nextRun}</TableCell>
                        <TableCell>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleJob(job.id)}
                            >
                              {job.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Error Logs</CardTitle>
                    <CardDescription>Recent system events</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{getLevelBadge(log.level)}</TableCell>
                        <TableCell className="text-muted-foreground">{log.source}</TableCell>
                        <TableCell>{log.message}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
