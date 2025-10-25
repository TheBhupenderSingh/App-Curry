import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  User,
} from "lucide-react";

// Mock data for demonstration


const recentTasks = [
  {
    id: "T001",
    title: "Customer Data Migration",
    assignedTo: "Sarah Johnson",
    assignedBy: "John Smith",
    status: "In Progress",
    priority: "High",
    sla: "2 days",
    dueDate: "2024-01-15",
    comments: 3,
  },
  {
    id: "T002",
    title: "System Security Audit",
    assignedTo: "Mike Wilson",
    assignedBy: "John Smith",
    status: "Pending",
    priority: "Critical",
    sla: "1 day",
    dueDate: "2024-01-14",
    comments: 1,
  },
  {
    id: "T003",
    title: "Website Performance Review",
    assignedTo: "Emma Davis",
    assignedBy: "John Smith",
    status: "Review",
    priority: "Medium",
    sla: "3 days",
    dueDate: "2024-01-16",
    comments: 5,
  },
  {
    id: "T004",
    title: "Database Backup Verification",
    assignedTo: "Alex Chen",
    assignedBy: "John Smith",
    status: "Overdue",
    priority: "High",
    sla: "1 day",
    dueDate: "2024-01-12",
    comments: 2,
  },
  {
    id: "T005",
    title: "User Training Documentation",
    assignedTo: "Lisa Brown",
    assignedBy: "John Smith",
    status: "Completed",
    priority: "Low",
    sla: "5 days",
    dueDate: "2024-01-10",
    comments: 4,
  },
];

const notifications = [
  {
    id: 1,
    type: "sla_breach",
    message: "Task T004 has breached SLA by 2 days",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "task_completed",
    message: "Sarah Johnson completed task T003",
    time: "4 hours ago",
  },
  {
    id: 3,
    type: "new_comment",
    message: "New comment on task T001 by Mike Wilson",
    time: "6 hours ago",
  },
  {
    id: 4,
    type: "task_assigned",
    message: "You assigned task T006 to Emma Davis",
    time: "1 day ago",
  },
];

export function HODashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const email = localStorage.getItem("userEmail");

  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    slaBreaches: 0,
    teamMembers: 0,
  });

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://localhost:9090/ho/myTask/${email}`
      );
      const data = await res.json();

      const mappedTasks = data.map((task: any) => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        let sla = "-";

        if (dueDate) {
          const today = new Date();
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 0) sla = `${diffDays} days`;
          else if (diffDays === 0) sla = "Today";
          else sla = `Overdue by ${Math.abs(diffDays)} days`;
        }


        return {
          id: `T${task.id}`, // mapped
          title: task.title, // mapped
          description: task.description, // mapped
          assignedTo: task.assignedTo?.username || "Unknown", // mapped
          assignedBy: task.assignedBy?.username || "Unknown", // mapped
          status: task.status === "OPEN" ? "Pending" : task.status, // mapped with conversion
          priority: "Medium", // dummy (backend doesn’t send)
          sla, // calculated
          dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "-", // mapped
          comments: 0, // dummy
        };
      });

      setRecentTasks(mappedTasks);
      const today = new Date();

      const totalTasks = mappedTasks.length;
        const completedTasks = mappedTasks.filter(
          (t) => t.status.toLowerCase() === "completed"
        ).length;
        const pendingTasks = mappedTasks.filter(
          (t) => t.status.toLowerCase() === "pending"
        ).length;
        const overdueTasks = mappedTasks.filter((t) => {
          if (t.dueDate && t.dueDate !== "-") {
            return new Date(t.dueDate) < today;
          }
          return false;
        }).length;
        const slaBreaches = overdueTasks; // or add custom rule
        const teamMembers = new Set(mappedTasks.map((t) => t.assignedTo)).size;

        setTaskStats({
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          slaBreaches,
          teamMembers,
        });
     
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  fetchTasks();
}, []);


  
  

  const handleTaskClick = (taskId: string) => {
    navigate(`/ho-task/${taskId}`);
  };

  const getStatusColor = (status: string) => {
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

  const filteredTasks = recentTasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-status-pending" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">-3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-status-overdue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-overdue">
              {taskStats.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Breaches</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {taskStats.slaBreaches}
            </div>
            <p className="text-xs text-muted-foreground">Critical attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Tasks Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks, assignee, or task ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {task.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <span className="text-sm">{task.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn("text-xs", getStatusColor(task.status))}
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
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{task.dueDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{task.sla}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {task.comments}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border border-border rounded-lg space-y-2"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mt-2",
                        notification.type === "sla_breach" && "bg-destructive",
                        notification.type === "task_completed" && "bg-success",
                        notification.type === "new_comment" && "bg-primary",
                        notification.type === "task_assigned" && "bg-warning",
                      )}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
