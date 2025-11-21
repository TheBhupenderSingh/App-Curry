import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import {  useEffect, useState } from "react";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  Edit,
  Trash2,
  Key,
  Shield,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { BASE_URL } from "@/config";
import axios from "axios";
import { toast } from "sonner";

interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}
interface Designation {
  id: number;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  createdDate: string;
  lastLogin: string;
  permissions: any; // If you have roleTemplates logic, adjust this
}

// Mock permissions data
const availablePermissions = {
  tasks: [
    {
      id: "view_tasks",
      label: "View Tasks",
      description: "Can view assigned tasks",
    },
    {
      id: "create_tasks",
      label: "Create Tasks",
      description: "Can create new tasks",
    },
    {
      id: "assign_tasks",
      label: "Assign Tasks",
      description: "Can assign tasks to others",
    },
    {
      id: "update_tasks",
      label: "Update Tasks",
      description: "Can update task status and details",
    },
    {
      id: "delete_tasks",
      label: "Delete Tasks",
      description: "Can delete tasks",
    },
  ],
  users: [
    {
      id: "view_users",
      label: "View Users",
      description: "Can view user information",
    },
    {
      id: "create_users",
      label: "Create Users",
      description: "Can create new users",
    },
    {
      id: "edit_users",
      label: "Edit Users",
      description: "Can edit user information",
    },
    {
      id: "delete_users",
      label: "Delete Users",
      description: "Can delete users",
    },
    {
      id: "manage_roles",
      label: "Manage Roles",
      description: "Can assign and modify user roles",
    },
  ],
  reports: [
    {
      id: "view_reports",
      label: "View Reports",
      description: "Can view reports",
    },
    {
      id: "create_reports",
      label: "Create Reports",
      description: "Can create custom reports",
    },
    {
      id: "export_data",
      label: "Export Data",
      description: "Can export data and reports",
    },
  ],
  system: [
    {
      id: "system_admin",
      label: "System Administration",
      description: "Full system access",
    },
    {
      id: "audit_logs",
      label: "View Audit Logs",
      description: "Can view system audit logs",
    },
    {
      id: "system_settings",
      label: "System Settings",
      description: "Can modify system settings",
    },
  ],
};



const roleTemplates = {
  Admin: [
    "system_admin",
    "audit_logs",
    "system_settings",
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "manage_roles",
    "view_tasks",
    "create_tasks",
    "assign_tasks",
    "update_tasks",
    "delete_tasks",
    "view_reports",
    "create_reports",
    "export_data",
  ],
  HO: [
    "view_users",
    "view_tasks",
    "create_tasks",
    "assign_tasks",
    "update_tasks",
    "view_reports",
    "create_reports",
    "export_data",
  ],
  FO: ["view_tasks", "update_tasks", "view_reports"],
};

export function UserManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  

const uniqueDesignations = Array.from(
  new Map(assignments.map(a => [a.designation.id, a.designation])).values()
);

const uniqueSubdivisions = Array.from(
  new Map(assignments.map(a => [a.subDivision.id, a.subDivision])).values()
);

const uniqueDivisions = Array.from(
  new Map(assignments.map(a => [a.subDivision.division.id, a.subDivision.division])).values()
);

useEffect(() => {
  fetch(BASE_URL + "/admin/assignments")
    .then((res) => res.json())
    .then((data) => setAssignments(data));

    fetch(BASE_URL + "/admin/divisions").then(res => res.json()).then(setDivisions);
    fetch(BASE_URL + "/admin/subdivisions").then(res => res.json()).then(setSubdivisions);
    fetch(BASE_URL + "/admin/designations").then(res => res.json()).then(setDesignations);
}, []);

useEffect(() => {

  fetch(BASE_URL + "/admin/assignments")
    .then((res) => res.json())
    
    .then((data) => {
      const formatted = data.map((assignment: any) => {
        const username = assignment.person.username || "Unknown";
        const firstName = username.split(" ")[0];
        const lastName = username.split(" ")[1] || "";

        return {
          id: assignment.person.id,
          firstName,
          lastName,
          email: assignment.person.email,
          phone: assignment.person.phone || "",
          department: assignment.designation.name, // ✅ designation shown as department
          role: assignment.person.role,
          status: assignment.person.status || "Active",
          createdDate: assignment.person.createdDate || "N/A",
          lastLogin: assignment.person.lastLogin || "N/A",
          permissions: [], // or use roleTemplates[assignment.person.role] if defined
        };
      });

      setUsers(formatted);
    })
    
    .catch((err) => {
      console.error("Error fetching users:", err);
    });
}, []);


  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",   // Optional, you can remove or keep as backup
  designationId: "", // 👈 New
  divisionId: "",    // 👈 New
  subDivisionId: "", // 👈 New
  role: "",
  status: "Active",
  password: "",
  confirmPassword: "",
  reportsToId: "", // 👈 new field
  permissions: [] as string[],
  });

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: roleTemplates[role as keyof typeof roleTemplates] || [],
    }));
  };

  const [loading, setLoading] = useState(false);

  

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((p) => p !== permissionId),
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",   // Optional, you can remove or keep as backup
      designationId: "", // 👈 New
      divisionId: "",    // 👈 New
      subDivisionId: "", // 👈 New
      role: "",
      status: "Active",
      password: "",
      confirmPassword: "",
      reportsToId: "", // 👈 new field
      permissions: [] as string[],
    });
  };


  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      // 👇 Use the id passed in
      await axios.delete(`http://localhost:9090/admin/deleteUser/${id}`);
      alert("✅ User Deleted successfully! please reload the page");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };


  const handleCreateUser = async () => {
  // Simple validations
  if (!formData.firstName || !formData.email || !formData.password || !formData.role || !formData.designationId ) {
    alert("Please fill all mandatory fields.");
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }


  const payload = {
    username: `${formData.firstName.trim()} ${formData.lastName.trim()}`, // Combine first and last name to form the username
    email: formData.email.trim(),
    role: formData.role,
    password: formData.password ,
    designationId:Number(formData.designationId),
    divisionId:  Number(formData.divisionId) ,
    subDivisionId:  Number(formData.subDivisionId) ,
    reportTo :Number(formData.reportsToId),

  };

  try {
    const res = await fetch(`${BASE_URL}/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Failed to create user");
    }

    alert("✅ User created successfully!");
    setShowCreateDialog(false);
    
  } catch (err) {
    console.error("Error creating user:", err);
    alert("❌ Error creating user: " + err.message);
  }
};

  const handleUpdateUser = () => {
    console.log("Updating user:", formData);
    // API call to update user
    setShowEditDialog(false);
    resetForm();
  };

  const handleResetPassword = () => {
    console.log("Resetting password for user:", selectedUser);
    // API call to reset password
    setShowPasswordDialog(false);
  };

 


  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
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
            User Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage user accounts and permissions
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system with appropriate role and
                permissions.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="role">Role & Permissions</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="IT Operations">
                        IT Operations
                      </SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Quality Assurance">
                        Quality Assurance
                      </SelectItem>
                      <SelectItem value="Customer Service">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">
                        Human Resources
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="role" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Administrator</div>
                            <div className="text-xs text-muted-foreground">
                              Full system access
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="HO">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Head Office</div>
                            <div className="text-xs text-muted-foreground">
                              Full access from office.
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="HO-1">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Head Office-1</div>
                            <div className="text-xs text-muted-foreground">
                              Task management.
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                       <SelectItem value="HO-2">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Head Office-2</div>
                            <div className="text-xs text-muted-foreground">
                              Task management and view only.
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="FO">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Field Officer</div>
                            <div className="text-xs text-muted-foreground">
                              Task execution and updates
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label>Division</Label>
      <Select
        value={formData.divisionId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, divisionId: value, subDivisionId: "" }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Division" />
        </SelectTrigger>
        <SelectContent>
          {divisions.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Subdivision</Label>
      <Select
        value={formData.subDivisionId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, subDivisionId: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Subdivision" />
        </SelectTrigger>
        <SelectContent>
          {subdivisions
            .filter((s) => !formData.divisionId || String(s.division.id) === formData.divisionId)
            .map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Designation</Label>
      <Select
        value={formData.designationId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, designationId: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Designation" />
        </SelectTrigger>
        <SelectContent>
          {designations.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

<div className="space-y-2">
  <Label>Reports To</Label>
  <Select
    value={formData.reportsToId}
    onValueChange={(value) =>
      setFormData((prev) => ({ ...prev, reportsToId: value }))
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Reporting Officer" />
    </SelectTrigger>
    <SelectContent>
      {users.map((u) => (
        <SelectItem key={u.id} value={String(u.id)}>
          {u.firstName} {" "} {u.lastName}({u.department})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="space-y-4">
                    {Object.entries(availablePermissions).map(
                      ([category, permissions]) => (
                        <Card key={category}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm capitalize">
                              {category} Permissions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start space-x-2"
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={formData.permissions.includes(
                                    permission.id,
                                  )}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.id,
                                      checked as boolean,
                                    )
                                  }
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permission.label}
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Password Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minimum 8 characters</li>
                    <li>• At least one uppercase letter</li>
                    <li>• At least one lowercase letter</li>
                    <li>• At least one number</li>
                    <li>• At least one special character</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                <Save className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Last Login</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-2">{user.department}</td>
                    <td className="p-2">
                      <Badge
                        className={cn("text-xs", getStatusColor(user.status))}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">{user.createdDate}</td>
                    <td className="p-2 text-sm">{user.lastLogin}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              phone: user.phone,
                              department: user.department,            
                              designationId: "", // 👈 New
                              divisionId: "",    // 👈 New
                              subDivisionId: "", // 👈 New
                              role: user.role,
                              status: user.status,
                              password: "",
                              confirmPassword: "",
                              permissions: user.permissions,
                              reportsToId: "", 
                            });
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPasswordDialog(true);
                          }}
                        >
                          <Key className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.firstName}{" "}
                                {user.lastName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={() => {void handleDelete(Number(user.id));}}
                                  className="bg-destructive text-destructive-foreground"
                                  disabled={loading}>
                                 {loading ? "Deleting..." : "Delete User"}
                             </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information, role, and permissions.
            </DialogDescription>
          </DialogHeader>

          {/* Similar content as create dialog but with update logic */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="role">Role & Permissions</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Same basic info fields as create dialog */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input
                    id="editLastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email Address *</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="role" className="space-y-4">
              {/* Same role and permissions content */}
              <div className="space-y-2">
    <Label htmlFor="role">User Role *</Label>
    <Select
      value={formData.role}
      onValueChange={handleRoleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select user role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Administrator</SelectItem>
        <SelectItem value="HO">Head Office</SelectItem>
        <SelectItem value="FO">Field Officer</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="space-y-2">
      <Label>Division</Label>
      <Select
        value={formData.divisionId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, divisionId: value, subDivisionId: "" }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Division" />
        </SelectTrigger>
        <SelectContent>
          {uniqueDivisions.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Subdivision</Label>
      <Select
        value={formData.subDivisionId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, subDivisionId: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Subdivision" />
        </SelectTrigger>
        <SelectContent>
          {uniqueSubdivisions
            .filter((s) => !formData.divisionId || String(s.division.id) === formData.divisionId)
            .map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Designation</Label>
      <Select
        value={formData.designationId}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, designationId: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Designation" />
        </SelectTrigger>
        <SelectContent>
          {uniqueDesignations.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <div className="space-y-2">
                <Label>Account Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              <Save className="h-4 w-4 mr-2" />
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Password Reset Warning
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This will generate a temporary password and send it to the
                    user's email.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reset Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendEmail" defaultChecked />
                  <Label htmlFor="sendEmail">Send new password via email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="forceReset" defaultChecked />
                  <Label htmlFor="forceReset">
                    Force password change on next login
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <Key className="h-4 w-4 mr-2" />
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
