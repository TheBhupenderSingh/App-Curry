import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("ADMIN" | "HO" | "FO")[];
  currentUserRole: "ADMIN" | "HO" | "FO" | null;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  currentUserRole,
  fallbackPath,
}: ProtectedRouteProps) {
  // If user is not authenticated, redirect to login
  if (!currentUserRole) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, show access denied page
  if (!allowedRoles.includes(currentUserRole)) {
    const getDefaultDashboard = () => {
      switch (currentUserRole) {
        case "ADMIN":
          return "/admin-dashboard";
        case "HO":
          return "/hoHomepage";
        case "FO":
          return "/fo-dashboard";
        default:
          return "/";
      }
    };

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access this page. This section is
              restricted to{" "}
              {allowedRoles.length === 1
                ? `${allowedRoles[0]} users`
                : `${allowedRoles.slice(0, -1).join(", ")} and ${allowedRoles.slice(-1)} users`}
              .
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button asChild size="sm">
                <a href={fallbackPath || getDefaultDashboard()}>
                  Go to Dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render the protected content
  return <>{children}</>;
}
