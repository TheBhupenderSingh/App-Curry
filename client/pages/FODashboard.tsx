import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  Eye,
  Edit,
  TrendingUp,
} from "lucide-react";
import { BASE_URL } from "@/config";

// Mock data for FO tasks
const foStats = {
  assignedTasks: 12,
  completedTasks: 8,
  pendingTasks: 4,
  overdueTasks: 1,
};

const myTasks = [
  {
    id: "T001",
    title: "Customer Data Migration",
    description: "Migrate customer data from legacy system to new CRM platform",
    assignedBy: "John Smith",
    status: "In Progress",
    priority: "High",
    sla: "2 days",
    dueDate: "2024-01-15",
    createdDate: "2024-01-12",
    comments: 3,
    progress: 65,
  },
  {
    id: "T006",
    title: "Security Assessment Report",
    description: "Complete security assessment for client portal",
    assignedBy: "John Smith",
    status: "Pending",
    priority: "Critical",
    sla: "1 day",
    dueDate: "2024-01-14",
    createdDate: "2024-01-13",
    comments: 1,
    progress: 0,
  },
  {
    id: "T008",
    title: "Mobile App Testing",
    description: "Test new features in mobile application",
    assignedBy: "John Smith",
    status: "Review",
    priority: "Medium",
    sla: "3 days",
    dueDate: "2024-01-16",
    createdDate: "2024-01-10",
    comments: 5,
    progress: 90,
  },
  {
    id: "T003",
    title: "Database Backup Verification",
    description: "Verify all database backups are functioning correctly",
    assignedBy: "John Smith",
    status: "Overdue",
    priority: "High",
    sla: "1 day",
    dueDate: "2024-01-12",
    createdDate: "2024-01-11",
    comments: 2,
    progress: 75,
  },
  {
    id: "T005",
    title: "User Training Documentation",
    description: "Create training materials for new user onboarding",
    assignedBy: "John Smith",
    status: "Completed",
    priority: "Low",
    sla: "5 days",
    dueDate: "2024-01-10",
    createdDate: "2024-01-05",
    comments: 4,
    progress: 100,
  },
];

export function FODashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const email = localStorage.getItem("userEmail");


useEffect(() => {
const fetchTasks = async () => {
try {
const res = await fetch(`${BASE_URL}/fo/myTask/${email}`);
const data = await res.json();


const mappedTasks = data.map((task: any) => {
const dueDate = task.dueDate ? new Date(task.dueDate) : null;
const createdDate = task.createdAt ? new Date(task.createdAt) : null;
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
id: `T${task.id}`,
title: task.title,
description: task.description,
assignedBy: task.assignedBy?.username || "Unknown",
status: task.status === "OPEN" ? "Pending" : task.status,
priority: "Medium", // dummy
sla,
dueDate: dueDate ? dueDate.toISOString().split("T")[0] : "-",
createdDate: createdDate ? createdDate.toISOString().split("T")[0] : "-",
comments: 0, // dummy
progress: 0, // dummy
};
});

setMyTasks(mappedTasks);
} catch (err) {
console.error("Failed to fetch tasks", err);
}
};


fetchTasks();
}, []);

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

  const filteredTasks = myTasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      task.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority =
      priorityFilter === "all" ||
      task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assigned
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foStats.assignedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Your current workload
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foStats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (foStats.completedTasks / foStats.assignedTasks) * 100,
              )}
              % completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-status-pending" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foStats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-status-overdue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-overdue">
              {foStats.overdueTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Tasks{}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredTasks.length} of {myTasks.length} tasks
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your tasks..."
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
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="border border-border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-3">
                      {/* Task Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">
                              {task.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              {task.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              getStatusColor(task.status),
                            )}
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            className={cn(
                              "text-xs",
                              getPriorityColor(task.priority),
                            )}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {task.status !== "Completed" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {task.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Task Meta Information */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Assigned by {task.assignedBy}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {task.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>SLA: {task.sla}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{task.comments} comments</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Link to={`/task/${task.id}`}>
                        <Button size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      {task.status !== "Completed" && (
                        <Link to={`/task/${task.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Update
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  No tasks found matching your filters.
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
