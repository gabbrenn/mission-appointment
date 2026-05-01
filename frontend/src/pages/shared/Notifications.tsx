import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  FileText,
  Users,
  DollarSign,
  AlertTriangle,
  Info,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/mockData";
import { useNotifications } from "@/hooks/use-notifications";
import { formatNotificationTime } from "@/lib/notifications";

export default function Notifications() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = useMemo(() => notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  }), [filter, notifications]);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    removeNotification(id);
    toast.success("Notification deleted");
  };

  const handleAction = (notification: { id: string; actionUrl?: string }) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mission': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'approval': return <Check className="h-5 w-5 text-green-500" />;
      case 'budget': return <DollarSign className="h-5 w-5 text-amber-500" />;
      case 'system': return <Info className="h-5 w-5 text-purple-500" />;
      case 'reminder': return <Calendar className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      mission: 'Mission',
      approval: 'Approval',
      budget: 'Budget',
      system: 'System',
      reminder: 'Reminder',
    };
    return labels[type] || type;
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-amber-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All notifications are read'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
              </div>

              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="mission">Missions</SelectItem>
                  <SelectItem value="approval">Approvals</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="reminder">Reminders</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline">
                {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You have no notifications matching this filter.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`
                  ${getPriorityStyle(notification.priority)}
                  ${!notification.isRead ? 'bg-primary/5' : ''}
                  transition-all hover:shadow-md
                `}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatNotificationTime(notification.timestamp)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getTypeBadge(notification.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {notification.actionUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAction(notification)}
                        >
                          View
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
