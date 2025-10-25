import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MasterManagement from "@/pages/MasterManagement" ;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ActiveTaxPayer from "@/components/assets/activeTaxpayer.png" ;
import NewRegistration from "@/components/assets/new Registration.png" ;
import NonFillerDash from "@/components/assets/nfd.png" ;
import NewRegistrationOverview from "@/components/assets/nroo.png" ;
import overallKPI from "@/components/assets/overallKpi.png" ;
import SectoralRevenue from "@/components/assets/sectorRevenue.png"
import DealerDetails from "@/components/assets/sectoralRev A.png"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Settings,
  UserPlus,
  Database,
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Key,
} from "lucide-react";

// Mock data for admin overview
const adminStats = {
  totalUsers: 156,
  activeUsers: 142,
  totalTasks: 1284,
  completedTasks: 967,
  pendingTasks: 234,
  overdueTasks: 83,
  totalProjects: 45,
  activeProjects: 38,
  departments: 12,
  systemAlerts: 7,
};

const recentUsers = [
  {
    id: "1",
    name: "Kishore Garg",
    email: "kishorg@gmail.com",
    role: "FO",
    department: "Assistant Commissioner",
    status: "Active",
    lastLogin: "2024-01-14 09:30",
    createdDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Aman Kumar",
    email: "amank@gmail.com",
    role: "HO",
    department: "Deputy Commissioner",
    status: "Active",
    lastLogin: "2024-01-14 08:45",
    createdDate: "2023-12-15",
  },
  {
    id: "3",
    name: "Karan Aahuja",
    email: "karan01@gmail.com",
    role: "FO",
    department: "Joint Commissioner",
    status: "Inactive",
    lastLogin: "2024-01-10 16:20",
    createdDate: "2023-11-20",
  },
];

const systemAlerts = [
  {
    id: 1,
    type: "security",
    title: "Multiple failed login attempts",
    description: "User john.doe@company.com has 5 failed login attempts",
    severity: "High",
    time: "10 minutes ago",
  },
  {
    id: 2,
    type: "system",
    title: "Database backup completed",
    description: "Daily backup completed successfully",
    severity: "Info",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "performance",
    title: "High task overdue rate",
    description: "15% of tasks are overdue this week",
    severity: "Medium",
    time: "1 day ago",
  },
];

const organizationTasks = [
  {
    id: "T001",
    title: "Customer Data Migration",
    assignedTo: "Sarah Johnson",
    assignedBy: "John Smith",
    department: "IT Operations",
    status: "In Progress",
    priority: "High",
    dueDate: "2024-01-15",
    progress: 65,
  },
  {
    id: "T002",
    title: "Security Audit Review",
    assignedTo: "Mike Wilson",
    assignedBy: "John Smith",
    department: "Security",
    status: "Pending",
    priority: "Critical",
    dueDate: "2024-01-14",
    progress: 0,
  },
  {
    id: "T003",
    title: "Website Performance Optimization",
    assignedTo: "Emma Davis",
    assignedBy: "Alex Chen",
    department: "Development",
    status: "Review",
    priority: "Medium",
    dueDate: "2024-01-16",
    progress: 90,
  },
];

const reports: Record<string, string> = {
"Active Tax Payers": ActiveTaxPayer,
"New Registration": NewRegistration ,
"Non Filler Dashboard" : NonFillerDash ,  
"New Registration Overview" : NewRegistrationOverview  ,
"Overall KPIs" : overallKPI ,
"Sectoral Revenue" :SectoralRevenue ,
"Dealer Details" :DealerDetails,
  
};

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const storedId = localStorage.getItem("userId"); // string | null

 //For Dashboard Data transfer. 
const userString = localStorage.getItem("currentUser");
const localuser = JSON.parse(userString);
const user = { name: localuser.name, role:localuser.role ,designation:localuser.status ,division:localuser.department}  ;



// Example (replace with your actual user object after login)
   const [selectedReport, setSelectedReport] = useState<string | null>(null);

   const handleButtonClick = (reportName: string) => {
    setSelectedReport(reportName);
  };

  const handleClose = () => {
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-status-pending text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-priority-critical text-white";
      case "high":
        return "bg-priority-high text-white";
      case "medium":
        return "bg-priority-medium text-white";
      case "low":
        return "bg-priority-low text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in progress":
        return "bg-status-progress text-white";
      case "pending":
        return "bg-status-pending text-white";
      case "review":
        return "bg-status-review text-white";
      case "overdue":
        return "bg-status-overdue text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
      case "info":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview and management console
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {adminStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {adminStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStats.activeProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              of {adminStats.totalProjects} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.departments}</div>
            <p className="text-xs text-muted-foreground">
              organizational units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {adminStats.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <Shield className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {adminStats.systemAlerts}
            </div>
            <p className="text-xs text-muted-foreground">require review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="tasks">Task Monitor</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="mastermanage">Master Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent User Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs",
                                getStatusColor(user.status),
                              )}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.lastLogin}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 border border-border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge
                          className={cn(
                            "text-xs",
                            getSeverityColor(alert.severity),
                          )}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.time}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </div>

              {/* User Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="HO">Head Office</SelectItem>
                    <SelectItem value="FO">Field Officer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn("text-xs", getStatusColor(user.status))}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.createdDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Key className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Task Monitor</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time view of all tasks across the organization
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizationTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {task.title}
                        </div>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.department}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            getTaskStatusColor(task.status),
                          )}
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            getPriorityColor(task.priority),
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {task.progress}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{task.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Revenue Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start"
                 onClick={() => {
                  const url = `http://localhost:7070/sectoralDashboard?name=${encodeURIComponent(user.name )}&role=${encodeURIComponent(user.role)}&designation=${encodeURIComponent(user.designation)}&division=${encodeURIComponent(user.division)}`;
                  window.location.href = url}}>
                  Sectoral Revenue Overview
                </Button>
                <Button variant="outline" className="w-full justify-start"
                onClick={() => window.location.href = "http://localhost:7070/GstRevenueOverview"}>
                  GST Revenue Overview
                </Button>
                <Button variant="outline" className="w-full justify-start"
                onClick={() => window.location.href = "http://localhost:7070/SectorGeography"}>
                  SLA Compliance Report
                </Button>
                <Button variant="outline" className="w-full justify-start"
                onClick={() => {
                  const url = `http://localhost:7070/SectorDBS?name=${encodeURIComponent(user.name )}&role=${encodeURIComponent(user.role)}&designation=${encodeURIComponent(user.designation)}&division=${encodeURIComponent(user.division)}`;
                  window.location.href = url}}>
                  Sector and Division Performance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Sector Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                
                <Button variant="outline" className="w-full justify-start"
                >
                  Sector Liability and Turnover
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Usage Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Custom Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Taxpayer Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start"
                 onClick={() => window.location.href = "http://localhost:7070/taxpayeroverview"}>
                  Active Taxpayer Overview
                </Button>
                <Button variant="outline" className="w-full justify-start"
                 onClick={() => window.location.href = "http://localhost:7070/NonFilersDashboard"}>
                  Non Fillers Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start"
                 onClick={() => window.location.href = "http://localhost:7070/taxpayeroverview"}>
                  New Registration Overview
                </Button>
                <Button variant="outline" className="w-full justify-start"
                 onClick={() => window.location.href ="http://localhost:7070/taxpayeroverview"}>
                  Error Logs Summary
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <Dialog open={!!selectedReport} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedReport}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <img
              src={reports[selectedReport]}
              alt={selectedReport}
              className="w-full h-full object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>

        <TabsContent value="mastermanage" className="space-y-6 w-full">
          <div className="w-full">
             <MasterManagement />
          </div>
        </TabsContent>


      </Tabs>
    </div>
  );
}
