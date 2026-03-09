import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface MissionApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (comments?: string) => Promise<void>;
  onReject: (comments?: string, rejectionReason?: string) => Promise<void>;
  missionId: string;
  missionTitle: string;
  currentStatus: string;
}

export function MissionApprovalModal({ 
  isOpen, 
  onClose, 
  onApprove,
  onReject,
  missionId,
  missionTitle,
  currentStatus
}: MissionApprovalModalProps) {
  const [comments, setComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  const handleApprove = async () => {
    if (!comments.trim()) {
      toast.error("Please add comments before approving");
      return;
    }

    setIsSubmitting(true);
    setActionType('APPROVE');
    
    try {
      await onApprove(comments.trim());
      toast.success("Mission approved successfully");
      handleClose();
    } catch (error) {
      console.error('Error approving mission:', error);
      toast.error("Failed to approve mission");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please provide comments for rejection");
      return;
    }

    setIsSubmitting(true);
    setActionType('REJECT');
    
    try {
      await onReject(comments.trim(), rejectionReason.trim() || undefined);
      toast.success("Mission rejected");
      handleClose();
    } catch (error) {
      console.error('Error rejecting mission:', error);
      toast.error("Failed to reject mission");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  const handleClose = () => {
    setComments("");
    setRejectionReason("");
    setActionType(null);
    setIsSubmitting(false);
    onClose();
  };

  const getStatusLabel = () => {
    switch(currentStatus) {
      case 'PENDING_DEPARTMENT_APPROVAL':
        return 'Pending Department Head Approval';
      case 'PENDING_FINANCE_APPROVAL':
        return 'Pending Finance Approval';
      case 'PENDING_HR_APPROVAL':
        return 'Pending HR Approval';
      case 'PENDING_DIRECTOR_APPROVAL':
        return 'Pending Director Approval';
      default:
        return currentStatus;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Mission Approval Required
          </DialogTitle>
          <DialogDescription>
            <strong>{missionTitle}</strong>
            <br />
            Status: {getStatusLabel()}
            <br />
            <span className="text-sm text-muted-foreground">
              Please review and provide your decision with comments.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comments">Comments <span className="text-red-500">*</span></Label>
            <Textarea
              id="comments"
              placeholder="Add your approval comments or feedback..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              required
            />
          </div>

          {actionType === 'REJECT' && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Specify the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={2}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting || !comments.trim()}
            className="flex-1"
          >
            {isSubmitting && actionType === 'REJECT' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting || !comments.trim()}
            className="flex-1"
          >
            {isSubmitting && actionType === 'APPROVE' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}