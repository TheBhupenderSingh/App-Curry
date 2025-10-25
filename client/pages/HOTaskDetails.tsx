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
  Shield,
  Eye,
  TrendingUp,
  Users,
  Flag,
  Archive,
} from "lucide-react";
import { BASE_URL } from "@/config";

// Extended mock data for HO oversight
const hoTaskData = {
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
    timeSpent: "12 hours",
    estimatedHours: "18 hours",
    tags: ["Migration", "CRM", "Data"],
    department: "IT Operations",
    client: "ABC Corporation",
    attachments: [
      { name: "migration-plan.pdf", size: "2.4 MB", type: "pdf" },
      { name: "data-schema.xlsx", size: "1.8 MB", type: "excel" },
      { name: "progress-report.docx", size: "950 KB", type: "word" },
    ],
    comments: [
      {
        id: 1,
        author: "Sarah Johnson",
        role: "FO",
        time: "2 hours ago",
        content:
          "Data extraction completed successfully. Moving to transformation phase. Found 2 schema inconsistencies that need review.",
        type: "update",
        flagged: false,
      },
      {
        id: 2,
        author: "John Smith",
        role: "HO",
        time: "4 hours ago",
        content:
          "Great progress! Please document the schema issues for future reference. Priority remains high.",
        type: "management_comment",
        flagged: false,
      },
      {
        id: 3,
        author: "Sarah Johnson",
        role: "FO",
        time: "1 day ago",
        content:
          "Started the migration process. Initial analysis shows good data quality.",
        type: "update",
        flagged: false,
      },
      {
        id: 4,
        author: "System",
        role: "System",
        time: "2 days ago",
        content: "Task assigned to Sarah Johnson",
        type: "system",
        flagged: false,
      },
    ],
    activities: [
      {
        time: "2 hours ago",
        action: "Progress updated to 65%",
        user: "Sarah Johnson",
        type: "progress",
      },
      {
        time: "2 hours ago",
        action: "Comment added by FO",
        user: "Sarah Johnson",
        type: "comment",
      },
      {
        time: "4 hours ago",
        action: "Management comment added",
        user: "John Smith",
        type: "management",
      },
      {
        time: "6 hours ago",
        action: "Status changed to In Progress",
        user: "Sarah Johnson",
        type: "status",
      },
      {
        time: "1 day ago",
        action: "FO started work",
        user: "Sarah Johnson",
        type: "start",
      },
      {
        time: "2 days ago",
        action: "Task created and assigned",
        user: "John Smith",
        type: "creation",
      },
    ],
    performance: {
      onTime: true,
      slaRisk: "Low",
      qualityScore: 85,
      communicationFrequency: "Good",
    },
    escalations: [],
  },
};

const teamMembers = [
  {
    id: "fo1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    status: "Available",
    currentTasks: 3,
  },
  {
    id: "fo2",
    name: "Mike Wilson",
    email: "mike@company.com",
    status: "Busy",
    currentTasks: 5,
  },
  {
    id: "fo3",
    name: "Emma Davis",
    email: "emma@company.com",
    status: "Available",
    currentTasks: 2,
  },
  {
    id: "fo4",
    name: "Alex Chen",
    email: "alex@company.com",
    status: "Available",
    currentTasks: 4,
  },
];

export function HOTaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tas = hoTaskData[id as keyof typeof hoTaskData];
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState(task?.status || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [newComment, setNewComment] = useState("");
  const [assignTo, setAssignTo] = useState(task?.assignedTo || "");
  const [commentType, setCommentType] = useState<
    "management_comment" | "directive" | "feedback"
  >("management_comment");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const numericId = id?.replace(/^T/, ""); // since your API expects numeric id
        const res = await fetch(`${BASE_URL}/fo/myTaskWithId/${numericId}`);
        const data = await res.json();

        // map API response → component format
        const mappedTask = {
          id: "T" + data.id,
          title: data.title,
          description: data.description,
          status: data.status === "OPEN" ? "Pending" : data.status,
          priority: "Medium", // dummy for now
          sla: calculateSLA(data.dueDate),
          dueDate: new Date(data.dueDate).toLocaleDateString(),
          createdDate: new Date(data.createdAt).toLocaleDateString(),
          progress: 50, // dummy
          timeSpent: "0 hours",
          estimatedHours: "N/A",
          tags: ["General"],
          department: "N/A",
          client: "N/A",
          assignedTo: data.assignedTo?.username,
          assignedBy: data.assignedBy?.username,
          comments: [],
          activities: [],
          attachments: [],
          performance: {
            onTime: true,
            slaRisk: "Low",
            qualityScore: 80,
            communicationFrequency: "Good",
          },
          escalations: [],
        };

        setTask(mappedTask);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);


  const calculateSLA = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `${diff} days`;
    if (diff === 0) return "Today";
    return `Overdue by ${Math.abs(diff)} days`;
  };

  if (loading) {
    return <p className="text-center py-12">Loading task...</p>;
  }
  
  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The task you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/ho-dashboard")}>
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

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case "management_comment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "directive":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "feedback":
        return "bg-green-100 text-green-800 border-green-200";
      case "update":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusOverride = () => {
    console.log("HO overriding status:", { status, priority });
    // API call to override status with management authority
  };

  const handleAddManagementComment = () => {
    if (newComment.trim()) {
      console.log("Adding management comment:", {
        comment: newComment,
        type: commentType,
        authorRole: "HO",
      });
      setNewComment("");
      // API call to add management comment
    }
  };

  const handleReassign = () => {
    console.log("HO reassigning task to:", assignTo);
    // API call to reassign task with management authority
  };

  const handleEscalate = () => {
    console.log("Escalating task:", task.id);
    // API call to escalate task
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/ho-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Task ID: {task.id}</span>
              <span>•</span>
              <span>Assigned to: {task.assignedTo}</span>
              <span>•</span>
              <span>Client: {task.client}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={cn("text-xs", getStatusColor(task.status))}>
            {task.status}
          </Badge>
          <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Management View
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task.progress}%
                  </div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task.timeSpent}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time Spent
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={cn(
                      "text-2xl font-bold",
                      task.performance.slaRisk === "Low"
                        ? "text-success"
                        : task.performance.slaRisk === "Medium"
                          ? "text-warning"
                          : "text-destructive",
                    )}
                  >
                    {task.performance.slaRisk}
                  </div>
                  <div className="text-sm text-muted-foreground">SLA Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {task.performance.qualityScore}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Quality Score
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label>Task Progress</Label>
                <Progress value={task.progress} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
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
                        <Badge variant="outline" className="text-xs">
                          {
                            teamMembers.find((m) => m.name === task.assignedTo)
                              ?.currentTasks
                          }{" "}
                          tasks
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{task.department}</span>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Time Tracking</Label>
                      <div className="mt-1 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Time Spent:</span>
                          <span className="font-medium">{task.timeSpent}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Estimated:</span>
                          <span className="font-medium">
                            {task.estimatedHours}
                          </span>
                        </div>
                      </div>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Communication</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {task.comments.filter((c) => c.role === "FO").length} FO
                      Updates
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Management Comment */}
                  <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <Label className="text-blue-800 dark:text-blue-200">
                        Add Management Comment
                      </Label>
                    </div>
                    <Select
                      value={commentType}
                      onValueChange={(value: any) => setCommentType(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="management_comment">
                          General Comment
                        </SelectItem>
                        <SelectItem value="directive">
                          Directive/Instruction
                        </SelectItem>
                        <SelectItem value="feedback">
                          Performance Feedback
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Add management comment, feedback, or directive..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button
                      onClick={handleAddManagementComment}
                      size="sm"
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Management Comment
                    </Button>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            comment.role === "HO"
                              ? "bg-blue-600"
                              : comment.role === "FO"
                                ? "bg-green-600"
                                : "bg-gray-600",
                          )}
                        >
                          {comment.role === "HO" ? (
                            <Shield className="h-4 w-4 text-white" />
                          ) : comment.role === "FO" ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Activity className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {comment.author}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                getCommentTypeColor(comment.type),
                              )}
                            >
                              {comment.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {comment.time}
                            </span>
                            {comment.role === "HO" && (
                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                Management
                              </Badge>
                            )}
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

            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Task Files & Documentation</CardTitle>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Review All
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
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Activity Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2",
                          activity.type === "management"
                            ? "bg-blue-500"
                            : activity.type === "progress"
                              ? "bg-green-500"
                              : activity.type === "comment"
                                ? "bg-purple-500"
                                : activity.type === "status"
                                  ? "bg-orange-500"
                                  : "bg-gray-500",
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.action}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                          {activity.type === "management" && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Management Action
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium">
                        Communication Frequency
                      </Label>
                      <div className="mt-2 text-2xl font-bold text-success">
                        {task.performance.communicationFrequency}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Regular updates from FO
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Timeline Adherence
                      </Label>
                      <div className="mt-2 text-2xl font-bold text-success">
                        {task.performance.onTime ? "On Track" : "Delayed"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Meeting original timeline
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">
                      Recommendations
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          ✓ Task is progressing well with regular communication
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          ℹ Consider acknowledging good progress to maintain
                          motivation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Management Sidebar */}
        <div className="space-y-6">
          {/* Management Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Management Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Override Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Under Review</SelectItem>
                      <SelectItem value="Completed">Mark Complete</SelectItem>
                      <SelectItem value="On Hold">Put On Hold</SelectItem>
                      <SelectItem value="Cancelled">Cancel Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Change Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Critical">
                        Critical Priority
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleStatusOverride} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reassignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Reassign Task</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transfer to</Label>
                <Select value={assignTo} onValueChange={setAssignTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{member.name}</span>
                          <div className="flex items-center space-x-2 ml-2">
                            <Badge
                              variant={
                                member.status === "Available"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {member.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {member.currentTasks} tasks
                            </Badge>
                          </div>
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

          {/* Management Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Management Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEscalate}
              >
                <Flag className="h-4 w-4 mr-2" />
                Escalate Issue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Extend Deadline
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Update
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Archive className="h-4 w-4 mr-2" />
                Archive Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
