import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { formatCurrency, departments, mockUsers, burundiCities, cities } from "@/lib/mockData";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

interface MissionForm {
  // Step 1: Details
  title: string;
  type: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  // Step 2: Requirements
  department: string;
  requiredSkills: string[];
  // Step 3: Budget
  transport: number;
  accommodation: number;
  perDiem: number;
  other: number;
  budgetCode: string;
  // Step 4: Review (uses all above)
}

export default function CreateMission() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState<MissionForm>({
    title: '',
    type: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    department: '',
    requiredSkills: [],
    transport: 0,
    accommodation: 0,
    perDiem: 0,
    other: 0,
    budgetCode: '',
  });

  const [newSkill, setNewSkill] = useState('');

  const missionTypes = [
    { value: 'inspection', label: 'Inspection' },
    { value: 'formation', label: 'Formation' },
    { value: 'reunion', label: 'Réunion' },
    { value: 'audit', label: 'Audit' },
    { value: 'livraison', label: 'Livraison' },
  ];

  const availableSkills = [
    'Audit', 'Formation', 'Inspection', 'Logistique', 
    'Communication', 'Comptabilité', 'Gestion de Projet',
  ];

  const totalBudget = form.transport + form.accommodation + form.perDiem + form.other;

  // Auto-assigned employee based on algorithm (mock)
  const suggestedEmployee = mockUsers.find(u => u.role === 'employee' && u.isAvailable);

  const addSkill = (skill: string) => {
    if (!form.requiredSkills.includes(skill)) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) });
  };

  const validateStep = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 1:
        if (!form.title || !form.type || !form.destination || !form.startDate || !form.endDate) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (new Date(form.endDate) < new Date(form.startDate)) {
          toast.error("End date must be after start date");
          return false;
        }
        return true;
      case 2:
        if (!form.department) {
          toast.error("Please select a department");
          return false;
        }
        return true;
      case 3:
        if (totalBudget <= 0) {
          toast.error("Total budget must be greater than 0");
          return false;
        }
        if (!form.budgetCode) {
          toast.error("Please enter a budget code");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((step + 1) as Step);
    }
  };

  const prevStep = () => {
    setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Mission created successfully");
    navigate('/department');
  };

  const steps = [
    { number: 1, title: 'Details', icon: FileText },
    { number: 2, title: 'Requirements', icon: Users },
    { number: 3, title: 'Budget', icon: DollarSign },
    { number: 4, title: 'Review', icon: Check },
  ];

  return (
    <DashboardLayout userRole="department_head">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/department')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Mission
            </h1>
            <p className="text-muted-foreground">
              Step {step} of 4
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${step >= s.number 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground text-muted-foreground'
                }
              `}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${step >= s.number ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${step > s.number ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Mission Details</CardTitle>
              <CardDescription>
                General information about the mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Mission Title *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Post office inspection"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mission Type *</Label>
                  <Select 
                    value={form.type} 
                    onValueChange={(value) => setForm({ ...form, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {missionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Destination *</Label>
                  <Select 
                    value={form.destination} 
                    onValueChange={(value) => setForm({ ...form, destination: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the objectives and activities of the mission..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Exigences de la Mission</CardTitle>
              <CardDescription>
                Département et compétences requises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Département *</Label>
                <Select 
                  value={form.department} 
                  onValueChange={(value) => setForm({ ...form, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.requiredSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSkills
                    .filter(s => !form.requiredSkills.includes(s))
                    .map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Mission Budget</CardTitle>
              <CardDescription>
                Detailed budget breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Transport (BIF)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.transport || ''}
                    onChange={(e) => setForm({ ...form, transport: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Accommodation (BIF)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.accommodation || ''}
                    onChange={(e) => setForm({ ...form, accommodation: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Per Diem (BIF)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.perDiem || ''}
                    onChange={(e) => setForm({ ...form, perDiem: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Other Expenses (BIF)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.other || ''}
                    onChange={(e) => setForm({ ...form, other: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Budget</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Budget Code *</Label>
                <Input
                  placeholder="Ex: BUD-2026-001"
                  value={form.budgetCode}
                  onChange={(e) => setForm({ ...form, budgetCode: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission Review</CardTitle>
                <CardDescription>
                  Verify information before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title</span>
                        <span className="font-medium">{form.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <Badge>{form.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {form.destination}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dates</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {form.startDate} - {form.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department</span>
                        <span>{form.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Budget</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transport</span>
                        <span>{formatCurrency(form.transport)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accommodation</span>
                        <span>{formatCurrency(form.accommodation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per Diem</span>
                        <span>{formatCurrency(form.perDiem)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Other</span>
                        <span>{formatCurrency(form.other)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(totalBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code</span>
                        <span>{form.budgetCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {form.requiredSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {form.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {form.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{form.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Employee */}
            {suggestedEmployee && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Employee Suggested by Algorithm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {suggestedEmployee.firstName[0]}{suggestedEmployee.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {suggestedEmployee.firstName} {suggestedEmployee.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {suggestedEmployee.department} • Fairness Score: {suggestedEmployee.fairnessScore}%
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-3">
                    This employee was selected based on fairness and qualification criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={step === 1 ? () => navigate('/department') : prevStep}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          {step < 4 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Mission'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
