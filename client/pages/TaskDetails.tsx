import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  Save,
  Send,
  Edit,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Plus,
  Activity,
} from "lucide-react";

// Mock data - in real app this would come from API
const taskData = {
  T001: {
    id: "T001",
    title: "Customer Data Migration",
    description:
      "Migrate customer data from legacy system to new CRM platform. This involves extracting data from the old system, transforming it to match the new schema, and loading it into the CRM while ensuring data integrity and minimal downtime.",
    assignedTo: "Sarah Johnson",
    assignedBy: "John Smith",
    status: "In Progress",
    priority: "High",
    sla: "2 days",
    dueDate: "2024-01-15",
    createdDate: "2024-01-12",
    progress: 65,
    tags: ["Migration", "CRM", "Data"],
    attachments: [
      { name: "migration-plan.pdf", size: "2.4 MB", type: "pdf" },
      { name: "data-schema.xlsx", size: "1.8 MB", type: "excel" },
    ],
    comments: [
      {
        id: 1,
        author: "Sarah Johnson",
        time: "2 hours ago",
        content:
          "Started the data extraction process. Initial tests look good.",
        type: "update",
      },
      {
        id: 2,
        author: "John Smith",
        time: "1 day ago",
        content:
          "Please prioritize this task as client needs it by EOD tomorrow.",
        type: "comment",
      },
      {
        id: 3,
        author: "System",
        time: "2 days ago",
        content: "Task assigned to Sarah Johnson",
        type: "system",
      },
    ],
    activities: [
      {
        time: "2 hours ago",
        action: "Progress updated to 65%",
        user: "Sarah Johnson",
      },
      {
        time: "4 hours ago",
        action: "Status changed to In Progress",
        user: "Sarah Johnson",
      },
      { time: "1 day ago", action: "Comment added", user: "John Smith" },
      { time: "2 days ago", action: "Task created", user: "John Smith" },
    ],
  },
};

const teamMembers = [
  {
    id: "fo1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    status: "Available",
  },
  { id: "fo2", name: "Mike Wilson", email: "mike@company.com", status: "Busy" },
  {
    id: "fo3",
    name: "Emma Davis",
    email: "emma@company.com",
    status: "Available",
  },
  {
    id: "fo4",
    name: "Alex Chen",
    email: "alex@company.com",
    status: "Available",
  },
];

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  
  const [status, setStatus] = useState(task?.status || "");
  const [progress, setProgress] = useState(task?.progress || 0);
  const [newComment, setNewComment] = useState("");
  const [assignTo, setAssignTo] = useState(task?.assignedTo || "");
  
  const [tas, setTas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchTask = async () => {
    try {
      const numericId = id?.replace(/^T/, "");
      const response = await fetch(
        `http://localhost:9090/fo/myTaskWithId/${numericId}`
      );
      if (!response.ok) throw new Error("Failed to fetch task");

      const apiData = await response.json();

      // Normalize API response to match dummy structure
      const normalizedTask = {
        id: `T${apiData.id}`, // keep T-prefixed for frontend
        title: apiData.title || "Untitled Task",
        description: apiData.description || "No description provided.",
        status: apiData.status || "Pending",
        priority: apiData.priority || "Medium", // dummy if not present
        sla: calculateSLA(apiData.dueDate),
        dueDate: apiData.dueDate?.split("T")[0] || "-",
        createdDate: apiData.createdAt?.split("T")[0] || "-",
        assignedBy: apiData.assignedBy?.username || "Unknown",
        assignedTo: apiData.assignedTo?.username || "Unassigned",
        progress: apiData.progress ?? 0, // dummy if not present
        tags: apiData.tags || ["General"],
        attachments: apiData.attachments || [
          { name: "requirements.pdf", size: "1.2 MB", type: "pdf" },
        ],
        comments: apiData.comments || [
          {
            id: 1,
            author: "System",
            time: "Just now",
            content: "Task created",
            type: "system",
          },
        ],
        activities: apiData.activities || [
          {
            time: "Just now",
            action: "Task created",
            user: apiData.assignedBy?.username || "System",
          },
        ],
      };

      setTask(normalizedTask);
      setStatus(normalizedTask.status);
      setProgress(normalizedTask.progress);
      setAssignTo(normalizedTask.assignedTo);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchTask();
}, [id]);

const calculateSLA = (dueDateStr?: string) => {
  if (!dueDateStr) return "-";
  const due = new Date(dueDateStr);
  const today = new Date();
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays > 0) return `${diffDays} days`;
  if (diffDays === 0) return "Today";
  return `Overdue by ${Math.abs(diffDays)} days`;
};

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Task Not Found{}</h2>
        <p className="text-muted-foreground mb-4">
          The task you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/fo-dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

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

  const handleStatusUpdate = () => {
    // Here you would make an API call to update the task
    console.log("Updating task status:", { status, progress });
    // Show success message
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Here you would make an API call to add the comment
      console.log("Adding comment:", newComment);
      setNewComment("");
      // Update comments list
    }
  };

  const handleReassign = () => {
    // Here you would make an API call to reassign the task
    console.log("Reassigning task to:", assignTo);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/fo-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <p className="text-muted-foreground">Task ID: {task.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={cn("text-xs", getStatusColor(task.status))}>
            {task.status}
          </Badge>
          <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Files</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Assigned To</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{task.assignedTo}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Assigned By</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>{task.assignedBy}</span>
                      </div>
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                    <div>
                      <Label>SLA</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{task.sla}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Description</Label>
                    <p className="mt-1 text-sm text-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments & Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment or update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {comment.author}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.time}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                comment.type === "system" && "bg-muted",
                                comment.type === "update" && "bg-primary/10",
                                comment.type === "comment" && "bg-accent",
                              )}
                            >
                              {comment.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Attachments</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {task.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress & Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Update Task</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>In Progress</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Review">
                      <div className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Review</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Completed">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Completed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Progress ({progress}%)</Label>
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <Button onClick={handleStatusUpdate} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Update Task
              </Button>
            </CardContent>
          </Card>

          {/* Reassign Task */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Reassign Task</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem
                        key={member.id}
                        value={member.name}
                        disabled={member.status === "On Leave"}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{member.name}</span>
                          <Badge
                            variant={
                              member.status === "Available"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs ml-2"
                          >
                            {member.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Reassign Task
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm Task Reassignment
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reassign this task to {assignTo}?
                      This action will notify both the current and new assignee.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReassign}>
                      Confirm Reassignment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Assignor
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Request Extension
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
