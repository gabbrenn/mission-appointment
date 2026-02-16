import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  HelpCircle,
  Book,
  Video,
  MessageSquare,
  Search,
  ExternalLink,
  Send,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  FileText,
  Users,
  DollarSign,
  Settings,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: '',
    message: '',
  });

  const faqs = [
    {
      category: 'Missions',
      questions: [
        {
          q: "How do I submit a mission request?",
          a: "Go to the employee dashboard, click on 'New Mission' and fill out the form with all required details (destination, dates, estimated budget). The request will be automatically sent to your department head for approval."
        },
        {
          q: "How long does mission approval take?",
          a: "The standard timeframe is 3-5 business days. The request goes through 4 levels: Department Head, Finance, HR, and Director. You can track progress in your mission details."
        },
        {
          q: "Can I modify a mission after submission?",
          a: "You cannot directly modify a mission under approval. Contact your department head who can request modifications or ask you to submit a new request."
        },
      ]
    },
    {
      category: 'Substitutions',
      questions: [
        {
          q: "How do I request a substitution?",
          a: "In your assigned mission details, click on 'Request Substitution'. Select the reason, provide an explanation and upload any supporting documents (medical certificate, etc.)."
        },
        {
          q: "What are valid reasons for a substitution?",
          a: "Accepted reasons include: medical reason (with certificate), family emergency, professional schedule conflict, or other justified reason. Supporting documentation is required."
        },
      ]
    },
    {
      category: 'Budget',
      questions: [
        {
          q: "How is a mission budget calculated?",
          a: "The budget includes: transport (based on destination), accommodation (daily rate), per diem (daily allowance), and other expenses. Amounts are based on official RNP rates."
        },
        {
          q: "What should I do if my expenses exceed the budget?",
          a: "Any overage must be justified in your mission report. A significant overage requires prior approval from the finance department. Contact your department head before incurring additional expenses."
        },
      ]
    },
    {
      category: 'Reports',
      questions: [
        {
          q: "When should I submit my mission report?",
          a: "The report must be submitted within 5 business days following the end of your mission. It must include the activity summary, actual expenses with receipts, and observations."
        },
        {
          q: "What documents should I attach to the report?",
          a: "Attach all receipts and invoices for expenses, the signed activity report, and any other relevant documents (photos, certificates, etc.)."
        },
      ]
    },
  ];

  const guides = [
    { 
      title: 'Employee Guide', 
      description: 'Everything you need to know to manage your missions', 
      icon: FileText,
      sections: ['Submit a mission', 'Track approval', 'Mission reports']
    },
    { 
      title: 'Department Head Guide', 
      description: 'Team management and approvals', 
      icon: Users,
      sections: ['Approve missions', 'Manage substitutions', 'Team reports']
    },
    { 
      title: 'Finance Guide', 
      description: 'Budget validation and financial tracking', 
      icon: DollarSign,
      sections: ['Budget validation', 'Expense tracking', 'Financial reports']
    },
    { 
      title: 'Administrator Guide', 
      description: 'System configuration and maintenance', 
      icon: Settings,
      sections: ['User management', 'System configuration', 'Audit and security']
    },
  ];

  const videos = [
    { title: 'Getting Started with MAS System', duration: '5:30', thumbnail: '🎬' },
    { title: 'How to Submit a Mission', duration: '3:45', thumbnail: '📋' },
    { title: 'Approval Process Explained', duration: '4:20', thumbnail: '✅' },
    { title: 'Create and Submit a Report', duration: '6:15', thumbnail: '📝' },
    { title: 'Request a Substitution', duration: '2:50', thumbnail: '🔄' },
    { title: 'Settings and Notifications', duration: '3:00', thumbnail: '⚙️' },
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.category || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Your message has been sent. We will respond as soon as possible.");
    setContactForm({ subject: '', category: '', message: '' });
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8" />
            Help Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Find answers to your questions and learn how to use the MAS system
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="videos">Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No results</h3>
                  <p className="text-muted-foreground">
                    No questions match your search.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                          <AccordionTrigger className="text-left">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{faq.a}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {guides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <guide.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guide.sections.map((section, sIndex) => (
                        <li key={sIndex} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                          <ChevronRight className="h-4 w-4" />
                          {section}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      Read Guide
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {videos.map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <span className="text-4xl">{video.thumbnail}</span>
                    </div>
                    <h4 className="font-medium mb-1">{video.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">support@rnp.bi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">+257 22 22 22 22</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">Avenue de l'Indépendance, Bujumbura</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">Support Hours</p>
                    <p>Mon - Fri: 08:00 - 17:00</p>
                    <p>Sat: 08:00 - 12:00</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    We will respond within 24 business hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        placeholder="Subject of your request..."
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="mission">Mission Question</SelectItem>
                          <SelectItem value="budget">Budget Question</SelectItem>
                          <SelectItem value="account">Account Problem</SelectItem>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Describe your problem or question in detail..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <Button onClick={handleContactSubmit} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
