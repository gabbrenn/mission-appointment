import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus,
  Pencil,
  Trash2,
  Bell,
  Mail,
  Send,
  Eye,
  Clock,
  Check,
  Code,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms';
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

interface NotificationLog {
  id: string;
  template: string;
  recipient: string;
  type: 'email' | 'push' | 'sms';
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
}

export default function AdminNotifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Mission Assigned',
      type: 'email',
      subject: 'New Mission: {{mission_title}}',
      body: 'Hello {{employee_name}},\n\nA new mission has been assigned to you:\n\n- Title: {{mission_title}}\n- Destination: {{destination}}\n- Dates: {{start_date}} - {{end_date}}\n- Budget: {{budget}} BIF\n\nPlease log in to the MAS system for more details.\n\nBest regards,\nRNP - National Postal Service',
      variables: ['employee_name', 'mission_title', 'destination', 'start_date', 'end_date', 'budget'],
      isActive: true,
    },
    {
      id: '2',
      name: 'Mission Approved',
      type: 'email',
      subject: 'Mission Approved: {{mission_title}}',
      body: 'Hello {{employee_name}},\n\nYour mission has been approved:\n\n- Mission: {{mission_title}}\n- Approved by: {{approver_name}}\n- Approval date: {{approval_date}}\n\nHave a good mission!\n\nBest regards,\nRNP',
      variables: ['employee_name', 'mission_title', 'approver_name', 'approval_date'],
      isActive: true,
    },
    {
      id: '3',
      name: 'Mission Rejected',
      type: 'email',
      subject: 'Mission Rejected: {{mission_title}}',
      body: 'Hello {{employee_name}},\n\nWe inform you that your mission request has been rejected:\n\n- Mission: {{mission_title}}\n- Reason: {{rejection_reason}}\n\nPlease contact your department head for more information.\n\nBest regards,\nRNP',
      variables: ['employee_name', 'mission_title', 'rejection_reason'],
      isActive: true,
    },
    {
      id: '4',
      name: 'Approval Reminder',
      type: 'push',
      subject: 'Pending approvals',
      body: 'You have {{pending_count}} missions pending approval.',
      variables: ['pending_count'],
      isActive: true,
    },
    {
      id: '5',
      name: 'Budget Alert',
      type: 'email',
      subject: 'Alert: Budget {{department}} at {{percentage}}%',
      body: 'Attention,\n\nThe {{department}} department budget has reached {{percentage}}% of its allocation.\n\nBudget used: {{used}} BIF\nTotal budget: {{total}} BIF\nRemaining: {{remaining}} BIF\n\nPlease take necessary measures.\n\nRNP Finance',
      variables: ['department', 'percentage', 'used', 'total', 'remaining'],
      isActive: true,
    },
  ]);

  const [logs] = useState<NotificationLog[]>([
    { id: '1', template: 'Mission Assigned', recipient: 'jean.ndayisaba@rnp.bi', type: 'email', status: 'sent', sentAt: '2026-01-20 14:30:00' },
    { id: '2', template: 'Mission Approved', recipient: 'marie.niyonzima@rnp.bi', type: 'email', status: 'sent', sentAt: '2026-01-20 14:15:00' },
    { id: '3', template: 'Approval Reminder', recipient: 'chef.dept@rnp.bi', type: 'push', status: 'sent', sentAt: '2026-01-20 14:00:00' },
    { id: '4', template: 'Budget Alert', recipient: 'finance@rnp.bi', type: 'email', status: 'failed', sentAt: '2026-01-20 13:45:00' },
    { id: '5', template: 'Mission Assigned', recipient: 'emmanuel.bizimana@rnp.bi', type: 'email', status: 'pending', sentAt: '2026-01-20 13:30:00' },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    subject: '',
    body: '',
  });

  const availableVariables = [
    { name: 'employee_name', description: 'Employee full name' },
    { name: 'mission_title', description: 'Mission title' },
    { name: 'destination', description: 'Mission destination' },
    { name: 'start_date', description: 'Start date' },
    { name: 'end_date', description: 'End date' },
    { name: 'budget', description: 'Allocated budget' },
    { name: 'department', description: 'Department name' },
    { name: 'approver_name', description: 'Approver name' },
    { name: 'approval_date', description: 'Approval date' },
    { name: 'rejection_reason', description: 'Rejection reason' },
  ];

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Template created successfully");
    setIsAddTemplateOpen(false);
    setNewTemplate({ name: '', type: 'email', subject: '', body: '' });
  };

  const handleToggleTemplate = (id: string) => {
    toast.success("Template status updated");
  };

  const handleSendTest = (template: NotificationTemplate) => {
    toast.success(`Test email sent for "${template.name}"`);
  };

  const insertVariable = (variable: string) => {
    const newBody = newTemplate.body + `{{${variable}}}`;
    setNewTemplate({ ...newTemplate, body: newBody });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'email': return <Badge className="bg-blue-500"><Mail className="h-3 w-3 mr-1" /> Email</Badge>;
      case 'push': return <Badge className="bg-purple-500"><Bell className="h-3 w-3 mr-1" /> Push</Badge>;
      case 'sms': return <Badge className="bg-green-500">SMS</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Sent</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'pending': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Notification Management
          </h1>
          <p className="text-muted-foreground">
            Notification templates and sending history
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Templates</p>
                  <p className="text-2xl font-bold">
                    {templates.filter(t => t.isActive).length}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sent Today</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Send className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>
                      Manage email and notification templates
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-48"
                      />
                    </div>
                    <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          New Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create Template</DialogTitle>
                          <DialogDescription>
                            Create a new notification template
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Template Name</Label>
                              <Input
                                placeholder="Ex: Mission Assigned"
                                value={newTemplate.name}
                                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={newTemplate.type}
                                onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="push">Push Notification</SelectItem>
                                  <SelectItem value="sms">SMS</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                              placeholder="Message subject..."
                              value={newTemplate.subject}
                              onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Message Body</Label>
                              <Select onValueChange={insertVariable}>
                                <SelectTrigger className="w-48">
                                  <SelectValue placeholder="Insert variable" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableVariables.map((v) => (
                                    <SelectItem key={v.name} value={v.name}>
                                      {`{{${v.name}}}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Textarea
                              placeholder="Message content..."
                              value={newTemplate.body}
                              onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                              rows={8}
                              className="font-mono text-sm"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddTemplate}>Create</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Variables</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getTypeBadge(template.type)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{template.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.variables.length} var.</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={template.isActive}
                            onCheckedChange={() => handleToggleTemplate(template.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingTemplate(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendTest(template)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>
                  Log of sent notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.sentAt}</TableCell>
                        <TableCell className="font-medium">{log.template}</TableCell>
                        <TableCell>{log.recipient}</TableCell>
                        <TableCell>{getTypeBadge(log.type)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Variables Tab */}
          <TabsContent value="variables" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Available Variables
                </CardTitle>
                <CardDescription>
                  Dynamic variables usable in templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variable</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableVariables.map((v, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono bg-muted px-2 py-1 rounded">
                          {`{{${v.name}}}`}
                        </TableCell>
                        <TableCell>{v.description}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {v.name === 'employee_name' && 'Jean Ndayisaba'}
                          {v.name === 'mission_title' && 'Inspection Gitega'}
                          {v.name === 'destination' && 'Gitega'}
                          {v.name === 'start_date' && '2026-01-25'}
                          {v.name === 'end_date' && '2026-01-30'}
                          {v.name === 'budget' && '500,000'}
                          {v.name === 'department' && 'Opérations'}
                          {v.name === 'approver_name' && 'Marie Niyonzima'}
                          {v.name === 'approval_date' && '2026-01-20'}
                          {v.name === 'rejection_reason' && 'Budget insuffisant'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
            </DialogHeader>
            {previewTemplate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTypeBadge(previewTemplate.type)}
                  <Badge variant={previewTemplate.isActive ? 'default' : 'secondary'}>
                    {previewTemplate.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <div className="p-3 bg-muted rounded-lg font-medium">
                    {previewTemplate.subject}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap font-mono text-sm">
                    {previewTemplate.body}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Used variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.variables.map((v, i) => (
                      <Badge key={i} variant="outline" className="font-mono">
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
              <Button onClick={() => previewTemplate && handleSendTest(previewTemplate)}>
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
