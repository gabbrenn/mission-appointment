// Mock data for RNP Mission Appointment System
// Burundian names, cities, departments, and currency (BIF)

export type UserRole = 'employee' | 'department_head' | 'finance' | 'hr' | 'director' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  skills: string[];
  fairnessScore: number;
  totalMissions: number;
  lastMissionDate: string | null;
  isAvailable: boolean;
  status?: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
}

export interface Mission {
  id: string;
  title: string;
  type: 'inspection' | 'formation' | 'reunion' | 'audit' | 'livraison';
  destination: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: User;
  budget: number;
  budgetCode: string;
  department: string;
  description: string;
  requiredSkills: string[];
  approvalStatus: ApprovalStep[];
}

export interface ApprovalStep {
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  date?: string;
  comment?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approval';
}

export interface SystemConfig {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: string[];
}

export interface burundiCities {
  id: string;
  name: string;
}

export const departments = [
  'Distribution',
  'Logistics', 
  'Finance',
  'Human Resources',
  'Customer Service',
  'IT',
  'Administration',
];

export const cities = [
  'Bujumbura',
  'Gitega',
  'Ngozi',
  'Muyinga',
  'Rumonge',
  'Bururi',
  'Kayanza',
  'Makamba',
  'Cibitoke',
  'Bubanza',
];

export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Bujumbura': { lat: -3.3614, lng: 29.3599 },
  'Gitega': { lat: -3.4264, lng: 29.9246 },
  'Ngozi': { lat: -2.9075, lng: 29.8306 },
  'Muyinga': { lat: -2.8447, lng: 30.3472 },
  'Rumonge': { lat: -3.9736, lng: 29.4386 },
  'Bururi': { lat: -3.9489, lng: 29.6244 },
  'Kayanza': { lat: -2.9220, lng: 29.6294 },
  'Makamba': { lat: -4.1347, lng: 29.8031 },
  'Cibitoke': { lat: -2.8869, lng: 29.1228 },
  'Bubanza': { lat: -3.0783, lng: 29.3922 },
};

export const skills = [
  'Project Management',
  'Financial Audit',
  'Training',
  'Logistics',
  'Communication',
  'IT',
  'Customer Service',
  'Accounting',
  'Management',
  'Writing',
];

export const missionTypes = {
  inspection: 'Inspection',
  formation: 'Training',
  reunion: 'Meeting',
  audit: 'Audit',
  livraison: 'Special Delivery',
};

export const roleLabels: Record<UserRole, string> = {
  employee: 'Employee',
  department_head: 'Department Head',
  finance: 'Finance Officer',
  hr: 'HR Officer',
  director: 'Director',
  admin: 'Administrator',
};

// Permissions list
export const permissions: Permission[] = [
  { id: 'missions.view', name: 'View Missions', description: 'Can view missions', module: 'Missions' },
  { id: 'missions.create', name: 'Create Missions', description: 'Can create new missions', module: 'Missions' },
  { id: 'missions.approve', name: 'Approve Missions', description: 'Can approve/reject missions', module: 'Missions' },
  { id: 'missions.assign', name: 'Assign Missions', description: 'Can assign employees to missions', module: 'Missions' },
  { id: 'budget.view', name: 'View Budget', description: 'Can view budget information', module: 'Budget' },
  { id: 'budget.approve', name: 'Approve Budget', description: 'Can approve mission budgets', module: 'Budget' },
  { id: 'users.view', name: 'View Users', description: 'Can view user list', module: 'Users' },
  { id: 'users.create', name: 'Create Users', description: 'Can create new users', module: 'Users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Can edit existing users', module: 'Users' },
  { id: 'users.delete', name: 'Delete Users', description: 'Can delete users', module: 'Users' },
  { id: 'roles.manage', name: 'Manage Roles', description: 'Can manage roles and permissions', module: 'Roles' },
  { id: 'config.view', name: 'View Configuration', description: 'Can view system configuration', module: 'Configuration' },
  { id: 'config.edit', name: 'Edit Configuration', description: 'Can modify system configuration', module: 'Configuration' },
  { id: 'audit.view', name: 'View Audit Logs', description: 'Can view audit logs', module: 'Audit' },
  { id: 'reports.view', name: 'View Reports', description: 'Can view reports', module: 'Reports' },
  { id: 'reports.export', name: 'Export Reports', description: 'Can export reports', module: 'Reports' },
];

// Role permissions mapping
export const rolePermissions: RolePermission[] = [
  { 
    role: 'employee', 
    permissions: ['missions.view', 'reports.view'] 
  },
  { 
    role: 'department_head', 
    permissions: ['missions.view', 'missions.create', 'missions.assign', 'users.view', 'reports.view', 'reports.export'] 
  },
  { 
    role: 'finance', 
    permissions: ['missions.view', 'budget.view', 'budget.approve', 'reports.view', 'reports.export'] 
  },
  { 
    role: 'hr', 
    permissions: ['missions.view', 'users.view', 'reports.view'] 
  },
  { 
    role: 'director', 
    permissions: ['missions.view', 'missions.approve', 'budget.view', 'budget.approve', 'users.view', 'reports.view', 'reports.export', 'audit.view'] 
  },
  { 
    role: 'admin', 
    permissions: permissions.map(p => p.id) 
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Jean-Pierre',
    lastName: 'Ndayisaba',
    email: 'jp.ndayisaba@rnp.bi',
    role: 'employee',
    department: 'Distribution',
    skills: ['Logistics', 'Customer Service'],
    fairnessScore: 85,
    totalMissions: 12,
    lastMissionDate: '2024-11-15',
    isAvailable: true,
    status: 'active',
    createdAt: '2023-03-15',
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Niyonzima',
    email: 'm.niyonzima@rnp.bi',
    role: 'employee',
    department: 'Distribution',
    skills: ['Training', 'Communication'],
    fairnessScore: 92,
    totalMissions: 8,
    lastMissionDate: '2024-10-20',
    isAvailable: true,
    status: 'active',
    createdAt: '2023-05-20',
  },
  {
    id: '3',
    firstName: 'Emmanuel',
    lastName: 'Bizimana',
    email: 'e.bizimana@rnp.bi',
    role: 'department_head',
    department: 'Distribution',
    skills: ['Management', 'Project Management'],
    fairnessScore: 78,
    totalMissions: 25,
    lastMissionDate: '2024-12-01',
    isAvailable: true,
    status: 'active',
    createdAt: '2022-01-10',
  },
  {
    id: '4',
    firstName: 'Claudine',
    lastName: 'Havyarimana',
    email: 'c.havyarimana@rnp.bi',
    role: 'finance',
    department: 'Finance',
    skills: ['Financial Audit', 'Accounting'],
    fairnessScore: 88,
    totalMissions: 15,
    lastMissionDate: '2024-11-28',
    isAvailable: true,
    status: 'active',
    createdAt: '2022-06-15',
  },
  {
    id: '5',
    firstName: 'Tharcisse',
    lastName: 'Ndikumana',
    email: 't.ndikumana@rnp.bi',
    role: 'hr',
    department: 'Human Resources',
    skills: ['Training', 'Management'],
    fairnessScore: 90,
    totalMissions: 10,
    lastMissionDate: '2024-11-10',
    isAvailable: true,
    status: 'active',
    createdAt: '2022-08-01',
  },
  {
    id: '6',
    firstName: 'Pascasie',
    lastName: 'Ntahomvukiye',
    email: 'p.ntahomvukiye@rnp.bi',
    role: 'director',
    department: 'Administration',
    skills: ['Management', 'Project Management', 'Communication'],
    fairnessScore: 75,
    totalMissions: 30,
    lastMissionDate: '2024-12-05',
    isAvailable: true,
    status: 'active',
    createdAt: '2021-01-15',
  },
  {
    id: '7',
    firstName: 'Alexis',
    lastName: 'Nkurunziza',
    email: 'a.nkurunziza@rnp.bi',
    role: 'admin',
    department: 'IT',
    skills: ['IT', 'Project Management'],
    fairnessScore: 95,
    totalMissions: 5,
    lastMissionDate: '2024-09-15',
    isAvailable: true,
    status: 'active',
    createdAt: '2021-06-01',
  },
  {
    id: '8',
    firstName: 'Diane',
    lastName: 'Irakoze',
    email: 'd.irakoze@rnp.bi',
    role: 'employee',
    department: 'Customer Service',
    skills: ['Customer Service', 'Communication'],
    fairnessScore: 88,
    totalMissions: 6,
    lastMissionDate: '2024-10-05',
    isAvailable: false,
    status: 'inactive',
    createdAt: '2023-09-01',
  },
];

// Mock Missions
export const mockMissions: Mission[] = [
  {
    id: 'M001',
    title: 'Post Office Inspection - Ngozi',
    type: 'inspection',
    destination: 'Ngozi',
    startDate: '2025-01-20',
    endDate: '2025-01-22',
    status: 'pending',
    budget: 450000,
    budgetCode: 'INSP-2025-001',
    department: 'Distribution',
    description: "Quarterly inspection of post offices in Ngozi province to assess service quality.",
    requiredSkills: ['Customer Service', 'Logistics'],
    approvalStatus: [
      { role: 'Department Head', status: 'approved', approver: 'Emmanuel Bizimana', date: '2025-01-10' },
      { role: 'Finance', status: 'approved', approver: 'Claudine Havyarimana', date: '2025-01-11' },
      { role: 'HR', status: 'approved', approver: 'Tharcisse Ndikumana', date: '2025-01-12' },
      { role: 'Director', status: 'pending' },
    ],
  },
  {
    id: 'M002',
    title: 'Customer Service Training - Gitega',
    type: 'formation',
    destination: 'Gitega',
    startDate: '2025-01-25',
    endDate: '2025-01-27',
    status: 'assigned',
    assignedTo: mockUsers[1],
    budget: 680000,
    budgetCode: 'FORM-2025-003',
    department: 'Distribution',
    description: "Training on new customer service procedures for Gitega staff.",
    requiredSkills: ['Training', 'Communication'],
    approvalStatus: [
      { role: 'Department Head', status: 'approved', approver: 'Emmanuel Bizimana', date: '2025-01-10' },
      { role: 'Finance', status: 'approved', approver: 'Claudine Havyarimana', date: '2025-01-11' },
      { role: 'HR', status: 'approved', approver: 'Tharcisse Ndikumana', date: '2025-01-12' },
      { role: 'Director', status: 'pending' },
    ],
  },
  {
    id: 'M003',
    title: 'Financial Audit - Bujumbura Center',
    type: 'audit',
    destination: 'Bujumbura',
    startDate: '2025-02-01',
    endDate: '2025-02-05',
    status: 'in_progress',
    assignedTo: mockUsers[0],
    budget: 520000,
    budgetCode: 'AUD-2025-001',
    department: 'Finance',
    description: "Annual audit of financial operations at the main office.",
    requiredSkills: ['Financial Audit', 'Accounting'],
    approvalStatus: [
      { role: 'Department Head', status: 'approved', approver: 'Emmanuel Bizimana', date: '2025-01-05' },
      { role: 'Finance', status: 'approved', approver: 'Claudine Havyarimana', date: '2025-01-06' },
      { role: 'HR', status: 'approved', approver: 'Tharcisse Ndikumana', date: '2025-01-07' },
      { role: 'Director', status: 'approved', approver: 'Pascasie Ntahomvukiye', date: '2025-01-08' },
    ],
  },
  {
    id: 'M004',
    title: 'Regional Coordination Meeting - Muyinga',
    type: 'reunion',
    destination: 'Muyinga',
    startDate: '2025-02-10',
    endDate: '2025-02-11',
    status: 'pending',
    budget: 320000,
    budgetCode: 'REU-2025-002',
    department: 'Administration',
    description: "Coordination meeting with regional managers from the East.",
    requiredSkills: ['Communication', 'Management'],
    approvalStatus: [
      { role: 'Department Head', status: 'pending' },
      { role: 'Finance', status: 'pending' },
      { role: 'HR', status: 'pending' },
      { role: 'Director', status: 'pending' },
    ],
  },
  {
    id: 'M005',
    title: 'Equipment Delivery - Kayanza',
    type: 'livraison',
    destination: 'Kayanza',
    startDate: '2025-01-28',
    endDate: '2025-01-29',
    status: 'pending',
    budget: 280000,
    budgetCode: 'LIV-2025-001',
    department: 'Logistics',
    description: "Delivery and installation of IT equipment at Kayanza office.",
    requiredSkills: ['Logistics', 'IT'],
    approvalStatus: [
      { role: 'Department Head', status: 'approved', approver: 'Emmanuel Bizimana', date: '2025-01-15' },
      { role: 'Finance', status: 'approved', approver: 'Claudine Havyarimana', date: '2025-01-16' },
      { role: 'HR', status: 'approved', approver: 'Tharcisse Ndikumana', date: '2025-01-17' },
      { role: 'Director', status: 'pending' },
    ],
  },
  {
    id: 'M006',
    title: 'Accounting Training - Bururi',
    type: 'formation',
    destination: 'Bururi',
    startDate: '2025-02-15',
    endDate: '2025-02-17',
    status: 'completed',
    assignedTo: mockUsers[3],
    budget: 550000,
    budgetCode: 'FORM-2025-004',
    department: 'Finance',
    description: "Training on new accounting standards for finance staff.",
    requiredSkills: ['Accounting', 'Training'],
    approvalStatus: [
      { role: 'Department Head', status: 'approved', approver: 'Emmanuel Bizimana', date: '2024-12-20' },
      { role: 'Finance', status: 'approved', approver: 'Claudine Havyarimana', date: '2024-12-21' },
      { role: 'HR', status: 'approved', approver: 'Tharcisse Ndikumana', date: '2024-12-22' },
      { role: 'Director', status: 'approved', approver: 'Pascasie Ntahomvukiye', date: '2024-12-23' },
    ],
  },
];

// Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AL001',
    action: 'User Creation',
    user: 'Alexis Nkurunziza',
    target: 'Marie Niyonzima',
    details: 'New user created with Employee role',
    timestamp: '2025-01-17T10:30:00',
    ipAddress: '192.168.1.45',
    type: 'create',
  },
  {
    id: 'AL002',
    action: 'Mission Approval',
    user: 'Pascasie Ntahomvukiye',
    target: 'Mission M003',
    details: 'Financial audit mission approved by director',
    timestamp: '2025-01-17T09:15:00',
    ipAddress: '192.168.1.10',
    type: 'approval',
  },
  {
    id: 'AL003',
    action: 'Configuration Update',
    user: 'Alexis Nkurunziza',
    target: 'Maximum Budget',
    details: 'Value changed from 1,000,000 to 1,500,000 BIF',
    timestamp: '2025-01-16T16:45:00',
    ipAddress: '192.168.1.45',
    type: 'update',
  },
  {
    id: 'AL004',
    action: 'Login',
    user: 'Emmanuel Bizimana',
    target: '-',
    details: 'Successful login from Bujumbura',
    timestamp: '2025-01-16T08:00:00',
    ipAddress: '192.168.1.22',
    type: 'login',
  },
  {
    id: 'AL005',
    action: 'User Deletion',
    user: 'Alexis Nkurunziza',
    target: 'Former Employee',
    details: 'User account deactivated following resignation',
    timestamp: '2025-01-15T14:30:00',
    ipAddress: '192.168.1.45',
    type: 'delete',
  },
  {
    id: 'AL006',
    action: 'Role Modification',
    user: 'Alexis Nkurunziza',
    target: 'Emmanuel Bizimana',
    details: 'Role changed from Employee to Department Head',
    timestamp: '2025-01-14T11:20:00',
    ipAddress: '192.168.1.45',
    type: 'update',
  },
];

// System Configuration
export const mockSystemConfig: SystemConfig[] = [
  {
    id: 'CFG001',
    category: 'Budget',
    key: 'max_mission_budget',
    value: '1500000',
    description: 'Maximum budget allowed per mission (BIF)',
    type: 'number',
  },
  {
    id: 'CFG002',
    category: 'Budget',
    key: 'daily_allowance',
    value: '50000',
    description: 'Daily mission allowance (BIF)',
    type: 'number',
  },
  {
    id: 'CFG003',
    category: 'Missions',
    key: 'max_mission_duration',
    value: '30',
    description: 'Maximum mission duration (days)',
    type: 'number',
  },
  {
    id: 'CFG004',
    category: 'Missions',
    key: 'require_director_approval',
    value: 'true',
    description: 'Director approval required for all missions',
    type: 'boolean',
  },
  {
    id: 'CFG005',
    category: 'Notifications',
    key: 'email_notifications',
    value: 'true',
    description: 'Send notifications by email',
    type: 'boolean',
  },
  {
    id: 'CFG006',
    category: 'Notifications',
    key: 'sms_notifications',
    value: 'false',
    description: 'Send notifications by SMS',
    type: 'boolean',
  },
  {
    id: 'CFG007',
    category: 'System',
    key: 'maintenance_mode',
    value: 'false',
    description: 'Maintenance mode (disables operations)',
    type: 'boolean',
  },
  {
    id: 'CFG008',
    category: 'System',
    key: 'default_language',
    value: 'fr',
    description: 'System default language',
    type: 'select',
    options: ['fr', 'en', 'rn'],
  },
];

// Executive KPIs
export const executiveKPIs = {
  totalBudget: 25000000,
  usedBudget: 18500000,
  missionsThisMonth: 24,
  missionsCompleted: 18,
  pendingApprovals: 4,
  employeesOnMission: 12,
  averageMissionDuration: 3.5,
  costEfficiency: 92,
};

// Budget by department
export const budgetByDepartment = [
  { department: 'Distribution', allocated: 8000000, used: 6200000 },
  { department: 'Logistics', allocated: 5000000, used: 3800000 },
  { department: 'Finance', allocated: 4000000, used: 3200000 },
  { department: 'Administration', allocated: 3500000, used: 2100000 },
  { department: 'Customer Service', allocated: 2500000, used: 1800000 },
  { department: 'IT', allocated: 2000000, used: 1400000 },
];

// Missions by city
export const missionsByCity = [
  { city: 'Bujumbura', count: 8, budget: 4200000 },
  { city: 'Gitega', count: 5, budget: 2800000 },
  { city: 'Ngozi', count: 4, budget: 1800000 },
  { city: 'Muyinga', count: 3, budget: 1500000 },
  { city: 'Kayanza', count: 2, budget: 900000 },
  { city: 'Bururi', count: 2, budget: 1100000 },
];

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-BI', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' BIF';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusLabel = (status: Mission['status']): string => {
  const labels: Record<Mission['status'], string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
  };
  return labels[status];
};

// Current logged in user (for demo)
export const currentUser = mockUsers[0];
