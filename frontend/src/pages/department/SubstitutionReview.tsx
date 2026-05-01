import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Calendar,
  MapPin,
  AlertTriangle,
  Star,
  Award,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { mockMissions, mockUsers, formatCurrency, formatDate } from "@/lib/mockData";
import { toast } from "sonner";
import { missionService } from "@/services/mission.service";

export default function SubstitutionReview() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    if (requestId) {
        missionService.getSubstitutionRequestById(requestId)
            .then(data => setRequest(data))
            .catch(err => {
                console.error(err);
                toast.error("Failed to load substitution request");
            });
    }
  }, [requestId]);

  const handleApprove = async () => {
    if (!requestId) return;
    setIsProcessing(true);
    try {
        await missionService.processSubstitutionRequest(requestId, 'APPROVED', comments);
        toast.success("Substitution approved successfully");
        navigate('/department');
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Error during approval");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please justify the refusal in the comments");
      return;
    }
    if (!requestId) return;

    setIsProcessing(true);
    try {
        await missionService.processSubstitutionRequest(requestId, 'REJECTED', comments);
        toast.success("Substitution request rejected");
        navigate('/department');
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Error during rejection");
    } finally {
        setIsProcessing(false);
    }
  };

  if (!request) {
      return <div>Loading...</div>;
  }

  const originalEmployee = request.employee;
  const mission = request.assignment?.mission;

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'medical': return 'bg-red-100 text-red-700 border-red-200';
      case 'family': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'conflict': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'other': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/department')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Substitution Request Review
            </h1>
            <p className="text-muted-foreground">
              Evaluate and approve the replacement request
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {request.id}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Mission Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Original Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{mission.title}</h3>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{mission.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-semibold">{formatCurrency(mission.budget)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {originalEmployee.firstName[0]}{originalEmployee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {originalEmployee.firstName} {originalEmployee.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {originalEmployee.department}
                    </p>
                  </div>
                  <Badge className={getReasonBadgeColor(request.reasonCategory)}>
                    {request.reasonCategory}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground bg-white dark:bg-gray-800 p-3 rounded-lg">
                    {request.detailedReason}
                  </p>
                </div>

                {request.supportingDocuments && request.supportingDocuments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attached Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.supportingDocuments.map((doc: string, index: number) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Request submitted on: {formatDate(request.createdAt)}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
                <CardDescription>
                  Add your observations or justifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your comments regarding this substitution request..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Original Employee Info */}
            <Card>
              <CardHeader>
                <CardTitle>Original Employee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {originalEmployee.firstName[0]}{originalEmployee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {originalEmployee.firstName} {originalEmployee.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {originalEmployee.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span>{originalEmployee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fairness Score</span>
                    <span className="font-semibold">{originalEmployee.fairnessScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary">Substitution request</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Approve Substitution'}
                </Button>
                
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
