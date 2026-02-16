import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Calendar, Search, Filter, Eye, CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockMissions, formatDate, formatCurrency } from "@/lib/mockData";

export default function MissionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter department missions
  const departmentMissions = mockMissions.filter(m => 
    (statusFilter === 'all' || m.status === statusFilter) &&
    (searchTerm === '' || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: 'En Attente', variant: 'secondary' },
      assigned: { label: 'Assignée', variant: 'outline' },
      accepted: { label: 'Acceptée', variant: 'default' },
      in_progress: { label: 'En Cours', variant: 'default' },
      completed: { label: 'Complétée', variant: 'outline' },
      rejected: { label: 'Refusée', variant: 'destructive' },
    };
    const statusInfo = variants[status] || variants.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Missions du Département</h1>
            <p className="text-muted-foreground">
              Gérez toutes les missions de votre département
            </p>
          </div>
          <Button onClick={() => navigate('/department/create-mission')}>
            <Plus className="h-4 w-4 mr-2" />
            New Mission
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Missions Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {departmentMissions.map((mission) => (
                <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 grid gap-2 sm:grid-cols-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{mission.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{mission.id}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{mission.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(mission.startDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(mission.budget)}</p>
                        {getStatusBadge(mission.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {mission.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => navigate(`/department/approval/${mission.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/department/approval/${mission.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {departmentMissions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune mission trouvée</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
