import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { missionService, Mission } from "@/services/mission.service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const APPROVABLE_STATUSES = new Set(["ASSIGNED", "IN_APPROVAL", "PENDING_ASSIGNMENT"]);

export default function AdminMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadMissions = async () => {
    try {
      setIsLoading(true);
      const data = await missionService.getAllMissions();
      setMissions(data);
    } catch (error) {
      console.error("Failed to load missions:", error);
      toast.error("Failed to load missions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const filtered = useMemo(() => {
    return missions.filter((mission) => {
      const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        mission.title.toLowerCase().includes(term) ||
        mission.missionNumber.toLowerCase().includes(term) ||
        mission.destination.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [missions, search, statusFilter]);

  const approveMission = async (missionId: string) => {
    try {
      setIsSubmittingId(missionId);
      await missionService.approveMission(missionId, "Approved by Admin from missions page");
      toast.success("Mission approved");
      await loadMissions();
    } catch (error) {
      console.error("Failed to approve mission:", error);
      toast.error("Failed to approve mission");
    } finally {
      setIsSubmittingId(null);
    }
  };

  const rejectMission = async (missionId: string) => {
    try {
      setIsSubmittingId(missionId);
      await missionService.rejectMission(missionId, "Rejected by Admin from missions page", "Admin rejected mission");
      toast.success("Mission rejected");
      await loadMissions();
    } catch (error) {
      console.error("Failed to reject mission:", error);
      toast.error("Failed to reject mission");
    } finally {
      setIsSubmittingId(null);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">View Missions</h1>
          <p className="text-muted-foreground">Review missions and approve or reject them.</p>
        </div>

        <Card className="card-gov">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search by title, mission number, or destination"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="PENDING_ASSIGNMENT">Pending Assignment</SelectItem>
                  <SelectItem value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem value="IN_APPROVAL">In Approval</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="text-lg">Missions ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading missions...</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">No missions found.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((mission) => {
                  const canApprove = APPROVABLE_STATUSES.has(mission.status);
                  const isSubmitting = isSubmittingId === mission.id;

                  return (
                    <div key={mission.id} className="rounded-lg border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{mission.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {mission.missionNumber} • {mission.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Department: {mission.department?.name || "N/A"}
                        </p>
                        <Badge variant="outline">{mission.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/admin/missions/${mission.id}`}>Details</Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approveMission(mission.id)}
                          disabled={!canApprove || isSubmitting}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMission(mission.id)}
                          disabled={!canApprove || isSubmitting}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
