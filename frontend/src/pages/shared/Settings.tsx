import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Palette,
  Shield,
  Key,
  Save,
  Camera,
  Mail,
  Phone,
  Building,
  Sun,
  Moon,
  Monitor,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { UserRole } from "@/lib/mockData";

interface UserData {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  position?: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export default function Settings() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });

  const [notifications, setNotifications] = useState({
    emailMissionApproved: true,
    emailMissionRejected: true,
    emailNewAssignment: true,
    emailReminders: true,
    pushMissionApproved: true,
    pushMissionRejected: true,
    pushNewAssignment: true,
    pushReminders: false,
    dailyDigest: false,
    weeklyReport: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Africa/Bujumbura',
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        const response = await userService.getUserById(authUser.id) as unknown as UserData;
        setUserData(response);
        
        // Update profile state with fetched data
        setProfile({
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || '',
          phone: response.phone || '',
          department: response.department?.name || '',
          position: response.position || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  const handleSaveProfile = async () => {
    if (!userData?.id) return;
    
    try {
      setSaving(true);
      await userService.updateUser(userData.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone || undefined,
        position: profile.position || undefined,
      });
      
      // Refresh user data
      const updatedUser = await userService.getUserById(userData.id) as unknown as UserData;
      setUserData(updatedUser);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Préférences de notification enregistrées");
  };

  const handleSavePreferences = () => {
    toast.success("Préférences enregistrées");
  };

  const handleChangePassword = () => {
    toast.success("A reset email has been sent");
  };

  const themeOptions = [
    { value: 'light', label: 'Clair', icon: Sun },
    { value: 'dark', label: 'Sombre', icon: Moon },
    { value: 'system', label: 'Système', icon: Monitor },
  ];

  // Map user role to DashboardLayout role
  const getUserRole = (): UserRole => {
    if (!authUser?.role) return 'employee';
    const roleMap: Record<string, UserRole> = {
      'ADMIN': 'admin',
      'DIRECTOR': 'director',
      'DIRECTOR_GENERAL': 'director',
      'HEAD_OF_DEPARTMENT': 'department_head',
      'DEPARTMENT_HEAD': 'department_head',
      'FINANCE': 'finance',
      'HR': 'hr',
      'EMPLOYEE': 'employee',
    };
    return roleMap[authUser.role] || 'employee';
  };

  return (
    <DashboardLayout userRole={getUserRole()}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, notifications, and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Palette className="h-4 w-4" />
              Préférences
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </div>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        {profile.position && (
                          <p className="text-muted-foreground">{profile.position}</p>
                        )}
                        {profile.department && (
                          <Badge variant="outline" className="mt-1">{profile.department}</Badge>
                        )}
                        {userData?.role && (
                          <Badge variant="secondary" className="mt-1 ml-2">{userData.role}</Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            className="pl-10"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="+257 79 123 456"
                          />
                        </div>
                      </div>
                      {profile.department && (
                        <div className="space-y-2">
                          <Label>Département</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              value={profile.department}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Poste</Label>
                        <Input 
                          value={profile.position} 
                          onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                          placeholder="Your position"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications par Email</CardTitle>
                <CardDescription>
                  Choose which notifications to receive by email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mission Approved</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when a mission is approved
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailMissionApproved}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailMissionApproved: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mission Rejected</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when a mission is rejected
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailMissionRejected}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailMissionRejected: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Mission Assigned</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email for new assignments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNewAssignment}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailNewAssignment: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rappels</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders for deadlines
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailReminders: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications Push</CardTitle>
                <CardDescription>
                  Choisissez les notifications push dans l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mission Approuvée</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushMissionApproved}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, pushMissionApproved: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mission Rejetée</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushMissionRejected}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, pushMissionRejected: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nouvelle Mission Assignée</Label>
                    <p className="text-sm text-muted-foreground">
                      Notification dans l'application
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNewAssignment}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, pushNewAssignment: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumés</CardTitle>
                <CardDescription>
                  Receive periodic summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Résumé Quotidien</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary every day at 8am
                    </p>
                  </div>
                  <Switch
                    checked={notifications.dailyDigest}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, dailyDigest: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rapport Hebdomadaire</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a report every Monday
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, weeklyReport: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les Préférences
              </Button>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Langue et Région
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="en">🇬🇧 English</SelectItem>
                        <SelectItem value="rn">🇧🇮 Kirundi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuseau Horaire</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Bujumbura">Bujumbura (CAT, UTC+2)</SelectItem>
                        <SelectItem value="Africa/Nairobi">Nairobi (EAT, UTC+3)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET, UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format de Date</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">25/01/2025</SelectItem>
                        <SelectItem value="MM/DD/YYYY">01/25/2025</SelectItem>
                        <SelectItem value="YYYY-MM-DD">2025-01-25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPreferences({ ...preferences, theme: option.value })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          preferences.theme === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <option.icon className="h-8 w-8" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {preferences.theme === option.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSavePreferences}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Mot de Passe
                </CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pour des raisons de sécurité, vous recevrez un email avec un lien de réinitialisation.
                </p>
                <Button variant="outline" onClick={handleChangePassword}>
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentification à Deux Facteurs
                </CardTitle>
                <CardDescription>
                  Ajoutez une couche de sécurité supplémentaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activer 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser une application d'authentification
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => 
                      setSecurity({ ...security, twoFactorEnabled: checked })
                    }
                  />
                </div>
                {security.twoFactorEnabled && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      Scannez le code QR avec votre application d'authentification (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="w-32 h-32 bg-white mx-auto mt-4 rounded-lg flex items-center justify-center text-4xl">
                      📱
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session</CardTitle>
                <CardDescription>
                  Manage your active session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Délai d'Expiration de Session</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-destructive">Déconnecter Toutes les Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Déconnecte tous les appareils sauf celui-ci
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
