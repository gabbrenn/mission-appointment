import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Upload,
  FileText,
  X,
  Plus,
  Trash2,
  Save,
  Send,
  MapPin,
  Calendar,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatCurrency, formatDate, mockMissions } from "@/lib/mockData";
import { toast } from "sonner";

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  receipt?: File;
}

export default function ReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const mission = mockMissions.find(m => m.id === id) || mockMissions[0];
  
  const [activityReport, setActivityReport] = useState("");
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', category: 'Transport', description: '', amount: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = [
    'Transport',
    'Hébergement',
    'Restauration',
    'Communication',
    'Carburant',
    'Autres',
  ];

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), category: 'Transport', description: '', amount: 0 },
    ]);
  };

  const removeExpenseRow = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string | number | File | null) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const handleReceiptUpload = (id: string, file: File) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, receipt: file } : e
    ));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetVariance = mission.budget - totalExpenses;

  const handleSaveDraft = async () => {
    toast.success("Draft saved");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityReport.trim()) {
      toast.error("Please write the activity report");
      return;
    }
    
    if (expenses.some(e => e.amount <= 0 || !e.description)) {
      toast.error("Please complete all expenses");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Report submitted successfully");
    navigate('/employee');
  };

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Mission Report
              </h1>
              <p className="text-muted-foreground">
                {mission.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Mission Summary Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mission.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Budget: {formatCurrency(mission.budget)}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Report */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Report</CardTitle>
                  <CardDescription>
                    Describe the activities carried out during the mission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe objectives achieved, meetings held, results obtained..."
                    value={activityReport}
                    onChange={(e) => setActivityReport(e.target.value)}
                    rows={10}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {activityReport.length} characters
                  </p>
                </CardContent>
              </Card>

              {/* Expenses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Expenses</CardTitle>
                      <CardDescription>
                        Detail all expenses with receipts
                      </CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addExpenseRow}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Row
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[150px]">Amount (BIF)</TableHead>
                        <TableHead className="w-[120px]">Receipt</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <select
                              value={expense.category}
                              onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                              className="w-full p-2 border rounded-md text-sm"
                            >
                              {expenseCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Description..."
                              value={expense.description}
                              onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0"
                              value={expense.amount || ''}
                              onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell>
                            {expense.receipt ? (
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-green-600" />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateExpense(expense.id, 'receipt', undefined)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Label className="cursor-pointer">
                                <Input
                                  type="file"
                                  className="hidden"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleReceiptUpload(expense.id, file);
                                  }}
                                />
                                <Upload className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </Label>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExpenseRow(expense.id)}
                              disabled={expenses.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Supporting Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Documents</CardTitle>
                  <CardDescription>
                    Photos, presentations, or other relevant documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Input
                      type="file"
                      multiple
                      className="hidden"
                      id="docs-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                    />
                    <label htmlFor="docs-upload" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF, DOC, PPT, Images up to 25MB
                      </p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Budget Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allocated Budget</span>
                      <span className="font-medium">{formatCurrency(mission.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Expenses</span>
                      <span className="font-medium">{formatCurrency(totalExpenses)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variance</span>
                      <span className={`font-bold ${budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {budgetVariance >= 0 ? '+' : ''}{formatCurrency(budgetVariance)}
                      </span>
                    </div>
                  </div>

                  {budgetVariance < 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        ⚠️ Budget overrun. A justification will be required.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expense Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseCategories.map(cat => {
                      const catTotal = expenses
                        .filter(e => e.category === cat)
                        .reduce((sum, e) => sum + e.amount, 0);
                      if (catTotal === 0) return null;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{cat}</span>
                            <span>{formatCurrency(catTotal)}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
