import { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { UserRole } from "@/lib/mockData";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
}

export function DashboardLayout({
  children,
  title = "",
  subtitle,
  userRole,
  userName = "Utilisateur",
  userEmail = "utilisateur@rnp.bi",
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar 
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
