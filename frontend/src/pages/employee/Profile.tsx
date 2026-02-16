import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Edit,
  Save,
  Key,
  Bell,
  Globe,
  Calendar,
  Award,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { mockUsers } from "@/lib/mockData";
import { toast } from "sonner";

export default function EmployeeProfile() {
  // Mock current user
  const currentUser = mockUsers.find(u => u.role === 'employee') || mockUsers[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: '+257 79 123 456',
    department: currentUser.department,
  });
  
  const [isAvailable, setIsAvailable] = useState(currentUser.isAvailable);
  const [skills, setSkills] = useState(currentUser.skills);
  const [newSkill, setNewSkill] = useState("");
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    missionAssigned: true,
    approvalUpdates: true,
    reminders: true,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success("Skill added");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }
    toast.success("Password changed successfully");
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const missionHistory = [
    { title: 'Inspection Gitega', date: '2025-12-15', status: 'completed' },
    { title: 'Formation Ngozi', date: '2025-11-20', status: 'completed' },
    { title: 'Audit Bujumbura', date: '2025-10-05', status: 'completed' },
  ];

  return (
    <DashboardLayout userRole="employee">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      size="sm"
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {formData.firstName[0]}{formData.lastName[0]}
                      </span>
                    </div>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Department</Label>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={formData.department}
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Contact HR to modify your department
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                {/* Availability Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          For new missions
                        </p>
                      </div>
                      <Switch
                        checked={isAvailable}
                        onCheckedChange={(checked) => {
                          setIsAvailable(checked);
                          toast.success(checked ? 'You are now available' : 'You are now unavailable');
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm">Fairness Score</span>
                      </div>
                      <Badge variant="outline">{currentUser.fairnessScore}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Total Missions</span>
                      </div>
                      <span className="font-semibold">{currentUser.totalMissions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last Mission</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {currentUser.lastMissionDate || 'None'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Missions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Missions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {missionHistory.map((mission, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{mission.title}</p>
                            <p className="text-xs text-muted-foreground">{mission.date}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Skills</CardTitle>
                <CardDescription>
                  Manage your skills to improve mission assignments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Skills */}
                <div>
                  <Label className="mb-3 block">Current Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No skills added</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Add New Skill */}
                <div className="space-y-2">
                  <Label>Add a Skill</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Audit, Training, Logistics..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                </div>

                {/* Suggested Skills */}
                <div>
                  <Label className="mb-3 block">Suggested Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Inspection', 'Training', 'Audit', 'Logistics', 'Communication', 'Project Management', 'Advanced Excel', 'Report Writing']
                      .filter(s => !skills.includes(s))
                      .map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            setSkills([...skills, skill]);
                            toast.success(`Skill "${skill}" added`);
                          }}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
                <Button onClick={handleChangePassword}>
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your active connections
                    </p>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications by email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Types</h4>
                  <div className="flex items-center justify-between">
                    <span>New missions assigned</span>
                    <Switch
                      checked={notifications.missionAssigned}
                      onCheckedChange={(checked) => setNotifications({...notifications, missionAssigned: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approval updates</span>
                    <Switch
                      checked={notifications.approvalUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, approvalUpdates: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mission reminders</span>
                    <Switch
                      checked={notifications.reminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, reminders: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language and Region
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="rn">Kirundi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="Africa/Bujumbura">Africa/Bujumbura (CAT)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
