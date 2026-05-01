import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Calendar, Search, Filter, Eye, CheckCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { missionService, Mission } from "@/services/mission.service";
import { formatCurrency } from "@/lib/mockData";

export default function MissionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch missions on component mount
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await missionService.getAllMissions();
        setMissions(data);
      } catch (error) {
        console.error('Error fetching missions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Filter department missions
  const filteredMissions = missions.filter(m => 
    (statusFilter === 'all' || m.status === statusFilter) &&
    (searchTerm === '' || 
     m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
     m.missionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: 'Pending', variant: 'secondary' },
      ASSIGNED: { label: 'Assigned', variant: 'outline' },
      ACCEPTED: { label: 'Accepted', variant: 'default' },
      IN_PROGRESS: { label: 'In Progress', variant: 'default' },
      COMPLETED: { label: 'Completed', variant: 'outline' },
      REJECTED: { label: 'Rejected', variant: 'destructive' },
    };
    const statusInfo = variants[status] || variants.PENDING;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Department Missions</h1>
            <p className="text-muted-foreground">
              Manage all missions in your department
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Missions Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="text-muted-foreground">Loading missions...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMissions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 grid gap-2 sm:grid-cols-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{mission.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{mission.missionNumber}</p>
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
                          <p className="text-sm font-medium">{formatCurrency(Number(mission.estimatedBudget))}</p>
                          {getStatusBadge(mission.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {mission.status === 'PENDING_ASSIGNMENT' && (
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/department/approval/${mission.id}`)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
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
            )}
          </CardContent>
        </Card>

        {!loading && filteredMissions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No missions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
