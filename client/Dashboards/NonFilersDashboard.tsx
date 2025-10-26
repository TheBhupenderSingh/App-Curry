// src/components/NonFilersDashboard.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DivisionData = {
  division: string;
  activeFilers: number;
  defaulters: number;
  nonFilerPct: number;
  revenue: number;
  monthNonFilers: number[];
};

type CircleData = {
  circle: string;
  gstin: string;
  revenue: number;
};

const dummyDivisionData: DivisionData[] = [
  { division: "Ambikapur", activeFilers: 505, defaulters: 37, nonFilerPct: 7.33, revenue: 0.04, monthNonFilers: [30, 4, 1, 1, 1, 0] },
  { division: "Bilaspur-1", activeFilers: 928, defaulters: 48, nonFilerPct: 5.17, revenue: 2.73, monthNonFilers: [36, 9, 2, 0, 0, 0] },
  { division: "Bilaspur-2", activeFilers: 1184, defaulters: 42, nonFilerPct: 3.55, revenue: 0.53, monthNonFilers: [35, 5, 4, 0, 0, 0] },
  { division: "Durg", activeFilers: 1669, defaulters: 74, nonFilerPct: 4.43, revenue: 1.2, monthNonFilers: [58, 11, 2, 3, 0, 0] },
  { division: "Jagdalpur", activeFilers: 451, defaulters: 43, nonFilerPct: 9.53, revenue: 0.42, monthNonFilers: [35, 5, 2, 1, 0, 0] },
  { division: "Nava Raipur", activeFilers: 693, defaulters: 32, nonFilerPct: 4.62, revenue: 1.29, monthNonFilers: [28, 3, 1, 0, 0, 0] },
  { division: "Raipur-1", activeFilers: 1782, defaulters: 40, nonFilerPct: 2.24, revenue: 0.55, monthNonFilers: [28, 7, 3, 2, 0, 0] },
  { division: "Raipur-2", activeFilers: 1679, defaulters: 47, nonFilerPct: 2.8, revenue: -0.52, monthNonFilers: [39, 6, 1, 1, 0, 0] },
  { division: "Korba", activeFilers: 823, defaulters: 29, nonFilerPct: 3.52, revenue: 0.67, monthNonFilers: [22, 4, 2, 1, 0, 0] },
  { division: "Kanker", activeFilers: 502, defaulters: 31, nonFilerPct: 6.18, revenue: 0.38, monthNonFilers: [25, 4, 2, 0, 0, 0] },
];

const dummyCircleData: CircleData[] = [
  { circle: "Raipur-11", gstin: "22IQBPD9463H1ZT", revenue: 6813578.9 },
  { circle: "Durg-2", gstin: "22ECUPR0719B1ZO", revenue: 49358.6 },
  { circle: "Bilaspur-2", gstin: "22BZPM6363E1ZM", revenue: 2727.0 },
  { circle: "Ambikapur-1", gstin: "22BFKPA4440J1ZT", revenue: -2622858.1 },
  { circle: "Korba-3", gstin: "22KORB2227KOR", revenue: 12637.4 },
  { circle: "Kanker-2", gstin: "22KAN0099ZK2", revenue: 8520.7 },
  { circle: "Jagdalpur-1", gstin: "22JAG8832J1T", revenue: 16288.9 },
  { circle: "Nava Raipur-1", gstin: "22NVR4459NV1", revenue: 37822.6 },
];

const nonFilersByMonths = [
  { name: "1M", value: 274 },
  { name: "2M", value: 49 },
  { name: "3M", value: 15 },
  { name: "4M", value: 6 },
  { name: "5M", value: 2 },
  { name: "6M+", value: 2 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8854d0", "#fd9644", "#26de81", "#a55eea", "#e84393", "#6c5ce7"];

const NonFilersDashboard: React.FC = () => {
  const [divisionFilter, setDivisionFilter] = useState<string>("All");
  const [circleFilter, setCircleFilter] = useState<string>("All");
  const [turnoverFilter, setTurnoverFilter] = useState<string>("More than 5 Cr");

  // filter logic
  const filteredDivisions = divisionFilter === "All"
    ? dummyDivisionData
    : dummyDivisionData.filter((d) => d.division === divisionFilter);

  const filteredCircles = circleFilter === "All"
    ? dummyCircleData
    : dummyCircleData.filter((c) => c.circle === circleFilter);

  const totalRevenue = filteredDivisions.reduce((acc, d) => acc + d.revenue, 0).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center">Non Filers Dashboard</h1>

      {/* Top Cards & Filters */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Estimated Revenue (Cr)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalRevenue}</p>
          </CardContent>
        </Card>
        <Select onValueChange={(v) => setDivisionFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Division" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {dummyDivisionData.map((d) => (
              <SelectItem key={d.division} value={d.division}>{d.division}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setCircleFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Circle" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {dummyCircleData.map((c) => (
              <SelectItem key={c.circle} value={c.circle}>{c.circle}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setTurnoverFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Turnover Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="More than 5 Cr">More than 5 Cr</SelectItem>
            <SelectItem value="1 Cr - 5 Cr">1 Cr - 5 Cr</SelectItem>
            <SelectItem value="Less than 1 Cr">Less than 1 Cr</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Division Table */}
      <Card>
        <CardHeader>
          <CardTitle>Division Data</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Division</th>
                <th>Active Filers</th>
                <th>Defaulters</th>
                <th>% Non Filers</th>
                <th>Revenue (Cr)</th>
                <th>1M</th>
                <th>2M</th>
                <th>3M</th>
                <th>4M</th>
                <th>5M</th>
                <th>6M+</th>
              </tr>
            </thead>
            <tbody>
              {filteredDivisions.map((d) => (
                <tr key={d.division} className="text-center border-t">
                  <td>{d.division}</td>
                  <td>{d.activeFilers}</td>
                  <td>{d.defaulters}</td>
                  <td>{d.nonFilerPct}%</td>
                  <td>{d.revenue.toFixed(2)}</td>
                  {d.monthNonFilers.map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Circles Table */}
      <Card>
        <CardHeader>
          <CardTitle>6+ Months Non Filers by Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Circle</th>
                <th>GSTIN</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredCircles.map((c) => (
                <tr key={c.circle} className="text-center border-t">
                  <td>{c.circle}</td>
                  <td>{c.gstin}</td>
                  <td>{c.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Estimated Revenue by Division</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie data={filteredDivisions} dataKey="revenue" nameKey="division" outerRadius={100}>
                {filteredDivisions.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Non Filers by Months</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie data={nonFilersByMonths} dataKey="value" nameKey="name" outerRadius={100}>
                {nonFilersByMonths.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      <Card>
  <CardHeader><CardTitle>Top 10 Circles by % Non Filers</CardTitle></CardHeader>
  <CardContent className="flex justify-center">
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={filteredDivisions} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="division" 
          angle={-45} 
          textAnchor="end" 
          interval={0}   // show all labels, no skipping
          height={80}    // give space for rotated labels
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="nonFilerPct" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
    </div>
  );
};

export default NonFilersDashboard;
