import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { Login } from "./pages/Login";
import { HODashboard } from "./pages/HODashboard";
import { FODashboard } from "./pages/FODashboard";
import { AssignTask } from "./pages/AssignTask";
import { TaskDetails } from "./pages/TaskDetails";
import { HOTaskDetails } from "./pages/HOTaskDetails";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserManagement } from "./pages/UserManagement";
import SystemSettings  from "./pages/SystemSettings" ;
import MasterManagement from "./pages/MasterManagement"
import NotFound from "./pages/NotFound";
import ReportsTab from "./pages/ReportsTab";
import CaseScrutiny from "./pages/CaseScrutiny";
import FoCaseManagement from "./pages/FoCaseManagement";
import ModuleLanding from "./components/ModuleLanding";
import ReviewCases from "./pages/ReviewCases";
import { Home } from "lucide-react";
import HOHomePage from "./pages/HOHomePage";
import DealerMonitoringAssign from "./pages/DealerMonitoringAssign";
import DealerMonitoringReview from "./pages/DealerMonitoringReview";
import NonFilers from "./pages/NonFilers";
import TaxpayerReport from "./pages/TaxpayerReport";
import RiskFactorFilter from "./pages/RiskFactorFilter";
import RiskDashboard from "./pages/RiskDashboard";
import RiskModelPredictions from "./pages/RiskModelPredictions";
import EnforcementOverview from "./pages/EnforcementOverview";
import NGTPOverview from "./pages/NGTPOverview";
import ActiveTaxpayerOverview from "./Dashboards/ActiveTaxpayerOverview";
import SectoralDashboard from "./Dashboards/SectoralDashboard";
import GstRevenueOverview from "./Dashboards/GstRevenueOverview";
import DashboardTVPage from "./Dashboards/DashboardTVPage";



function AppContent() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"ADMIN" | "HO" | "FO" | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);  // <-- NEW

  // Check authentication status on app load
  useEffect(() => {
    const verifyAuthentication = async () => {
      const storedUser = localStorage.getItem("currentUser");
      const storedRole = localStorage.getItem("userRole");
      const storedToken = localStorage.getItem("authToken");

      if (storedUser && storedRole && storedToken) {
        try {
          // Verify token with server
          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: storedToken }),
          });

          const data = await response.json();

          if (data.success) {
            // Token is valid, restore user session
            setCurrentUser(JSON.parse(storedUser));
            setUserRole(storedRole as "ADMIN" | "HO" | "FO");
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem("currentUser");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("authToken");
          }
          
        } catch (error) {
          console.error("Token verification error:", error);
          // On network error, allow user to continue (offline capability)
          setCurrentUser(JSON.parse(storedUser));
          setUserRole(storedRole as "ADMIN" | "HO" | "FO");
        }
      }
       setIsAuthChecking(false);   // <-- FINALLY SET
    };

    verifyAuthentication();
  }, []);

  if (isAuthChecking) {
    return null; // or a loader
  }

  

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Call logout API
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  // Get default route based on user role
  const getDefaultRoute = () => {
    switch (userRole) {
      case "ADMIN":
        return "/admin-dashboard";
      case "HO":
        return "/hoHomepage";
      case "FO":
        return "/foHomepage";
      default:
        return "/";
    }
  };

  // If not authenticated and not on login page, redirect to login
  if (!currentUser || !userRole) {
    // If already on login page, don't redirect
    if (location.pathname === "/login") {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect to appropriate dashboard
  if (location.pathname === "/login") {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return (
    <Layout userRole={userRole} onLogout={handleLogout}>
      <Routes>
        {/* Default route based on user role */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        
        <Route path="/GetTaxpayerDetails" element={<TaxpayerReport />} />
        <Route path="/FraudAnalysis" element={<RiskFactorFilter />} />
        <Route path="/RiskAA" element={<RiskDashboard />} />
        <Route path="/RiskTable" element={<RiskModelPredictions />} />
        <Route path="/Enforcement" element={<EnforcementOverview />} />
        <Route path="/NGTP" element={<NGTPOverview />} />
        <Route path="/ActiveTaxpayerOverview" element={<ActiveTaxpayerOverview />} />
        <Route path="/SectoralDashboard" element={<SectoralDashboard />} />
        <Route path="/GstRevenueOverview" element={<GstRevenueOverview />} />
        <Route path="/TvDashboard" element={<DashboardTVPage />} />
       

        



        
        {/* Cases Scrutiny" */}
        <Route path="/case/scrutiny" element={
        <ModuleLanding 
         title="Scrutiny"
         assignPath="/scrutiny/assign"
         reviewPath="/scrutiny/review"
         />
        } />
        <Route path="/scrutiny/assign" element={<CaseScrutiny />} />
        <Route path="/scrutiny/review" element={<ReviewCases />} />

        <Route path="/case/dealer-monitoring" element={
        <ModuleLanding 
         title="Dealer Monitoring"
         assignPath="/dealer/assign"
         reviewPath="/dealer/review"
         />
        } />
        <Route path="/dealer/assign" element={<DealerMonitoringAssign />} />
       
        
    
        <Route path="/foHomepage" element={<HOHomePage />} />
        <Route path="/hoHomepage" element={<HOHomePage />} />
        <Route path="/nonfilers" element={<NonFilers />} />



        {/* Cases Audit" */}
        <Route path="/case/audit" element={
        <ModuleLanding 
         title="Audit"
         assignPath="/audit/assign"
         reviewPath="/audit/review"
           />
         } />
        

        <Route path="/fo/case-management" element={<FoCaseManagement />} />



        {/* Admin Routes - Always available but protected */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <UserManagement />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <SystemSettings />
              </div>
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <AdminProtectedRoute currentUserRole={userRole}>
              <div className="text-center py-12">              
                <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
                <p className="text-muted-foreground">
                  System audit logs coming soon...
                </p>
              </div>
            </AdminProtectedRoute>
          }
        />

        {/* HO Routes - Always available */}
        <Route path="/ho-dashboard" element={<HODashboard />} />
        <Route path="/ho-task/:id" element={<HOTaskDetails />} />
        <Route path="/assign-task" element={<AssignTask />} />
        
        
        
        <Route
          path="/team"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Team Management</h2>
              <p className="text-muted-foreground">
                Team management page coming soon...
              </p>
            </div>
          }
        />

        {/* FO Routes - Always available */}
        <Route path="/fo-dashboard" element={<FODashboard />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route
          path="/task/:id/edit"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
              <p className="text-muted-foreground">
                Task editing page coming soon...
              </p>
            </div>
          }
        />
        <Route
          path="/notifications"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-muted-foreground">
                Notifications page coming soon...
              </p>
            </div>
          }
        />

        {/* Common Routes */}
        <Route
          path="/settings"
          element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <p className="text-muted-foreground">
             {/*   Settings page coming soon...  */}   
                <ReportsTab />   
              </p>
            </div>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
