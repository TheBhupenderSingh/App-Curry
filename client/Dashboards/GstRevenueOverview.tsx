import { BASE_URL } from "@/config";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}


const GstRevenueOverview: React.FC = () => {
  // === Dummy Data (enhanced with circle & FY info) ===

   const [allPieData, setAllPieData] = useState<any[]>([]);
   const [allTargetVsReceived, setAllTargetVsReceived] = useState<any[]>([]);
   const [targetAchievedOverTime, setTargetAchievedOverTime] = useState<any[]>([]);

   const [kpis, setKpis] = useState<any>({
    target: 0,
    received: 0,
    difference: 0,
    achieved: 0,
    yoyGrowth: 0,
    });

    const CIRCLE_COLOR_MAP = {
  "Kolkata (North) Circle": "#4e79a7",
  "Kolkata (South) Circle": "#f28e2b",
  "Burrabazar Circle": "#e15759",
  "Chowringhee Circle": "#76b7b2",
  "Dharmatala Circle": "#59a14f",
  "24-Parganas Circle": "#edc948",
  "Behala Circle": "#b07aa1",
  "Howrah Circle": "#ff9da7",
  "Bally Circle": "#9c755f",
  "Midnapore Circle": "#bab0ab",
  "Asansol Circle": "#6b5b95",
  "Durgapur Circle": "#88b04b",
  "Berhampore Circle": "#ffa500",
  "Siliguri Circle": "#008080",
  "Raiganj Circle": "#d65076",
  "Jalpaiguri Circle": "#45b8ac",
};

   const [allTableData, setAllTableData] = useState<any[]>([]);
   const [yoyGrowth, setYoyGrowth] = useState<any[]>([]);
   const [momGrowth, setMomGrowth] = useState<any[]>([]);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);

  const [sector, setSector] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const [circle, setCircle] = useState<string | null>(null);

   const filter = useMemo(
    () => ({
      sector,
      division,
      circle,
      designation: null,
    }),
    [sector, division, circle]
  );

  const yoyGrowthYearly = Object.values(
  yoyGrowth.reduce((acc, item) => {
    const year = item.month.split(" ")[1];

    if (!acc[year]) {
      acc[year] = { year, growth: 0 };
    }

    acc[year].growth += item.growth; // sum
    return acc;
  }, {})
);


    useEffect(() => {
        const fetchData = async () => {
          try {
             fetch(BASE_URL + "/admin/divisions")
        .then((res) => res.json())
        .then(setDivisions)
        .catch((err) => console.error("Error fetching divisions:", err));
    
        fetch(BASE_URL + "/admin/subdivisions")
        .then((res) => res.json())
        .then(setSubdivisions)
        .catch((err) => console.error("Error fetching subdivisions:", err));
    
        fetch(BASE_URL + "/sectoralRevenue/sectors")
        .then((res) => res.json())
        .then(setSectors)
        .catch((err) => console.error("Error fetching sectors:", err));
            // KPIs
        const pieData = await axios.post(BASE_URL + "/gstrevenueOverview/allPieData", filter);
        setAllPieData(pieData.data);

         const tvsr = await axios.post(BASE_URL + "/gstrevenueOverview/targetVsReceived", filter);
        setAllTargetVsReceived(tvsr.data);

        const tvar =  await axios.post(BASE_URL + "/gstrevenueOverview/targetAchievedOverTime", filter);
        setTargetAchievedOverTime(tvar.data);
           
        const kpi =  await axios.post(BASE_URL + "/gstrevenueOverview/kpis", filter);
        setKpis(kpi.data);

        const table =await axios.post(BASE_URL + "/gstrevenueOverview/allTableData", filter);
        setAllTableData(table.data);

        const yoy =await axios.post(BASE_URL + "/gstrevenueOverview/yoyGrowth", filter);
        setYoyGrowth(yoy.data);

        const mom = await axios.post(BASE_URL + "/gstrevenueOverview/momGrowth", filter);
        setMomGrowth(mom.data);
            
          } catch (err) {
            console.error("Error fetching dashboard data", err);
          }
        };
    
        fetchData();
      }, [filter]); 

      
  // === Filter State ===
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [selectedCircle, setSelectedCircle] = useState<string>("All");
  const [selectedFY, setSelectedFY] = useState<string>("All");

  // === Filter Logic ===
  const filterData = <T extends { name?: string; division?: string; circle?: string; fy?: string }>(data: T[]) => {
    return data.filter((item) => {
      const divisionMatch =
        selectedDivision === "All" ||
        item.name === selectedDivision ||
        item.division === selectedDivision;
      const circleMatch = selectedCircle === "All" || item.circle === selectedCircle;
      const fyMatch = selectedFY === "All" || item.fy === selectedFY;
      return divisionMatch && circleMatch && fyMatch;
    });
  };

  const filteredPieData = filterData(allPieData);
  const filteredTargetVsReceived = filterData(allTargetVsReceived);
  const filteredTableData = filterData(allTableData);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📊 GST Revenue Overview</h1>
       <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-xl p-4 grid grid-cols-2 md:grid-cols-6 gap-4">
      
        <select name="division" value={division ?? ""} onChange={(e) => {  const value = e.target.value;
       setDivision(value === "" ? null : value);}} className="border p-2 rounded">
       <option value="">All Divisions</option>
      {divisions.map((d) => (
       <option key={d.id} value={d.name}>
       {d.name}
       </option> ))} </select>
      
      
    <select name="circle" value={circle ?? ""} onChange={(e) => {  const value = e.target.value;
    setCircle(value === "" ? null : value);   }} className="border p-2 rounded" >
     <option value="">All Subdivisions</option>
  {subdivisions
    .filter((s) => !division || s.division.name === division) // filter by selected division
    .map((s) => (
      <option key={s.id} value={s.name}>
        {s.name}
      </option>
    ))}
  </select>

  <select
  name="sector"
  value={sector ?? ""}
  onChange={(e) => setSector(e.target.value === "" ? null : e.target.value)}
  className="border p-2 rounded"
>
  <option value="">All Sectors</option>
  {sectors.map((s, i) => (
    <option key={i} value={s}>{s}</option>
  ))}
</select>

      </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Target (Cr.)</p>
          <h2 className="text-xl font-bold">{kpis.target}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Received (Cr.)</p>
          <h2 className="text-xl font-bold">{kpis.received}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Difference </p>
          <h2 className="text-xl font-bold">{kpis.difference}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Achieved </p>
          <h2 className="text-xl font-bold">{kpis.achieved}%</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
  <p className="text-gray-500">YOY Growth</p>
  <h2 className="text-xl font-bold">{kpis.yoyGrowth.toFixed(2)}%</h2>
</div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">% Contribution on Received</h3>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie data={filteredPieData} dataKey="value" nameKey="name" outerRadius={90}>
  {filteredPieData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={CIRCLE_COLOR_MAP[entry.name] || "#cccccc"} // fallback if any key missing
    />
  ))}
</Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* MoM Growth */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">MoM Growth of Received</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={momGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="growth" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Target vs Received */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">Target vs Received by Division & Circle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredTargetVsReceived}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
  dataKey="division"
  angle={-35}
  textAnchor="end"
  tick={{ fontSize: 10 }}
  interval={0}        // show all labels
  height={60}         // extra space for rotated text
/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#f87171" name="Target" />
              <Bar dataKey="received" fill="#34d399" name="Received" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* YoY Growth */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">YoY Growth of Received</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yoyGrowthYearly}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="year" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="growth" stroke="#10b981" />
</LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target Achieved Over Time */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="font-semibold mb-2">Target Achieved Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={targetAchievedOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="variance" fill="#f87171" name="Variance %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <h3 className="font-semibold mb-2">Division Summary</h3>
        <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-2 py-1">Division</th>
              <th className="border border-gray-200 px-2 py-1">Circle</th>
              <th className="border border-gray-200 px-2 py-1">FY</th>
              <th className="border border-gray-200 px-2 py-1">Target</th>
              <th className="border border-gray-200 px-2 py-1">Received</th>
              <th className="border border-gray-200 px-2 py-1">Rank (Target)</th>
              <th className="border border-gray-200 px-2 py-1">Rank (Achieved)</th>
              <th className="border border-gray-200 px-2 py-1">Variance</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-1">{row.division}</td>
                <td className="border border-gray-200 px-2 py-1">{row.circle}</td>
                <td className="border border-gray-200 px-2 py-1">{row.fy}</td>
                <td className="border border-gray-200 px-2 py-1">{row.target}</td>
                <td className="border border-gray-200 px-2 py-1">{row.received}</td>
                <td className="border border-gray-200 px-2 py-1">{row.rankTarget}</td>
                <td className="border border-gray-200 px-2 py-1">{row.rankAchieved}</td>
                <td className="border border-gray-200 px-2 py-1">{row.variance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GstRevenueOverview;
