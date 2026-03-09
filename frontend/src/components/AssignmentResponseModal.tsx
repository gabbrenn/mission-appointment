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
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface AssignmentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: 'ACCEPTED' | 'DECLINED', notes?: string) => Promise<void>;
  assignmentId: string;
  missionTitle: string;
}

export function AssignmentResponseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  assignmentId,
  missionTitle
}: AssignmentResponseModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseType, setResponseType] = useState<'ACCEPTED' | 'DECLINED' | null>(null);

  const handleSubmit = async (response: 'ACCEPTED' | 'DECLINED') => {
    setIsSubmitting(true);
    setResponseType(response);
    
    try {
      await onSubmit(response, notes.trim() || undefined);
      toast.success(`Assignment ${response.toLowerCase()} successfully`);
      handleClose();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(`Failed to ${response.toLowerCase()} assignment`);
    } finally {
      setIsSubmitting(false);
      setResponseType(null);
    }
  };

  const handleClose = () => {
    setNotes("");
    setResponseType(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Respond to Assignment</DialogTitle>
          <DialogDescription>
            Mission: <strong>{missionTitle}</strong>
            <br />
            Please choose your response and add any notes if needed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any comments or notes about your response..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit('DECLINED')}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting && responseType === 'DECLINED' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            Decline
          </Button>
          <Button
            onClick={() => handleSubmit('ACCEPTED')}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting && responseType === 'ACCEPTED' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}