import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ApprovalTimeline } from "@/components/approval-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  FileText,
  MessageSquare,
  AlertTriangle,
  Clock,
  Shield,
  Target,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { mockMissions, mockUsers, formatCurrency, formatDate } from "@/lib/mockData";
import { toast } from "sonner";

export default function FinalApproval() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const [directorNotes, setDirectorNotes] = useState('');
  const [strategicNotes, setStrategicNotes] = useState('');
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

  // Mock approval comments from previous stages
  const approvalComments = [
    {
      stage: 'Department Head',
      approver: 'Jean-Pierre Nkurunziza',
      date: '2026-01-18',
      comment: 'Mission approved. Employee has the required skills.',
      status: 'approved',
    },
    {
      stage: 'Finance',
      approver: 'Marie Ndayisaba',
      date: '2026-01-19',
      comment: 'Budget compliant with guidelines. Funds available.',
      status: 'approved',
    },
    {
      stage: 'Human Resources',
      approver: 'Emmanuel Bizimana',
      date: '2026-01-20',
      comment: 'HR confirmation completed. No scheduling conflicts.',
      status: 'approved',
    },
  ];

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Mission definitively approved");
    navigate('/director');
  };

  const handleReject = async () => {
    if (!directorNotes.trim()) {
      toast.error("Please justify the rejection");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Mission rejected");
    navigate('/director');
  };

  // Strategic metrics
  const strategicAlignment = 85;
  const riskLevel = 'low';
  const priorityLevel = 'high';

  return (
    <DashboardLayout userRole="director">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/director')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Director Final Approval
            </h1>
            <p className="text-muted-foreground">
              Final review and strategic decision
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {mission.id}
          </Badge>
        </div>

        {/* Strategic Summary Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Strategic Alignment</p>
                  <p className="font-semibold text-blue-600">{strategicAlignment}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <Badge className="bg-green-500">
                    {riskLevel === 'low' ? 'Low' : riskLevel === 'medium' ? 'Medium' : 'High'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge className="bg-amber-500">
                    {priorityLevel === 'high' ? 'High' : priorityLevel === 'medium' ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="font-semibold">{formatCurrency(mission.budget)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="approvals">Approvals</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
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
                      <div className="flex items-center gap-2">
                        <Badge>{mission.type || 'Inspection'}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">
                        {mission.description || "Inspection régulière des bureaux de poste dans la région assignée. Vérification des opérations, de la qualité du service et de la conformité aux normes de la RNP."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Objectifs Stratégiques</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Amélioration de la qualité du service postal</li>
                        <li>Renforcement de la présence dans les provinces</li>
                        <li>Collecte de données pour optimisation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Employee Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profil de l'Employé
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
                        <p className="text-lg font-semibold">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-muted-foreground">
                          {employee.role} • {employee.department}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={employee.isAvailable ? "default" : "secondary"}>
                            {employee.isAvailable ? 'Disponible' : 'En mission'}
                          </Badge>
                          <Badge variant="outline">
                            Score Équité: {employee.fairnessScore}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{employee.totalMissions || 8}</p>
                        <p className="text-xs text-muted-foreground">Missions Totales</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-green-600">96%</p>
                        <p className="text-xs text-muted-foreground">Taux de Réussite</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">4.8</p>
                        <p className="text-xs text-muted-foreground">Note Moyenne</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-6 mt-6">
                {/* Approval Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Commentaires des Approbateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {approvalComments.map((comment, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {comment.stage}
                            </Badge>
                            <span className="text-sm font-medium">{comment.approver}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(comment.date)}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Full Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Parcours d'Approbation Complet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ApprovalTimeline 
                      steps={[
                        { role: 'Employé', status: 'approved', date: '15 Jan 2026', comment: 'Demande soumise' },
                        { role: 'Chef de Département', status: 'approved', date: '18 Jan 2026', comment: approvalComments[0].comment },
                        { role: 'Finance', status: 'approved', date: '19 Jan 2026', comment: approvalComments[1].comment },
                        { role: 'RH', status: 'approved', date: '20 Jan 2026', comment: approvalComments[2].comment },
                        { role: 'Directeur', status: 'pending', date: '', comment: 'En attente de votre décision' },
                      ]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budget" className="space-y-6 mt-6">
                {/* Budget Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Répartition Budgétaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {budgetBreakdown.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(item.amount / mission.budget) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(mission.budget)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Context */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contexte Budgétaire</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Budget Annuel RNP</p>
                        <p className="text-xl font-bold">{formatCurrency(500000000)}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Used to date</p>
                        <p className="text-xl font-bold">{formatCurrency(285000000)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cette mission représente <span className="font-semibold">0.12%</span> du budget annuel restant.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Director Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes du Directeur</CardTitle>
                <CardDescription>
                  Ajoutez vos observations et décision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Commentaires sur la décision</Label>
                  <Textarea
                    placeholder="Entrez vos commentaires..."
                    value={directorNotes}
                    onChange={(e) => setDirectorNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes Stratégiques (optionnel)</Label>
                  <Textarea
                    placeholder="Considérations stratégiques pour cette mission..."
                    value={strategicNotes}
                    onChange={(e) => setStrategicNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé Exécutif</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mission</span>
                  <span className="font-medium">{mission.title.substring(0, 15)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employé</span>
                  <span>{employee.firstName} {employee.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Département</span>
                  <span>{mission.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durée</span>
                  <span>5 jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold text-primary">{formatCurrency(mission.budget)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approbations</span>
                  <Badge className="bg-green-500">3/3</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Évaluation des Risques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risque Financier</span>
                  <Badge className="bg-green-500">Faible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risque Opérationnel</span>
                  <Badge className="bg-green-500">Faible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risque de Conformité</span>
                  <Badge className="bg-green-500">Faible</Badge>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Aucun risque significatif identifié. Toutes les approbations préalables ont été obtenues.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {isProcessing ? 'Traitement...' : 'Approuver Définitivement'}
                </Button>
                
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser la Mission
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
