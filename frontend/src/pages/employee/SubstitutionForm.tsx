import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Upload,
  FileText,
  X,
  AlertCircle,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatDate, mockMissions, mockUsers } from "@/lib/mockData";
import { toast } from "sonner";

export default function SubstitutionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const mission = mockMissions.find(m => m.id === id) || mockMissions[0];
  
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [suggestedReplacement, setSuggestedReplacement] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available employees for replacement suggestion
  const availableEmployees = mockUsers.filter(
    u => u.role === 'employee' && u.isAvailable && u.id !== mission.assignedTo?.id
  );

  const reasonOptions = [
    { value: 'health', label: 'Raison de Santé' },
    { value: 'family', label: 'Urgence Familiale' },
    { value: 'conflict', label: 'Conflit de Planning' },
    { value: 'training', label: 'Formation Obligatoire' },
    { value: 'other', label: 'Autre Raison' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    
    if (!explanation.trim()) {
      toast.error("Please provide an explanation");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Demande de remplacement soumise avec succès");
    navigate('/employee');
  };

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
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
              Substitution Request
            </h1>
            <p className="text-muted-foreground">
              Mission: {mission.title}
            </p>
          </div>
        </div>

        {/* Mission Summary */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  Attention: This action requires approval
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Your request will be reviewed by your department head. Please provide a clear justification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Form</CardTitle>
                <CardDescription>
                  Fill in the information below to submit your substitution request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Substitution *</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Detailed Explanation *</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain the reason for your substitution request..."
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 50 characters. Current: {explanation.length}
                    </p>
                  </div>

                  {/* Suggested Replacement */}
                  <div className="space-y-2">
                    <Label htmlFor="replacement">Suggest a Replacement (Optional)</Label>
                    <Select value={suggestedReplacement} onValueChange={setSuggestedReplacement}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEmployees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName} - {emp.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      If you know an available and qualified colleague
                    </p>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Supporting Documents (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, JPG up to 10MB
                        </p>
                      </label>
                    </div>

                    {/* Uploaded Files */}
                    {files.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {files.map((file, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Mission Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{mission.title}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {mission.type}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mission.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    {mission.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Replacement Preview */}
            {suggestedReplacement && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Remplaçant Suggéré</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const emp = availableEmployees.find(e => e.id === suggestedReplacement);
                    if (!emp) return null;
                    return (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {emp.department} • Score: {emp.fairnessScore}%
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
