import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Calendar, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { mockMissions, formatDate } from "@/lib/mockData";

export default function MissionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter missions for current user (mock)
  const myMissions = mockMissions.filter(m => 
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
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes Missions</h1>
          <p className="text-muted-foreground">
            Vue complète de toutes vos missions assignées
          </p>
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
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="assigned">Assignée</SelectItem>
                  <SelectItem value="accepted">Acceptée</SelectItem>
                  <SelectItem value="in_progress">En Cours</SelectItem>
                  <SelectItem value="completed">Complétée</SelectItem>
                  <SelectItem value="rejected">Refusée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Missions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myMissions.map((mission) => (
            <Card key={mission.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/employee/mission/${mission.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                  </div>
                  {getStatusBadge(mission.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{mission.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
                </div>
                <Button variant="outline" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/employee/mission/${mission.id}`);
                }}>
                  Voir Détails
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {myMissions.length === 0 && (
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
