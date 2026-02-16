import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Download,
  ZoomIn,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { 
  formatCurrency, 
  formatDate,
  mockMissions,
} from "@/lib/mockData";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
  variance: number;
  receipts: string[];
}

export default function ExpenseReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  // Mock completed missions with expenses
  const completedMissions = mockMissions.filter(m => m.status === 'completed');
  const mission = id 
    ? completedMissions.find(m => m.id === id)
    : completedMissions[0];

  if (!mission) {
    return (
      <DashboardLayout userRole="finance">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reimbursement request found</p>
        </div>
      </DashboardLayout>
    );
  }

  // Generate expense items
  const expenseItems: ExpenseItem[] = [
    {
      id: '1',
      category: 'Transport',
      description: 'Flight tickets Bujumbura-Gitega',
      budgeted: mission.budget * 0.3,
      actual: mission.budget * 0.32,
      variance: mission.budget * 0.02,
      receipts: ['receipt-1.jpg', 'receipt-2.jpg'],
    },
    {
      id: '2',
      category: 'Accommodation',
      description: 'Mont Héha Hotel (5 nights)',
      budgeted: mission.budget * 0.25,
      actual: mission.budget * 0.24,
      variance: -mission.budget * 0.01,
      receipts: ['receipt-3.jpg'],
    },
    {
      id: '3',
      category: 'Per Diem',
      description: 'Daily allowances (5 days)',
      budgeted: mission.budget * 0.35,
      actual: mission.budget * 0.35,
      variance: 0,
      receipts: [],
    },
    {
      id: '4',
      category: 'Meals',
      description: 'Restaurant expenses',
      budgeted: mission.budget * 0.05,
      actual: mission.budget * 0.08,
      variance: mission.budget * 0.03,
      receipts: ['receipt-4.jpg', 'receipt-5.jpg', 'receipt-6.jpg'],
    },
    {
      id: '5',
      category: 'Other',
      description: 'Supplies and miscellaneous',
      budgeted: mission.budget * 0.05,
      actual: mission.budget * 0.04,
      variance: -mission.budget * 0.01,
      receipts: ['receipt-7.jpg'],
    },
  ];

  const totalBudgeted = expenseItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = expenseItems.reduce((sum, item) => sum + (adjustments[item.id] ?? item.actual), 0);
  const totalVariance = totalActual - totalBudgeted;
  const variancePercent = (totalVariance / totalBudgeted) * 100;

  // Flag outliers (variance > 15%)
  const outliers = expenseItems.filter(item => {
    const itemVariancePercent = Math.abs((item.variance / item.budgeted) * 100);
    return itemVariancePercent > 15;
  });

  const handleAdjustment = (itemId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAdjustments(prev => ({ ...prev, [itemId]: numValue }));
  };

  const handleApproveFull = () => {
    toast.success("Reimbursement approved", {
      description: `Total amount: ${formatCurrency(totalActual)}`,
    });
    navigate('/finance');
  };

  const handleApprovePartial = () => {
    const adjustedTotal = expenseItems.reduce(
      (sum, item) => sum + (adjustments[item.id] ?? item.actual), 
      0
    );
    toast.success("Partial reimbursement approved", {
      description: `Adjusted amount: ${formatCurrency(adjustedTotal)}`,
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
    toast.error("Reimbursement rejected", {
      description: `Request for ${formatCurrency(totalActual)} rejected`,
    });
    navigate('/finance');
  };

  return (
    <DashboardLayout userRole="finance">
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Expense Review
          </h1>
          <p className="text-muted-foreground">
            Review and approval of reimbursements
          </p>
        </div>

        {/* Mission Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Mission</p>
                <p className="font-medium">{mission.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Employee
                </p>
                <p className="font-medium">
                  {mission.assignedTo ? 
                    `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Destination
                </p>
                <p className="font-medium">{mission.destination}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Period
                </p>
                <p className="font-medium text-sm">
                  {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Allocated Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Actual Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(totalActual)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Variance</p>
              <p className={`text-2xl font-bold ${totalVariance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {totalVariance > 0 ? '+' : ''}{formatCurrency(Math.abs(totalVariance))}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalVariance > 0 ? '+' : ''}{variancePercent.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Receipts</p>
              <p className="text-2xl font-bold">
                {expenseItems.reduce((sum, item) => sum + item.receipts.length, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Outlier Alert */}
        {outliers.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-100">
                    {outliers.length} expense(s) with significant variance
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    {outliers.map(item => item.category).join(', ')} - Review recommended
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expense Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Budgeted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-center">Receipts</TableHead>
                  <TableHead className="text-right">Adjustment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseItems.map((item) => {
                  const itemVariancePercent = (item.variance / item.budgeted) * 100;
                  const isOutlier = Math.abs(itemVariancePercent) > 15;

                  return (
                    <TableRow key={item.id} className={isOutlier ? 'bg-orange-50 dark:bg-orange-950' : ''}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.budgeted)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.actual)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={item.variance > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {item.variance > 0 ? '+' : ''}{formatCurrency(Math.abs(item.variance))}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({itemVariancePercent > 0 ? '+' : ''}{itemVariancePercent.toFixed(1)}%)
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.receipts.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedImage(item.receipts[0])}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            {item.receipts.length}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          placeholder={formatCurrency(item.actual)}
                          className="w-32 text-right"
                          onChange={(e) => handleAdjustment(item.id, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Receipt Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {expenseItems.flatMap(item => 
                item.receipts.map((receipt, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => setSelectedImage(receipt)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                      {item.category}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments and Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add your comments on the expenses..."
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
            {Object.keys(adjustments).length > 0 && (
              <Button
                variant="secondary"
                onClick={handleApprovePartial}
              >
                Approve Partial
              </Button>
            )}
            <Button onClick={handleApproveFull}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Full
            </Button>
          </div>
        </div>

        {/* Receipt Viewer Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Receipt</DialogTitle>
            </DialogHeader>
            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <FileText className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">{selectedImage}</p>
                <Button variant="outline" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
