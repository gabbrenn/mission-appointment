import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  FileText,
  MessageSquare,
  Search,
  Video,
  Book,
  ChevronRight,
  ExternalLink,
  Send,
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdate: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminSupport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);

  const [faqs] = useState<FAQ[]>([
    { id: '1', question: "How to submit a mission request?", answer: "Go to the employee dashboard, click on 'New Mission' and fill out the form with the required details.", category: 'Missions', views: 245 },
    { id: '2', question: "How to request a substitution?", answer: "In the mission details, click on 'Request Substitution' and provide the reason and supporting documents.", category: 'Substitutions', views: 189 },
    { id: '3', question: "What is the standard approval timeframe?", answer: "The standard timeframe is 3-5 business days, going through the department head, finance, HR, and director.", category: 'Approvals', views: 312 },
    { id: '4', question: "How to view my mission history?", answer: "Go to your profile and check the 'Mission History' tab to see all your past missions.", category: 'General', views: 156 },
    { id: '5', question: "How to update my personal information?", answer: "Access your profile via the menu and update your information in the 'Profile' tab.", category: 'Account', views: 98 },
  ]);

  const [tickets] = useState<SupportTicket[]>([
    { id: 'TKT-001', subject: 'Unable to submit report', user: 'Jean Ndayisaba', priority: 'high', status: 'open', createdAt: '2026-01-20 10:30', lastUpdate: '2026-01-20 10:30' },
    { id: 'TKT-002', subject: 'Error downloading document', user: 'Marie Niyonzima', priority: 'medium', status: 'in_progress', createdAt: '2026-01-19 14:15', lastUpdate: '2026-01-20 09:00' },
    { id: 'TKT-003', subject: 'Password reset request', user: 'Emmanuel Bizimana', priority: 'low', status: 'resolved', createdAt: '2026-01-18 16:45', lastUpdate: '2026-01-19 08:30' },
    { id: 'TKT-004', subject: 'Question about per diem calculation', user: 'Claudine Hakizimana', priority: 'medium', status: 'open', createdAt: '2026-01-20 11:00', lastUpdate: '2026-01-20 11:00' },
  ]);

  const [announcements] = useState<Announcement[]>([
    { id: '1', title: 'Scheduled Maintenance', content: 'The system will be unavailable on January 25 from 02:00 to 04:00 for maintenance.', type: 'warning', startDate: '2026-01-20', endDate: '2026-01-25', isActive: true },
    { id: '2', title: 'New Feature', content: 'The new mission tracking interface is now available.', type: 'success', startDate: '2026-01-15', endDate: '2026-01-30', isActive: true },
    { id: '3', title: 'Reminder: Budget Closure', content: 'All January missions must be finalized before January 31.', type: 'info', startDate: '2026-01-20', endDate: '2026-01-31', isActive: true },
  ]);

  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'info', startDate: '', endDate: '' });

  const userGuides = [
    { title: 'Employee Guide', description: 'How to submit and manage your missions', icon: FileText },
    { title: 'Department Head Guide', description: 'Approval and team management', icon: Book },
    { title: 'Finance Guide', description: 'Budget validation and reports', icon: FileText },
    { title: 'HR Guide', description: 'Confirmation and mission equity', icon: Book },
  ];

  const videoTutorials = [
    { title: 'Getting started with the system', duration: '5:30', views: 456 },
    { title: 'Submit a mission', duration: '3:45', views: 312 },
    { title: 'Approval process', duration: '4:20', views: 287 },
    { title: 'Generate reports', duration: '6:15', views: 198 },
  ];

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer || !newFaq.category) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("FAQ added successfully");
    setIsAddFaqOpen(false);
    setNewFaq({ question: '', answer: '', category: '' });
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Announcement created successfully");
    setIsAddAnnouncementOpen(false);
    setNewAnnouncement({ title: '', content: '', type: 'info', startDate: '', endDate: '' });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="outline">Open</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-green-500">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case 'warning': return 'border-amber-200 bg-amber-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Support & Help
          </h1>
          <p className="text-muted-foreground">
            Manage FAQs, guides, tickets and announcements
          </p>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>
                      Manage answers to common questions
                    </CardDescription>
                  </div>
                  <Dialog open={isAddFaqOpen} onOpenChange={setIsAddFaqOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New FAQ</DialogTitle>
                        <DialogDescription>
                          Add a new frequently asked question
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Input
                            placeholder="Enter the question..."
                            value={newFaq.question}
                            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={newFaq.category}
                            onValueChange={(value) => setNewFaq({ ...newFaq, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Missions">Missions</SelectItem>
                              <SelectItem value="Substitutions">Substitutions</SelectItem>
                              <SelectItem value="Approvals">Approvals</SelectItem>
                              <SelectItem value="Account">Account</SelectItem>
                              <SelectItem value="General">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Answer</Label>
                          <Textarea
                            placeholder="Enter the answer..."
                            value={newFaq.answer}
                            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddFaqOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddFaq}>Add</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search in FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {faqs
                    .filter(faq => 
                      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{faq.category}</Badge>
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <p className="text-muted-foreground">{faq.answer}</p>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-sm text-muted-foreground">{faq.views} views</span>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Guides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    User Guides
                  </CardTitle>
                  <CardDescription>
                    Documentation by role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userGuides.map((guide, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <guide.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{guide.title}</p>
                          <p className="text-sm text-muted-foreground">{guide.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Guide
                  </Button>
                </CardContent>
              </Card>

              {/* Video Tutorials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Tutorials
                  </CardTitle>
                  <CardDescription>
                    Training videos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videoTutorials.map((video, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {video.duration} • {video.views} views
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Support Tickets
                </CardTitle>
                <CardDescription>
                  User assistance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell>{ticket.user}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{ticket.lastUpdate}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      Announcements
                    </CardTitle>
                    <CardDescription>
                      System messages for all users
                    </CardDescription>
                  </div>
                  <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            placeholder="Announcement title..."
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={newAnnouncement.type}
                            onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Information</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={newAnnouncement.startDate}
                              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={newAnnouncement.endDate}
                              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            placeholder="Announcement content..."
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddAnnouncementOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddAnnouncement}>Publish</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id}
                    className={`p-4 rounded-lg border ${getAnnouncementStyle(announcement.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Megaphone className="h-5 w-5" />
                        <div>
                          <h4 className="font-medium">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {announcement.startDate} - {announcement.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                          {announcement.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
