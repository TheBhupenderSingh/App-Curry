import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemSettingsComponent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Security Settings</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Password Policies
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Session Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Access Control
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Database Management</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Backup Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Data Cleanup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Performance Optimization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
