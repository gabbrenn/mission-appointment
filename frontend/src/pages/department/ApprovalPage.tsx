import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ApprovalTimeline } from "@/components/approval-timeline";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { mockMissions, mockUsers, formatCurrency, formatDate } from "@/lib/mockData";
import { toast } from "sonner";

export default function ApprovalPage() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Find mission data (mock)
  const mission = mockMissions.find(m => m.id === missionId) || mockMissions[0];
  const employee = mockUsers.find(u => u.id === (typeof mission?.assignedTo === 'string' ? mission?.assignedTo : mission?.assignedTo?.id)) || mockUsers[0];

  const budgetBreakdown = [
    { label: 'Transport', amount: mission.budget * 0.35 },
    { label: 'Accommodation', amount: mission.budget * 0.30 },
    { label: 'Per Diem', amount: mission.budget * 0.25 },
    { label: 'Other', amount: mission.budget * 0.10 },
  ];

  const handleApprove = async () => {
    if (!comments.trim()) {
      toast.error("Please add a comment before approving");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Mission approved successfully");
    navigate('/department');
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please justify the rejection in the comments");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Mission rejected");
    navigate('/department');
  };

  const handleModify = () => {
    toast.info("Redirecting to edit...");
    navigate(`/department/mission/edit/${missionId}`);
  };

  // Budget impact analysis
  const departmentBudget = 15000000; // Mock
  const usedBudget = 8500000;
  const remainingBudget = departmentBudget - usedBudget;
  const afterApproval = remainingBudget - mission.budget;
  const budgetImpactPercent = ((mission.budget / departmentBudget) * 100).toFixed(1);
  const isBudgetWarning = afterApproval < departmentBudget * 0.2;

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6 max-w-5xl mx-auto">
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
              Mission Approval
            </h1>
            <p className="text-muted-foreground">
              Review and approve the mission request
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {mission.id}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold">{mission.title}</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{mission.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{mission.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-foreground">
                      {formatCurrency(mission.budget)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {mission.description || "Regular inspection of post offices in the assigned region. Verification of operations, service quality and compliance with RNP standards."}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mission Type</h4>
                  <Badge>{mission.type || 'Inspection'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Budget Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(mission.budget)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Impact */}
            <Card className={isBudgetWarning ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isBudgetWarning && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                  Budget Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Department Budget</p>
                      <p className="text-lg font-semibold">{formatCurrency(departmentBudget)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Already Used</p>
                      <p className="text-lg font-semibold">{formatCurrency(usedBudget)}</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${afterApproval < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <p className="text-sm text-muted-foreground">After Approval</p>
                      <p className={`text-lg font-semibold ${afterApproval < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(afterApproval)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    This mission represents <span className="font-semibold">{budgetImpactPercent}%</span> of the total department budget.
                  </p>
                  
                  {isBudgetWarning && (
                    <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Warning: Remaining budget will be less than 20% after this approval.
                    </p>
                  )}
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
                  placeholder="Enter your comments regarding this mission request..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employee Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.role}
                    </p>
                    <Badge variant={employee.isAvailable ? "default" : "secondary"}>
                      {employee.isAvailable ? 'Available' : 'On mission'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Missions (year)</span>
                    <span>{employee.totalMissions || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fairness Score</span>
                    <span className="font-semibold text-primary">
                      {employee.fairnessScore}%
                    </span>
                  </div>
                </div>

                {employee.skills && employee.skills.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Approval Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Approval History</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalTimeline 
                  steps={[
                    { role: 'Employee', status: 'approved', date: formatDate(mission.startDate), comment: 'Request submitted' },
                    { role: 'Department Head', status: 'pending', date: '', comment: 'Awaiting your approval' },
                    { role: 'Finance', status: 'pending', date: '', comment: '' },
                    { role: 'HR', status: 'pending', date: '', comment: '' },
                    { role: 'Director', status: 'pending', date: '', comment: '' },
                  ]}
                />
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
                  {isProcessing ? 'Processing...' : 'Approve'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleModify}
                  disabled={isProcessing}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modify
                </Button>
                
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
