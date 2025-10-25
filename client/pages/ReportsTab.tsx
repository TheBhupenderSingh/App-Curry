import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {  TabsContent} from "@/components/ui/tabs";
import { FileText, BarChart3, Settings } from 'lucide-react';

const ReportsTab = () => {
  // For Dashboard Data transfer.
  const userString = localStorage.getItem("currentUser");
  const localuser = JSON.parse(userString);
  const user = {
    name: localuser.name,
    role: localuser.role,
    designation: localuser.status,
    division: localuser.department,
  };

  return (
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Revenue Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const url = `http://localhost:7070/sectoralDashboard?name=${encodeURIComponent(
                  user.name
                )}&role=${encodeURIComponent(user.role)}&designation=${encodeURIComponent(
                  user.designation
                )}&division=${encodeURIComponent(user.division)}`;
                window.location.href = url;
              }}
            >
              Sectoral Revenue Overview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = 'http://localhost:7070/GstRevenueOverview')}
            >
              GST Revenue Overview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => (window.location.href = 'http://localhost:7070/SectorGeography')}
            >
              SLA Compliance Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                const url = `http://localhost:7070/SectorDBS?name=${encodeURIComponent(
                  user.name
                )}&role=${encodeURIComponent(user.role)}&designation=${encodeURIComponent(
                  user.designation
                )}&division=${encodeURIComponent(user.division)}`;
                window.location.href = url;
              }}
            >
              Sector and Division Performance
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Sector Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              
            >
              Risk & Compliance Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              
            >
              Sector Liability and Turnover
            </Button>
            <Button variant="outline" className="w-full justify-start">
              System Usage Reports
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Custom Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Taxpayer Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                (window.location.href =
                   "http://localhost:7070/taxpayeroverview")
              }
            >
              Active Taxpayer Overview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                (window.location.href =
                  'http://localhost:7070/NonFilersDashboard')
              }
            >
              Non Fillers Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                (window.location.href =
                  'https://lookerstudio.google.com/reporting/c26b9e84-20ab-48ff-aab2-566b2a4c7a59/page/G1vUF/edit')
              }
            >
              New Registration Overview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() =>
                (window.location.href =
                  'https://lookerstudio.google.com/reporting/c26b9e84-20ab-48ff-aab2-566b2a4c7a59/page/G1vUF/edit')
              }
            >
              Error Logs Summary
            </Button>
          </CardContent>
        </Card>
      </div>
   
  );
};

export default ReportsTab;