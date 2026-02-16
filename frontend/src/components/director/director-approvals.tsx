import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin,
  DollarSign,
  User,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { 
  mockMissions, 
  Mission, 
  formatCurrency, 
  formatDate,
  missionTypes,
} from "@/lib/mockData";
import { ApprovalTimeline } from "@/components/approval-timeline";
import { toast } from "sonner";

export function DirectorApprovals() {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [comment, setComment] = useState("");

  // Get missions pending director approval (all other approvals done)
  const pendingApprovals = missions.filter(m => {
    const directorStep = m.approvalStatus.find(s => s.role === 'Directeur');
    const otherSteps = m.approvalStatus.filter(s => s.role !== 'Directeur');
    const allOthersApproved = otherSteps.every(s => s.status === 'approved');
    return directorStep?.status === 'pending' && allOthersApproved;
  });

  const handleApprove = () => {
    if (!selectedMission) return;
    
    setMissions(prev => prev.map(m => {
      if (m.id === selectedMission.id) {
        return {
          ...m,
          status: 'assigned',
          approvalStatus: m.approvalStatus.map(s => 
            s.role === 'Directeur' 
              ? { ...s, status: 'approved', approver: 'Pascasie Ntahomvukiye', date: new Date().toISOString().split('T')[0], comment }
              : s
          )
        };
      }
      return m;
    }));
    
    setIsApproveOpen(false);
    setSelectedMission(null);
    setComment("");
    toast.success("Mission approuvée avec succès");
  };

  const handleReject = () => {
    if (!selectedMission) return;
    
    setMissions(prev => prev.map(m => {
      if (m.id === selectedMission.id) {
        return {
          ...m,
          status: 'rejected',
          approvalStatus: m.approvalStatus.map(s => 
            s.role === 'Directeur' 
              ? { ...s, status: 'rejected', approver: 'Pascasie Ntahomvukiye', date: new Date().toISOString().split('T')[0], comment }
              : s
          )
        };
      }
      return m;
    }));
    
    setIsRejectOpen(false);
    setSelectedMission(null);
    setComment("");
    toast.success("Mission rejetée");
  };

  const openApproveDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsApproveOpen(true);
  };

  const openRejectDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsRejectOpen(true);
  };

  return (
    <>
      <Card className="card-gov">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Approbations Finales en Attente
          </CardTitle>
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
            {pendingApprovals.length} en attente
          </Badge>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-secondary opacity-50" />
              <p>Aucune approbation en attente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((mission) => (
                <div 
                  key={mission.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{mission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {missionTypes[mission.type]} • {mission.budgetCode}
                          </p>
                        </div>
                        <Badge className="bg-status-pending/20 text-status-pending-foreground border-0 shrink-0">
                          En attente
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{mission.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(mission.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatCurrency(mission.budget)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{mission.assignedTo ? `${mission.assignedTo.firstName} ${mission.assignedTo.lastName}` : 'Non assignée'}</span>
                        </div>
                      </div>

                      {/* Approval Timeline */}
                      <div className="pt-2">
                        <ApprovalTimeline steps={mission.approvalStatus} compact />
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                      <Button 
                        onClick={() => openApproveDialog(mission)}
                        className="btn-gov-secondary gap-2 flex-1 lg:flex-none"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approuver
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => openRejectDialog(mission)}
                        className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground flex-1 lg:flex-none"
                      >
                        <XCircle className="h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Confirmer l'Approbation
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'approuver cette mission
            </DialogDescription>
          </DialogHeader>
          
          {selectedMission && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">{selectedMission.title}</h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Destination: {selectedMission.destination}</div>
                  <div>Budget: {formatCurrency(selectedMission.budget)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Commentaire (optionnel)</label>
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="btn-gov-secondary gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirmer l'Approbation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Rejeter la Mission
            </DialogTitle>
            <DialogDescription>
              This action is final. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMission && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <h4 className="font-medium">{selectedMission.title}</h4>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Destination: {selectedMission.destination}</div>
                  <div>Budget: {formatCurrency(selectedMission.budget)}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Raison du rejet <span className="text-destructive">*</span></label>
                <Textarea
                  placeholder="Expliquez pourquoi cette mission est rejetée..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!comment.trim()}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Confirmer le Rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
