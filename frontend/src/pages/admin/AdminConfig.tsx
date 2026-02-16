import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  DollarSign,
  Bell,
  Server,
  Briefcase,
  Save,
} from "lucide-react";
import { mockSystemConfig, SystemConfig } from "@/lib/mockData";
import { toast } from "sonner";

const categoryIcons: Record<string, React.ElementType> = {
  'Budget': DollarSign,
  'Missions': Briefcase,
  'Notifications': Bell,
  'Système': Server,
};

export default function AdminConfig() {
  const [configs, setConfigs] = useState<SystemConfig[]>(mockSystemConfig);
  
  // Group configs by category
  const configsByCategory = configs.reduce((acc, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {} as Record<string, SystemConfig[]>);

  const updateConfig = (id: string, value: string) => {
    setConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, value } : c
    ));
  };

  const handleSave = () => {
    toast.success("Configuration saved successfully");
  };

  const renderConfigInput = (config: SystemConfig) => {
    switch (config.type) {
      case 'boolean':
        return (
          <Switch
            checked={config.value === 'true'}
            onCheckedChange={(checked) => updateConfig(config.id, checked ? 'true' : 'false')}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={config.value}
            onChange={(e) => updateConfig(config.id, e.target.value)}
            className="w-40"
          />
        );
      case 'select':
        return (
          <Select
            value={config.value}
            onValueChange={(value) => updateConfig(config.id, value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            value={config.value}
            onChange={(e) => updateConfig(config.id, e.target.value)}
            className="w-60"
          />
        );
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              System Configuration
            </h1>
            <p className="text-muted-foreground">
              General application settings
            </p>
          </div>
          
          <Button onClick={handleSave} className="btn-gov-primary gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>

        {/* Config Panels */}
        <div className="grid gap-6">
          {Object.entries(configsByCategory).map(([category, categoryConfigs]) => {
            const Icon = categoryIcons[category] || Settings;
            return (
              <Card key={category} className="card-gov">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {category}
                  </CardTitle>
                  <CardDescription>
                    Settings related to {category.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {categoryConfigs.map((config) => (
                      <div 
                        key={config.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="space-y-1">
                          <Label className="font-medium">{config.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {renderConfigInput(config)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Danger Zone */}
        <Card className="card-gov border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <Server className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions - use with caution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div>
                <p className="font-medium text-destructive">Reset database</p>
                <p className="text-sm text-muted-foreground">
                  Deletes all data and resets the system to zero
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
