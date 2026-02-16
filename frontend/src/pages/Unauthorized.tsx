/**
 * Unauthorized Page
 * Shown when user tries to access a route they don't have permission for
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    // Navigate to user's default dashboard based on role
    const roleRoutes: Record<string, string> = {
      ADMIN: '/admin',
      DIRECTOR_GENERAL: '/director',
      DEPARTMENT_HEAD: '/department',
      FINANCE: '/finance',
      HR: '/hr',
      EMPLOYEE: '/employee',
    };

    const route = user ? roleRoutes[user.role] || '/employee' : '/login';
    navigate(route);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Access Denied
        </h1>
        
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleGoBack} className="btn-gov-primary">
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
