import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { userService } from "@/services/user.service";

export default function FirstLogin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && user.isFirstLogin === false) {
      // If user reaches here but not first login, redirect them back
      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin',
      };
      navigate(roleRoutes[user.role] || '/employee', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Check password strength (optional but recommended)
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error("Password must contain uppercase, lowercase and numbers");
      return;
    }

    setIsLoading(true);
    
    try {
      if (user?.id) {
        await userService.updateUser(user.id, { password: newPassword });
        toast.success("Password set successfully!");
        
        // Mark first login as complete locally to avoid redirects
        user.isFirstLogin = false;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate based on role
        const roleRoutes: Record<string, string> = {
          ADMIN: '/admin',
        };
        navigate(roleRoutes[user.role] || '/employee', { replace: true });
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription className="text-base">
            For security reasons, please set a new password before accessing your account for the first time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Password requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${newPassword.length >= 8 ? 'text-green-500' : 'opacity-30'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'opacity-30'}`} />
                  One uppercase letter (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'opacity-30'}`} />
                  One lowercase letter (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'opacity-30'}`} />
                  One number (0-9)
                </li>
              </ul>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-gov-primary h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Set Password & Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
