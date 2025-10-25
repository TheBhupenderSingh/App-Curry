import { useState , useEffect} from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckSquare,
  Plus,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  FolderKanban,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { BASE_URL } from "@/config";

interface LayoutProps {
  children: React.ReactNode;
  userRole: "ADMIN" | "HO" | "FO";
  onLogout?: () => void;
}

export function Layout({ children, userRole, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const [username, setUsername] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user = JSON.parse(userString);
      setUsername(user.name);
    }
  }, []);

const [divisionName, setDivisionName] = useState<string>("");

useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const fetchDivisionName = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/assignments?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user assignment");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const division = data[0]?.subDivision?.division?.name || "";
        setDivisionName(division);
      }
    } catch (err) {
      console.error("Error fetching division name:", err);
    }
  };

  fetchDivisionName();
}, []);

  const adminNavItems = [
    { path: "/hoHomepage", label: "Home Page", icon: BarChart3 },
    { path: "/admin-dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/user-management", label: "User Management", icon: Users },
    { path: "/system-settings", label: "System Settings", icon: Settings },
    { path: "/audit-logs", label: "Audit Logs", icon: Shield },
    {
    label: "Case Management",
    icon: FolderKanban,
    children: [
      { path: "/case/scrutiny", label: "Scrutiny" },
      { path: "/case/audit", label: "Audit" },
      { path: "/case/usecases", label: "Usecases" },
      { path: "/case/dealer-monitoring", label: "Dealer Monitoring" },
    ],
  },
  { path: "/Enforcement", label: "Enforcement", icon: Settings },
  { path: "/NGTP", label: "NGTP", icon: BarChart3 },
 
  { path: "/FraudAnalysis", label: "Fraud Detection Analytics", icon: BarChart3 },
  { path: "/GetTaxpayerDetails", label: "Get Taxpayer Details", icon: Settings },
    
  ];

  const hoNavItems = [
    { path: "/hoHomepage", label: "Home Page", icon: BarChart3 },
    { path: "/ho-dashboard", label: "Task Management", icon: BarChart3 },
    { path: "/assign-task", label: "Assign Task", icon: Plus },
   
    { path: "/settings", label: "Reports", icon: Settings },
    {
    label: "Case Management",
    icon: FolderKanban,
    children: [
      { path: "/case/scrutiny", label: "Scrutiny" },
      { path: "/case/audit", label: "Audit" },
      { path: "/case/usecases", label: "Usecases" },
      { path: "/case/dealer-monitoring", label: "Dealer Monitoring" },
    ],
  },
  { path: "/Enforcement", label: "Enforcement", icon: Settings },
  { path: "/NGTP", label: "NGTP", icon: BarChart3 },
 
  { path: "/FraudAnalysis", label: "Fraud Detection Analytics", icon: BarChart3 },
  { path: "/GetTaxpayerDetails", label: "Get Taxpayer Details", icon: Settings },
 
  ];

  const foNavItems = [
    { path: "/hoHomepage", label: "Home Page", icon: BarChart3 },
    { path: "/fo-dashboard", label: "My Tasks", icon: CheckSquare },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/settings", label: "Reports", icon: Settings },
    {
    label: "Case Management",
    icon: FolderKanban,
    children: [
      { path: "/fo/case-management", label: "Scrutiny" },
      { path: "/fo/case/audit", label: "Audit" },
      { path: "/case/usecases", label: "Usecases" },
      { path: "/case/dealer-monitoring", label: "Dealer Monitoring" },
    ],
  },
    { path: "/Enforcement", label: "Enforcement", icon: Settings },
  { path: "/NGTP", label: "NGTP", icon: BarChart3 },
  
   { path: "/FraudAnalysis", label: "Fraud Detection Analytics", icon: BarChart3 },
  { path: "/GetTaxpayerDetails", label: "Get Taxpayer Details", icon: Settings },
  ];

  const navItems =
    userRole === "ADMIN"
      ? adminNavItems
      : userRole === "HO"
        ? hoNavItems
        : foNavItems;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("min-h-screen bg-background flex", darkMode && "dark")}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 w-64 bg-sidebar h-screen transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  Deloitte
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  {userRole === "ADMIN"
                    ? "Administrator"
                    : userRole === "HO"
                      ? "Head Office"
                      : "Field Office"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
  {navItems.map((item) => {
    const Icon = item.icon;
    const isActive = item.path && location.pathname === item.path;

    // If parent menu has children
    if (item.children) {
      const isExpanded = expandedMenus[item.label] || false;

      return (
        <div key={item.label} className="space-y-1">
          {/* Parent menu with toggle */}
          <button
            onClick={() =>
              setExpandedMenus((prev) => ({
                ...prev,
                [item.label]: !isExpanded,
              }))
            }
            className={cn(
              "flex w-full items-center justify-between px-3 py-2 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {/* Child menu items */}
          {isExpanded && (
            <div className="ml-8 space-y-1">
              {item.children.map((child) => {
                const isChildActive = location.pathname === child.path;
                return (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={cn(
                      "block px-3 py-1.5 rounded-lg text-sm transition-colors",
                      isChildActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Normal menu item
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  })}
</nav>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {username}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {userRole === "ADMIN"
                    ? "Administrator"
                    : userRole === "HO"
                      ? "Head Office Manager"
                      : "Field Officer"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {location.pathname === "/admin-dashboard" && "Admin Dashboard"}
                {location.pathname === "/user-management" && "User Management"}
                {location.pathname === "/system-settings" && "System Settings"}
                {location.pathname === "/audit-logs" && "Audit Logs"}
                {location.pathname === "/ho-dashboard" && "Dashboard Overview"}
                {location.pathname === "/assign-task" && "Assign New Task"}
                {location.pathname === "/fo-dashboard" && "My Tasks"}
                {location.pathname.startsWith("/task/") && "Task Details"}
                {location.pathname.startsWith("/ho-task/") && "Task Management"}
                {location.pathname === "/team" && "Team Management"}
                {location.pathname === "/notifications" && "Notifications"}
                {location.pathname === "/settings" && "Settings"}
                {location.pathname.startsWith("/case/scrutiny") && "Scrutiny Cases"}
                {location.pathname.startsWith("/case/audit") && "Audit Cases"}
                {location.pathname.startsWith("/case/usecases") && "Usecases"}
                {location.pathname.startsWith("/case/dealer-monitoring") && "Dealer Monitoring"}
                {location.pathname === "/fo/case-management" && "Case Management"}
               


              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
