import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  User,
  Clock,
  AlertCircle,
  Plus,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

// Mock data for team members


export function AssignTask() {

const [foUsers, setFoUsers] = useState<
  { id: number; username: string; email: string; role: string }[]
>([]);

const storedId = localStorage.getItem("userId"); // string | null
const [success, setSuccess] = useState(false);

 

useEffect(() => {
  const fetchFos = async () => {
    try {
      const response = await axios.get("http://localhost:9090/ho/findUsers"); // ✅ updated endpoint
      setFoUsers(response.data);
    } catch (error) {
      console.error("Error fetching FO users:", error);
    }

    
  };
  fetchFos();
}, []);


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    slaHours: "",
    dueDate: undefined as Date | undefined,
    tags: [] as string[],
    attachments: [] as File[],
  });
  const [newTag, setNewTag] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
  title: formData.title,
  description: formData.description,
  assignedById: storedId, // HO ID (replace with logged-in HO ID)
  assignedToId: parseInt(formData.assignedTo), // ✅ correct
  slaHours: formData.slaHours ? parseInt(formData.slaHours) : null,
  dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
     };

    const response = await axios.post(
      "http://localhost:9090/ho/assignTask",
      payload
    );
     toast({
      title: "Task Assigned",
      description: "The task has been assigned successfully 🎉",
    });

    console.log("Task assigned successfully:", response.data);
      setSuccess(true);
   // navigate("/ho-dashboard");
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("Failed to assign task. Please try again.");
  }
};

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {success && (
  <Card className="p-4 bg-green-100 border border-green-500 text-green-800">
    🎉 Task assigned successfully!
  </Card>
)}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Assign New Task</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Task Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title..."
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Task Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of the task..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Assign To */}
               <div className="space-y-2">
  <Label htmlFor="assignedTo">Assign To *</Label>
  <Select
    value={formData.assignedTo}
    onValueChange={(value) =>
      setFormData((prev) => ({ ...prev, assignedTo: value }))
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select FO user..." />
    </SelectTrigger>
    <SelectContent>
  {foUsers.map((fo) => (
    <SelectItem key={fo.id} value={String(fo.id)}>
      {fo.username} ({fo.email})
    </SelectItem>
  ))}
</SelectContent>
  </Select>
</div>


                {/* Priority and SLA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <Badge className={getPriorityColor("low")}>Low</Badge>
                        </SelectItem>
                        <SelectItem value="medium">
                          <Badge className={getPriorityColor("medium")}>
                            Medium
                          </Badge>
                        </SelectItem>
                        <SelectItem value="high">
                          <Badge className={getPriorityColor("high")}>
                            High
                          </Badge>
                        </SelectItem>
                        <SelectItem value="critical">
                          <Badge className={getPriorityColor("critical")}>
                            Critical
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slaHours">SLA (Hours) *</Label>
                    <Input
                      id="slaHours"
                      type="number"
                      placeholder="24"
                      value={formData.slaHours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slaHours: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate
                          ? format(formData.dueDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) =>
                          setFormData((prev) => ({ ...prev, dueDate: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* File Attachments */}
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Task Preview */}
                <Card className="border-2 border-dashed border-muted">
                  <CardHeader>
                    <CardTitle className="text-sm">Task Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Title:</strong> {formData.title || "Not set"}
                    </div>
                   <div className="text-sm">
  <strong>Assigned To:</strong>{" "}
  {formData.assignedTo
    ? foUsers.find((fo) => String(fo.id) === formData.assignedTo)?.username
    : "Not selected"}
</div>
                    <div className="text-sm">
                      <strong>Priority:</strong>{" "}
                      {formData.priority ? (
                        <Badge className={getPriorityColor(formData.priority)}>
                          {formData.priority}
                        </Badge>
                      ) : (
                        "Not set"
                      )}
                    </div>
                    <div className="text-sm">
                      <strong>SLA:</strong>{" "}
                      {formData.slaHours
                        ? `${formData.slaHours} hours`
                        : "Not set"}
                    </div>
                    <div className="text-sm">
                      <strong>Due Date:</strong>{" "}
                      {formData.dueDate
                        ? format(formData.dueDate, "PPP")
                        : "Not set"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/ho-dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Assign Task</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
