import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Download,
  Calendar,
  UserPlus,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { mockAuditLogs, AuditLog, formatDateTime } from "@/lib/mockData";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  'create': UserPlus,
  'update': Edit,
  'delete': Trash2,
  'login': LogIn,
  'logout': LogOut,
  'approval': CheckCircle2,
};

const typeColors: Record<string, string> = {
  'create': 'bg-secondary/10 text-secondary',
  'update': 'bg-primary/10 text-primary',
  'delete': 'bg-destructive/10 text-destructive',
  'login': 'bg-accent/10 text-accent',
  'logout': 'bg-muted text-muted-foreground',
  'approval': 'bg-secondary/10 text-secondary',
};

const typeLabels: Record<string, string> = {
  'create': 'Creation',
  'update': 'Update',
  'delete': 'Deletion',
  'login': 'Login',
  'logout': 'Logout',
  'approval': 'Approval',
};

export default function AdminAudit() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    return matchesSearch && matchesType && matchesDate;
  });

  const handleExport = () => {
    toast.success("Exporting logs...");
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Audit Log
            </h1>
            <p className="text-muted-foreground">
              Complete system activity history
            </p>
          </div>
          
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = logs.filter(l => l.type === type).length;
            const Icon = typeIcons[type];
            return (
              <Card key={type} className="card-gov">
                <CardContent className="p-4 text-center">
                  <div className={`h-8 w-8 rounded-lg ${typeColors[type]} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="card-gov">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-9 w-44"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredLogs.length} entry(ies) found
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="hidden lg:table-cell">Details</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead className="hidden md:table-cell">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const Icon = typeIcons[log.type];
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={`${typeColors[log.type]} border-0 gap-1`}>
                          <Icon className="h-3 w-3" />
                          {typeLabels[log.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{log.target}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[300px]">
                        <span className="text-sm text-muted-foreground truncate block">
                          {log.details}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
