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
import { useState } from "react";
import { mockMissions, mockUsers, formatCurrency, formatDate } from "@/lib/mockData";
import { toast } from "sonner";

export default function SubstitutionReview() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [comments, setComments] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock substitution request data
  const request = {
    id: requestId || 'SUB-001',
    employeeId: '1',
    missionId: mockMissions[0]?.id,
    reason: 'medical',
    reasonLabel: 'Raison Médicale',
    explanation: "Je dois subir une intervention chirurgicale programmée qui m'empêchera de participer à cette mission. J'ai fourni les documents médicaux nécessaires.",
    requestedDate: '2026-01-20',
    documents: ['certificat_medical.pdf'],
    status: 'pending',
    suggestedReplacement: '2',
  };

  const originalEmployee = mockUsers.find(u => u.id === request.employeeId) || mockUsers[0];
  const mission = mockMissions.find(m => m.id === request.missionId) || mockMissions[0];
  const suggestedEmployee = mockUsers.find(u => u.id === request.suggestedReplacement);

  // Alternative candidates (generated from available employees)
  const candidates = mockUsers
    .filter(u => u.role === 'employee' && u.id !== request.employeeId && u.isAvailable)
    .slice(0, 5)
    .map((user, index) => ({
      ...user,
      matchScore: 95 - (index * 8),
      lastMission: `${12 + index} jours`,
      missionsThisYear: 2 + index,
      isSuggested: user.id === request.suggestedReplacement,
    }));

  const handleApprove = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a replacement employee");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Substitution approuvée avec succès");
    navigate('/department');
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please justify the refusal in the comments");
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Demande de substitution refusée");
    navigate('/department');
  };

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
              Examen de Demande de Substitution
            </h1>
            <p className="text-muted-foreground">
              Évaluer et approuver la demande de remplacement
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
                  Mission Originale
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
                  Détails de la Demande
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
                  <Badge className={getReasonBadgeColor(request.reason)}>
                    {request.reasonLabel}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Explication</h4>
                  <p className="text-sm text-muted-foreground bg-white dark:bg-gray-800 p-3 rounded-lg">
                    {request.explanation}
                  </p>
                </div>

                {request.documents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Documents Joints</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Demande soumise le: {formatDate(request.requestedDate)}
                </div>
              </CardContent>
            </Card>

            {/* Alternative Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Candidats de Remplacement
                </CardTitle>
                <CardDescription>
                  Sélectionnez l'employé qui effectuera cette mission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Missions (Année)</TableHead>
                      <TableHead className="text-center">Dernière Mission</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow 
                        key={candidate.id}
                        className={selectedCandidate === candidate.id ? 'bg-primary/5' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {candidate.firstName[0]}{candidate.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              {candidate.isSuggested && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Suggéré
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.department}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={candidate.matchScore >= 85 ? 'default' : 'secondary'}
                            className={candidate.matchScore >= 85 ? 'bg-green-500' : ''}
                          >
                            {candidate.matchScore}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{candidate.missionsThisYear}</TableCell>
                        <TableCell className="text-center">{candidate.lastMission}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={selectedCandidate === candidate.id ? "default" : "outline"}
                            onClick={() => setSelectedCandidate(candidate.id)}
                          >
                            {selectedCandidate === candidate.id ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Sélectionné
                              </>
                            ) : (
                              'Sélectionner'
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Commentaires</CardTitle>
                <CardDescription>
                  Ajoutez vos observations ou justifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Entrez vos commentaires concernant cette demande de substitution..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Candidate Summary */}
            {selectedCandidate && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Candidat Sélectionné
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const selected = candidates.find(c => c.id === selectedCandidate);
                    if (!selected) return null;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="font-semibold text-green-700">
                              {selected.firstName[0]}{selected.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {selected.firstName} {selected.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selected.department}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded">
                            <p className="text-muted-foreground">Score</p>
                            <p className="font-semibold text-green-600">{selected.matchScore}%</p>
                          </div>
                          <div className="p-2 bg-white dark:bg-gray-800 rounded">
                            <p className="text-muted-foreground">Équité</p>
                            <p className="font-semibold">{selected.fairnessScore}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Original Employee Info */}
            <Card>
              <CardHeader>
                <CardTitle>Employé Original</CardTitle>
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
                    <span className="text-muted-foreground">Département</span>
                    <span>{originalEmployee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score Équité</span>
                    <span className="font-semibold">{originalEmployee.fairnessScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <Badge variant="secondary">Demande de substitution</Badge>
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
                  disabled={isProcessing || !selectedCandidate}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Traitement...' : 'Approuver la Substitution'}
                </Button>
                
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser la Demande
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
