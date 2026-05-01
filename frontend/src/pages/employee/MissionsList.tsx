import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Calendar, Search, Filter, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { missionService } from "@/services/mission.service";
import { AssignmentResponseModal } from "@/components/AssignmentResponseModal";
import { useNotifications } from "@/hooks/use-notifications";

// Use interface from service
import { MissionAssignment } from '@/services/mission.service';

export default function MissionsList() {
  const navigate = useNavigate();
  const { addAppNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignments, setAssignments] = useState<MissionAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseModal, setResponseModal] = useState<{isOpen: boolean, assignment: MissionAssignment | null}>({isOpen: false, assignment: null});

  // Fetch user assignments on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await missionService.getUserAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => 
    (statusFilter === 'all' || assignment.assignmentStatus === statusFilter) &&
    (searchTerm === '' || 
     assignment.mission?.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     assignment.mission?.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleResponseClick = (assignment: MissionAssignment) => {
    setResponseModal({ isOpen: true, assignment });
  };

  const handleResponseSubmit = async (response: 'ACCEPTED' | 'DECLINED', notes?: string) => {
    if (!responseModal.assignment) return;
    
    await missionService.respondToAssignment(responseModal.assignment.id, response, notes);

    if (response === 'ACCEPTED') {
      addAppNotification({
        type: 'approval',
        title: 'Mission Accepted',
        message: `An employee accepted mission "${responseModal.assignment.mission?.title || 'N/A'}".`,
        actionUrl: responseModal.assignment.mission?.id ? `/employee/mission/${responseModal.assignment.mission.id}` : undefined,
        priority: 'medium',
      });
    }
    
    // Refresh assignments
    const data = await missionService.getUserAssignments();
    setAssignments(data);
  };

  const handleModalClose = () => {
    setResponseModal({ isOpen: false, assignment: null });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: 'Pending', variant: 'secondary' },
      ACCEPTED: { label: 'Accepted', variant: 'default' },
      DECLINED: { label: 'Declined', variant: 'destructive' },
      SUBSTITUTED: { label: 'Substituted', variant: 'outline' },
    };
    const statusInfo = variants[status] || variants.PENDING;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Missions</h1>
          <p className="text-muted-foreground">
            Complete view of all your assigned missions
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
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                  <SelectItem value="SUBSTITUTED">Substituted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Missions Grid */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">Loading missions...</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{assignment.mission?.title || 'N/A'}</CardTitle>
                    </div>
                    {getStatusBadge(assignment.assignmentStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{assignment.mission?.destination || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {assignment.mission?.startDate && assignment.mission?.endDate ? 
                        `${formatDate(assignment.mission.startDate)} - ${formatDate(assignment.mission.endDate)}` : 'N/A'
                      }
                    </span>
                  </div>
                  {assignment.assignmentReason && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {assignment.assignmentReason}
                    </div>
                  )}
                  <div className="space-y-2">
                    {assignment.assignmentStatus === 'PENDING' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleResponseClick(assignment)}
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Respond to Assignment
                      </Button>
                    )}                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/employee/mission/${assignment.mission?.id}`)}
                      disabled={!assignment.mission?.id}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredAssignments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No missions found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assignment Response Modal */}
      <AssignmentResponseModal
        isOpen={responseModal.isOpen}
        onClose={handleModalClose}
        onSubmit={handleResponseSubmit}
        assignmentId={responseModal.assignment?.id || ''}
        missionTitle={responseModal.assignment?.mission?.title || ''}
      />
    </DashboardLayout>
  );
}
