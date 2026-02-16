import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Save,
  Info,
} from "lucide-react";
import { 
  permissions, 
  rolePermissions, 
  roleLabels, 
  UserRole,
  Permission,
  RolePermission,
} from "@/lib/mockData";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminRoles() {
  const [rolePerms, setRolePerms] = useState<RolePermission[]>(rolePermissions);
  const roles = Object.keys(roleLabels) as UserRole[];
  
  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const hasPermission = (role: UserRole, permissionId: string) => {
    const roleData = rolePerms.find(r => r.role === role);
    return roleData?.permissions.includes(permissionId) || false;
  };

  const togglePermission = (role: UserRole, permissionId: string) => {
    setRolePerms(prev => prev.map(r => {
      if (r.role === role) {
        const hasIt = r.permissions.includes(permissionId);
        return {
          ...r,
          permissions: hasIt 
            ? r.permissions.filter(p => p !== permissionId)
            : [...r.permissions, permissionId]
        };
      }
      return r;
    }));
  };

  const handleSave = () => {
    toast.success("Permissions updated successfully");
  };

  const getPermissionCount = (role: UserRole) => {
    const roleData = rolePerms.find(r => r.role === role);
    return roleData?.permissions.length || 0;
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">
              Define access rights for each role
            </p>
          </div>
          
          <Button onClick={handleSave} className="btn-gov-primary gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        {/* Role Cards Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {roles.map((role) => (
            <Card key={role} className="card-gov">
              <CardContent className="p-4 text-center">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm">{roleLabels[role]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getPermissionCount(role)} permissions
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card className="card-gov">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Permissions Matrix
            </CardTitle>
            <CardDescription>
              Check boxes to enable permissions by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm min-w-[200px]">
                      Permission
                    </th>
                    {roles.map((role) => (
                      <th key={role} className="text-center py-3 px-2 font-semibold text-xs min-w-[100px]">
                        <span className="inline-block max-w-[90px] truncate">
                          {roleLabels[role]}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissionsByModule).map(([module, modulePerms]) => (
                    <>
                      <tr key={module} className="bg-muted/50">
                        <td colSpan={roles.length + 1} className="py-2 px-4">
                          <span className="font-semibold text-sm text-primary">
                            {module}
                          </span>
                        </td>
                      </tr>
                      {modulePerms.map((perm) => (
                        <tr key={perm.id} className="border-b border-muted hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{perm.name}</span>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-[200px]">{perm.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                          {roles.map((role) => (
                            <td key={`${role}-${perm.id}`} className="text-center py-3 px-2">
                              <Checkbox
                                checked={hasPermission(role, perm.id)}
                                onCheckedChange={() => togglePermission(role, perm.id)}
                                disabled={role === 'admin'} // Admin always has all permissions
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="card-gov">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center text-sm">
              <span className="font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">Permission granted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-muted"></div>
                <span className="text-muted-foreground">Permission denied</span>
              </div>
              <Badge variant="outline" className="ml-auto">
                <Info className="h-3 w-3 mr-1" />
                Administrator has all permissions
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
