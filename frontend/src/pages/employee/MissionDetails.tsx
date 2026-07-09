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
  Receipt,
  ExternalLink,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { missionService, Mission, MissionAssignment } from "@/services/mission.service";
import { formatCurrency } from "@/lib/mockData";
import { useNotifications } from "@/hooks/use-notifications";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function MissionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addAppNotification } = useNotifications();
  const [mission, setMission] = useState<Mission | null>(null);
  const [assignment, setAssignment] = useState<MissionAssignment | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDownloadingLetter, setIsDownloadingLetter] = useState(false);

  const fetchMissionDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [missionData, assignmentData, reportData] = await Promise.all([
        missionService.getMissionById(id),
        missionService.getUserAssignmentByMission(id).catch(() => null),
        missionService.getMissionReport(id).catch(() => null),
      ]);

      const derivedAssignment =
        assignmentData ||
        missionData.assignments.find((item) => item.employee.id === user?.id) ||
        null;

      setMission(missionData);
      setAssignment(derivedAssignment);
      setReport(reportData);
    } catch (error) {
      console.error('Error fetching mission details:', error);
      navigate('/employee');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, user?.id]);

  useEffect(() => {
    fetchMissionDetails();
  }, [fetchMissionDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleResponse = async (response: 'ACCEPTED' | 'DECLINED') => {
    if (!assignment) return;

    try {
      await missionService.respondToAssignment(assignment.id, response);

      if (response === 'ACCEPTED') {
        addAppNotification({
          type: 'approval',
          title: 'Mission Accepted',
          message: `An employee accepted mission "${mission?.title || 'N/A'}".`,
          actionUrl: id ? `/employee/mission/${id}` : undefined,
          priority: 'medium',
        });
      }

      // Refresh assignment data
      const updatedAssignment = await missionService.getUserAssignmentByMission(id!);
      setAssignment(updatedAssignment);
    } catch (error) {
      console.error('Error responding to assignment:', error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!mission || !assignment) return;

    try {
      setIsCompleting(true);
      await missionService.markMissionCompleted(mission.id);
      toast.success('Mission marked as completed');
      await fetchMissionDetails();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast.error('Failed to mark mission as completed');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDownloadLetter = async () => {
    if (!mission) return;
    
    try {
      setIsDownloadingLetter(true);
      await missionService.downloadMissionLetter(mission.id);
      toast.success('Mission letter downloaded successfully');
    } catch (error) {
      console.error('Error downloading mission letter:', error);
      toast.error('Failed to download mission letter');
    } finally {
      setIsDownloadingLetter(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="employee">
        <div className="flex justify-center p-8">
          <div className="text-muted-foreground">Loading mission details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!mission) {
    return (
      <DashboardLayout userRole="employee">
        <div className="flex justify-center p-8">
          <div className="text-muted-foreground">Mission not found</div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'ASSIGNED': return 'bg-blue-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-purple-500';
      case 'COMPLETED': return 'bg-gray-500';
      case 'DECLINED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ASSIGNED': return 'Assigned';
      case 'ACCEPTED': return 'Accepted';
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'DECLINED': return 'Declined';
      default: return status;
    }
  };

  const getUrgencyLabel = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'HIGH': return 'High Priority';
      case 'MEDIUM': return 'Medium Priority';
      case 'LOW': return 'Low Priority';
      default: return urgencyLevel;
    }
  };

  // Mock documents
  const documents = [
    { name: 'Mission Order.pdf', size: '245 KB', type: 'pdf' },
    { name: 'Itinerary.docx', size: '128 KB', type: 'doc' },
    { name: 'Detailed Budget.xlsx', size: '89 KB', type: 'excel' },
  ];

  const canRespond = assignment && assignment.assignmentStatus === 'PENDING';
  const canMarkCompleted =
    !!assignment &&
    assignment.assignmentStatus === 'ACCEPTED' &&
    !['COMPLETED', 'REJECTED', 'CANCELLED'].includes(mission.status);

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
                Mission #{mission.missionNumber}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(assignment?.assignmentStatus || mission.status)} text-white`}>
            {getStatusLabel(assignment?.assignmentStatus || mission.status)}
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
                  {/* <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleResponse('DECLINED')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </Button> */}
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/employee/substitution/${assignment?.id}`, { state: { mission } })}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Request Substitution
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleResponse('ACCEPTED')}
                  >
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
                      <p className="font-medium">{mission.department.name}</p>
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
                  <h4 className="font-semibold mb-2">Urgency Level</h4>
                  <Badge variant={mission.urgencyLevel === 'HIGH' ? 'destructive' : mission.urgencyLevel === 'MEDIUM' ? 'default' : 'secondary'}>
                    {getUrgencyLabel(mission.urgencyLevel)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Status */}
            {assignment && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status:</span>
                      <Badge className={`${getStatusColor(assignment.assignmentStatus)} text-white`}>
                        {getStatusLabel(assignment.assignmentStatus)}
                      </Badge>
                    </div>
                    {assignment.assignedAt && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Assigned At:</span>
                        <span className="text-muted-foreground">
                          {formatDate(assignment.assignedAt)}
                        </span>
                      </div>
                    )}
                    {assignment.respondedAt && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Responded At:</span>
                        <span className="text-muted-foreground">
                          {formatDate(assignment.respondedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report section */}
            {report && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Submitted Report
                    <Badge variant="secondary" className="ml-auto">{report.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Activity Report</h4>
                    <p className="whitespace-pre-wrap text-sm">{report.activityReport}</p>
                  </div>
                  {report.expenses && report.expenses.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Receipt className="h-4 w-4" />
                          Expenses
                        </h4>
                        <div className="space-y-2">
                          {report.expenses.map((exp: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                              <div className="flex-1">
                                <span className="font-medium">{exp.category}</span>
                                <span className="text-muted-foreground ml-2">— {exp.description}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">{formatCurrency(Number(exp.amount))}</span>
                                {exp.receiptFilePath && (
                                  <a
                                    href={`http://localhost:3000${exp.receiptFilePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Receipt
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
                          <span>Total Expenses</span>
                          <span>{formatCurrency(report.expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0))}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {report.additionalDocuments && report.additionalDocuments.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                          Supporting Documents
                        </h4>
                        <div className="space-y-2">
                          {report.additionalDocuments.map((docPath: string, i: number) => {
                            const filename = docPath.substring(docPath.lastIndexOf('/') + 1);
                            return (
                              <div key={i} className="flex items-center justify-between p-2.5 border rounded-lg text-sm bg-accent/10">
                                <span className="font-medium truncate max-w-[250px]" title={filename}>{filename}</span>
                                <a
                                  href={`http://localhost:3000${docPath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1 text-xs shrink-0"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  View File
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                  {report.submittedAt && (
                    <p className="text-xs text-muted-foreground pt-2">
                      Submitted on {new Date(report.submittedAt).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents (commented out) */}
            {/* <Card>...</Card> */}
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
                    {formatCurrency(Number(mission.estimatedBudget))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transport</span>
                    <span>{formatCurrency(Number(mission.estimatedBudget) * 0.3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accommodation</span>
                    <span>{formatCurrency(Number(mission.estimatedBudget) * 0.25)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Diem</span>
                    <span>{formatCurrency(Number(mission.estimatedBudget) * 0.35)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Other</span>
                    <span>{formatCurrency(Number(mission.estimatedBudget) * 0.1)}</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Budget Code: {mission.missionNumber}-BUDGET
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canMarkCompleted && (
                  <Button className="w-full" onClick={handleMarkCompleted} disabled={isCompleting}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isCompleting ? 'Marking...' : 'Mark Mission as Completed'}
                  </Button>
                )}
                {mission.status === 'COMPLETED' && (
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => navigate(`/employee/report/${mission.id}`, { state: { mission } })}
                    disabled={!!report}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {report ? 'Report Submitted' : 'Submit Report'}
                  </Button>
                )}

                {['APPROVED', 'IN_PROGRESS', 'COMPLETED'].includes(mission.status) && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleDownloadLetter}
                    disabled={isDownloadingLetter}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloadingLetter ? 'Downloading...' : 'Download Mission Order'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
