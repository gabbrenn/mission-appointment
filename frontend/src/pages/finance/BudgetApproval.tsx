import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Clock,
} from "lucide-react";
import { 
  formatCurrency, 
  formatDate,
  mockMissions,
} from "@/lib/mockData";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BudgetApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  // Find pending finance approvals
  const pendingMissions = mockMissions.filter(
    m => m.approvalStatus.find(a => a.role === 'Finance' && a.status === 'pending')
  );

  const mission = id 
    ? mockMissions.find(m => m.id === id)
    : pendingMissions[0];

  if (!mission) {
    return (
      <DashboardLayout userRole="finance">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No mission found</p>
        </div>
      </DashboardLayout>
    );
  }

  // Budget breakdown
  const budgetBreakdown = [
    { category: 'Transport', amount: mission.budget * 0.3, code: 'TRP-001' },
    { category: 'Accommodation', amount: mission.budget * 0.25, code: 'HEB-002' },
    { category: 'Per Diem', amount: mission.budget * 0.35, code: 'PER-003' },
    { category: 'Other', amount: mission.budget * 0.1, code: 'AUT-004' },
  ];

  // Historical comparison data
  const historicalData = [
    { month: 'Jan', avg: mission.budget * 0.8 },
    { month: 'Fév', avg: mission.budget * 0.9 },
    { month: 'Mar', avg: mission.budget * 1.1 },
    { month: 'Avr', avg: mission.budget * 0.95 },
    { month: 'Mai', avg: mission.budget * 1.05 },
    { month: 'Juin', avg: mission.budget },
  ];

  const avgBudget = historicalData.reduce((acc, d) => acc + d.avg, 0) / historicalData.length;
  const variance = ((mission.budget - avgBudget) / avgBudget) * 100;

  const handleApprove = () => {
    toast.success("Budget approved", {
      description: `Mission "${mission.title}" approved with budget of ${formatCurrency(mission.budget)}`,
    });
    navigate('/finance');
  };

  const handleReject = () => {
    if (!comment) {
      toast.error("Comment required", {
        description: "Please provide a reason for rejection",
      });
      return;
    }
    toast.error("Budget rejected", {
      description: `Mission "${mission.title}" rejected`,
    });
    navigate('/finance');
  };

  return (
    <DashboardLayout userRole="finance">
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Budget Approval
            </h1>
            <p className="text-muted-foreground">
              Review and approval of budget request
            </p>
          </div>
          {pendingMissions.length > 1 && (
            <Badge variant="secondary">
              {pendingMissions.indexOf(mission) + 1} of {pendingMissions.length}
            </Badge>
          )}
        </div>

        {/* Mission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{mission.title}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge>{mission.type}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destination
                </p>
                <p className="font-medium">{mission.destination}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Period
                </p>
                <p className="font-medium">
                  {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned Employee
                </p>
                <p className="font-medium">
                  {mission.assignedTo ? 
                    `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 
                    'Not assigned'
                  }
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{mission.department}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{mission.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Budget Analysis */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Budget Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Budget Total</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(mission.budget)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Code: {mission.budgetCode}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                {budgetBreakdown.map((item) => (
                  <div key={item.code} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.category}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historical Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Average Budget (6 months)</p>
                  <p className="text-xl font-semibold">{formatCurrency(avgBudget)}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Variance</p>
                  <div className="flex items-center gap-2">
                    {variance > 0 ? (
                      <>
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <p className="text-xl font-semibold text-orange-500">
                          +{variance.toFixed(1)}%
                        </p>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-5 w-5 text-green-500" />
                        <p className="text-xl font-semibold text-green-500">
                          {variance.toFixed(1)}%
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="avg" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>

              {Math.abs(variance) > 20 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    This budget exceeds the historical average by more than 20%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Budget Availability Check */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Department Budget</p>
                <p className="text-xl font-semibold">{formatCurrency(50000000)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Already Committed</p>
                <p className="text-xl font-semibold">{formatCurrency(35000000)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-semibold text-green-600">
                  {formatCurrency(15000000)}
                </p>
              </div>
            </div>

            {mission.budget > 15000000 ? (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Insufficient budget in this department
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Sufficient budget available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add your comments or observations (required for rejection)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/finance')}
          >
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleReject}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={mission.budget > 15000000}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        {/* Navigation to Next */}
        {pendingMissions.length > 1 && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const currentIndex = pendingMissions.indexOf(mission);
                const nextMission = pendingMissions[currentIndex + 1] || pendingMissions[0];
                navigate(`/finance/approvals/${nextMission.id}`);
              }}
            >
              Next Mission →
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
