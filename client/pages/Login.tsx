import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import  Header  from "@/components/ui/header" ;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Users,
  Briefcase,
  AlertCircle,
} from "lucide-react";


// Authentication API interface
interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number; 
    name: string;
    email: string;
    role: string;
    permissions: string[];
    department: string;
    status: string;
  };
  token?: string;
}

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call authentication API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role || undefined,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!data.user || !data.token) {
        setError("Invalid response from server. Please try again");
        setIsLoading(false);
        return;
      }

      // Store user data and token in localStorage
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", String(data.user.id));


      // Automatically navigate to appropriate dashboard based on user role
      switch (data.user.role) {
        case "ADMIN":
       //   navigate("/admin-dashboard");
         navigate("/");
         window.location.reload();
          break;
        case "HO":
    //      navigate("/ho-dashboard");
          navigate("/");
         window.location.reload();
          break;
        case "FO":
       //   navigate("/fo-dashboard");
            navigate("/");
          window.location.reload();
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userType: "ADMIN" | "HO" | "FO") => {
    const credentials = {
      ADMIN: { email: "karan01@gmail.com", password: "root" },
      HO: { email: "kamal@gmail.com", password: "root" },
      FO: { email: "kishorg@gmail.com", password: "root" },
    };

    // Set form data first
    const loginData = {
      ...credentials[userType],
      role: userType,
    };

    setFormData(loginData);
    setIsLoading(true);
    setError("");

    try {
      // Automatically login with the selected credentials
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: loginData.role,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!data.success) {
        setError(data.message || "Quick login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!data.user || !data.token) {
        setError("Invalid response from server. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store user data and token
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", String(data.user.id));

      // Navigate to appropriate dashboard
      switch (data.user.role) {
        case "ADMIN":
       //   navigate("/admin-dashboard");
          navigate("/");
          window.location.reload();
          break;
        case "HO":
     //     navigate("/ho-dashboard");
            navigate("/");
         window.location.reload();
          break;
        case "FO":
      //    navigate("/fo-dashboard");
          navigate("/");
         window.location.reload();
          break;
        default:
        navigate("/");
      }
    } catch (error) {
      console.error("Quick login error:", error);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          
          <div className="space-y-4">
             
            <div className="flex items-center justify-center lg:justify-start space-x-3">
             
              <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                <CheckSquare className="h-7 w-7 text-primary-foreground" />
              </div>
               <Header />
              <div>
                <h1 className="text-3xl font-bold text-foreground">PragATI</h1>
                <p className="text-sm text-muted-foreground">
                  Performance Review, Analytics & Governance for Advanced Tax Intelligence
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your dashboard and manage tasks efficiently
                across your organization.
              </p>
            </div>
          </div>

          {/* Quick Login Demo Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick login tabs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                onClick={() => quickLogin("ADMIN")}
              >
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Administrator</h4>
                  <p className="text-xs text-muted-foreground">
                    Full system access
                  </p>
                  <Badge className="mt-2 bg-purple-100 text-purple-800">
                    Demo
                  </Badge>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                onClick={() => quickLogin("HO")}
              >
                <CardContent className="p-4 text-center">
                  <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Head Office</h4>
                  <p className="text-xs text-muted-foreground">
                    Task management
                  </p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">Demo</Badge>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                onClick={() => quickLogin("FO")}
              >
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">Field Officer</h4>
                  <p className="text-xs text-muted-foreground">
                    Task execution
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Demo
                  </Badge>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-muted-foreground">
              Click any card above for instant demo access
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-lg mt-12 lg:mt-20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Demo Credentials:</p>
              <p>Admin: karan01@gmail.com / root</p> 
              <p>HO: amank@gmail.com / root</p>
              <p>FO: kishorg@gmail.com / root</p> 
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
       <div className="absolute bottom-4 right-4 text-sm font-semibold text-gray-500">
    © Deloitte
  </div>
    </div>
  );
}
