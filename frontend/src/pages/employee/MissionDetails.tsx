import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ApprovalTimeline } from "@/components/approval-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  FileText,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Building,
  Target,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, mockMissions } from "@/lib/mockData";

export default function MissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find mission by ID or use first mission as fallback
  const mission = mockMissions.find(m => m.id === id) || mockMissions[0];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'accepted': return 'bg-green-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'inspection': return 'Inspection';
      case 'formation': return 'Training';
      case 'reunion': return 'Meeting';
      case 'audit': return 'Audit';
      case 'livraison': return 'Delivery';
      default: return type;
    }
  };

  // Mock documents
  const documents = [
    { name: 'Mission Order.pdf', size: '245 KB', type: 'pdf' },
    { name: 'Itinerary.docx', size: '128 KB', type: 'doc' },
    { name: 'Detailed Budget.xlsx', size: '89 KB', type: 'excel' },
  ];

  const canRespond = mission.status === 'assigned' || mission.status === 'pending';

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/employee')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {mission.title}
              </h1>
              <p className="text-muted-foreground">
                Mission #{mission.id} • {getTypeLabel(mission.type)}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(mission.status)} text-white`}>
            {getStatusLabel(mission.status)}
          </Badge>
        </div>

        {/* Action Buttons - if can respond */}
        {canRespond && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">New Assignment</h3>
                  <p className="text-sm text-muted-foreground">
                    Please respond to this mission before {formatDate(mission.startDate)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => navigate(`/employee/mission/${mission.id}/decline`)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/employee/mission/${mission.id}/substitution`)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Substitution
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Info */}
            <Card>
              <CardHeader>
                <CardTitle>Mission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{mission.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{mission.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dates</p>
                      <p className="font-medium">
                        {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {Math.ceil((new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {mission.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {mission.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalTimeline steps={mission.approvalStatus} />
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(mission.budget)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transport</span>
                    <span>{formatCurrency(mission.budget * 0.3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accommodation</span>
                    <span>{formatCurrency(mission.budget * 0.25)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Diem</span>
                    <span>{formatCurrency(mission.budget * 0.35)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Other</span>
                    <span>{formatCurrency(mission.budget * 0.1)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Budget Code: {mission.budgetCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Employee */}
            {mission.assignedTo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assigned Employee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {mission.assignedTo.firstName[0]}{mission.assignedTo.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {mission.assignedTo.firstName} {mission.assignedTo.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mission.assignedTo.department}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fairness Score</span>
                      <Badge variant="outline">{mission.assignedTo.fairnessScore}%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Missions</span>
                      <span>{mission.assignedTo.totalMissions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mission.status === 'completed' && (
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/employee/mission/${mission.id}/report`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Mission Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
