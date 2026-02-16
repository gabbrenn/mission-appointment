import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Auth Pages
import PasswordReset from "./pages/auth/PasswordReset";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MissionsList from "./pages/employee/MissionsList";
import MissionDetails from "./pages/employee/MissionDetails";
import SubstitutionForm from "./pages/employee/SubstitutionForm";
import ReportForm from "./pages/employee/ReportForm";
import ReportsList from "./pages/employee/ReportsList";
import Profile from "./pages/employee/Profile";

// Department Head Pages
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import DepartmentMissionsList from "./pages/department/MissionsList";
import CreateMission from "./pages/department/CreateMission";
import ApprovalPage from "./pages/department/ApprovalPage";
import SubstitutionReview from "./pages/department/SubstitutionReview";
import TeamView from "./pages/department/TeamView";
import DepartmentReports from "./pages/department/DepartmentReports";

// Finance Pages
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import PendingApprovals from "./pages/finance/PendingApprovals";
import BudgetApproval from "./pages/finance/BudgetApproval";
import ExpenseReview from "./pages/finance/ExpenseReview";
import FinanceReports from "./pages/finance/FinanceReports";

// HR Pages
import HRDashboard from "./pages/hr/HRDashboard";
import PendingConfirmations from "./pages/hr/PendingConfirmations";
import HRConfirmation from "./pages/hr/HRConfirmation";
import EmployeeManagement from "./pages/hr/EmployeeManagement";
import FairnessAnalytics from "./pages/hr/FairnessAnalytics";

// Director Pages
import DirectorDashboard from "./pages/director/DirectorDashboard";
import ApprovalsList from "./pages/director/ApprovalsList";
import FinalApproval from "./pages/director/FinalApproval";
import MissionMap from "./pages/director/MissionMap";
import DirectorAnalytics from "./pages/director/DirectorAnalytics";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminConfig from "./pages/admin/AdminConfig";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminNotifications from "./pages/admin/AdminNotifications";

// Shared Pages
import Notifications from "./pages/shared/Notifications";
import Help from "./pages/shared/Help";
import Settings from "./pages/shared/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Employee Routes */}
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employee/missions" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <MissionsList />
              </ProtectedRoute>
            } />
            <Route path="/employee/mission/:id" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <MissionDetails />
              </ProtectedRoute>
            } />
            <Route path="/employee/substitution/:missionId" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <SubstitutionForm />
              </ProtectedRoute>
            } />
            <Route path="/employee/report/:missionId" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <ReportForm />
              </ProtectedRoute>
            } />
            <Route path="/employee/reports" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE', 'DEPARTMENT_HEAD', 'ADMIN']}>
                <ReportsList />
              </ProtectedRoute>
            } />
            <Route path="/employee/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Department Head Routes */}
            <Route path="/department" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/department/missions" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <DepartmentMissionsList />
              </ProtectedRoute>
            } />
            <Route path="/department/create-mission" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <CreateMission />
              </ProtectedRoute>
            } />
            <Route path="/department/approval/:id" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <ApprovalPage />
              </ProtectedRoute>
            } />
            <Route path="/department/substitution-review/:id" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <SubstitutionReview />
              </ProtectedRoute>
            } />
            <Route path="/department/team" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <TeamView />
              </ProtectedRoute>
            } />
            <Route path="/department/reports" element={
              <ProtectedRoute allowedRoles={['DEPARTMENT_HEAD', 'ADMIN']}>
                <DepartmentReports />
              </ProtectedRoute>
            } />
            
            {/* Finance Routes */}
            <Route path="/finance" element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                <FinanceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/finance/pending" element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                <PendingApprovals />
              </ProtectedRoute>
            } />
            <Route path="/finance/approval/:id" element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                <BudgetApproval />
              </ProtectedRoute>
            } />
            <Route path="/finance/expenses" element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                <ExpenseReview />
              </ProtectedRoute>
            } />
            <Route path="/finance/reports" element={
              <ProtectedRoute allowedRoles={['FINANCE', 'ADMIN']}>
                <FinanceReports />
              </ProtectedRoute>
            } />
            
            {/* HR Routes */}
            <Route path="/hr" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <HRDashboard />
              </ProtectedRoute>
            } />
            <Route path="/hr/pending" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <PendingConfirmations />
              </ProtectedRoute>
            } />
            <Route path="/hr/confirmation/:id" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <HRConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/hr/employees" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <EmployeeManagement />
              </ProtectedRoute>
            } />
            <Route path="/hr/analytics" element={
              <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                <FairnessAnalytics />
              </ProtectedRoute>
            } />
            
            {/* Director Routes */}
            <Route path="/director" element={
              <ProtectedRoute allowedRoles={['DIRECTOR_GENERAL', 'ADMIN']}>
                <DirectorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/director/approvals" element={
              <ProtectedRoute allowedRoles={['DIRECTOR_GENERAL', 'ADMIN']}>
                <ApprovalsList />
              </ProtectedRoute>
            } />
            <Route path="/director/approval/:id" element={
              <ProtectedRoute allowedRoles={['DIRECTOR_GENERAL', 'ADMIN']}>
                <FinalApproval />
              </ProtectedRoute>
            } />
            <Route path="/director/map" element={
              <ProtectedRoute allowedRoles={['DIRECTOR_GENERAL', 'ADMIN']}>
                <MissionMap />
              </ProtectedRoute>
            } />
            <Route path="/director/analytics" element={
              <ProtectedRoute allowedRoles={['DIRECTOR_GENERAL', 'ADMIN']}>
                <DirectorAnalytics />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRoles />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDepartments />
              </ProtectedRoute>
            } />
            <Route path="/admin/config" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminConfig />
              </ProtectedRoute>
            } />
            <Route path="/admin/audit" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminAudit />
              </ProtectedRoute>
            } />
            <Route path="/admin/maintenance" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminMaintenance />
              </ProtectedRoute>
            } />
            <Route path="/admin/support" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminSupport />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminNotifications />
              </ProtectedRoute>
            } />
            
            {/* Shared Routes */}
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
