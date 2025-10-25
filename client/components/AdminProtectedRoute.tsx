import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  currentUserRole: "ADMIN" | "HO" | "FO" | null;
}

export function AdminProtectedRoute({
  children,
  currentUserRole,
}: AdminProtectedRouteProps) {
  // If user is not authenticated, this should be handled at the App level
  // This component assumes the user is already authenticated

  // If user role is not Admin, show access denied
  if (currentUserRole !== "ADMIN") {
    const getDefaultDashboard = () => {
      switch (currentUserRole) {
        case "HO":
          return "/ho-dashboard";
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
            <CardTitle className="text-xl">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have permission to access this page. This section is
              restricted to Administrator users only.
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
                <a href={getDefaultDashboard()}>Go to Dashboard</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has admin access, render the protected content
  return <>{children}</>;
}
