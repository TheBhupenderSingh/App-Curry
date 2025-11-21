import { useState, useMemo, useEffect } from "react";
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
  ResponsiveContainer,
} from "recharts";
import { DashboardMap, generateSampleMapData } from "../ui/map-chart";
import axios from "axios";
import { BASE_URL } from "@/config";

interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A569BD", "#E74C3C", "#10B981", "#6366F1"
];

export default function ActiveTaxpayerOverview() {
  const [sector, setSector] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const [circle, setCircle] = useState<string | null>(null);
  
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);


  const [mapData] = useState(generateSampleMapData());

const [kpiData, setKpiData] = useState<any[]>([]);


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



// Dummy Data
const [taxpayerSummary, setTaxpayerSummary] = useState<any[]>([]);

const [pieDivision, setPieDivision] = useState<any[]>([]);

const [pieBusiness, setPieBusiness] = useState<any[]>([]);
const [lineData, setLineData] = useState<any[]>([]);

  // === Filter States ===
  const filter = useMemo(
      () => ({
        sector,
        division,
        circle,
        designation: null,
      }),
      [sector, division, circle]
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
        const kpiRes = await axios.post(BASE_URL + "/taxpayeroverview/kpis", filter);
        setKpiData(kpiRes.data);
      
        // Taxpayer Summary
        const summaryRes = await axios.post(BASE_URL + "/taxpayeroverview/taxpayersSummary", filter);
        setTaxpayerSummary(summaryRes.data);

        
           // Pie - Division
        const divisionRes = await axios.post(BASE_URL + "/taxpayeroverview/taxpayersByDivision", filter);
        setPieDivision(divisionRes.data);

        // Pie - Business
        const businessRes = await axios.post(BASE_URL + "/taxpayeroverview/taxpayersByBusiness", filter);
        setPieBusiness(businessRes.data);

        // Line Data (year wise)
        const yearRes = await axios.post(BASE_URL + "/taxpayeroverview/taxpayersOverYears", filter);
        setLineData(yearRes.data);
        
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, [filter]); 


  // Memoized filter object (similar to SectoralDashboard)
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">📊 Active Taxpayer Overview</h1>
     

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

      {/* KPI Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpiData.map((card) => (
        <div key={card.title} className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">{card.title}</p>
          <h2 className="text-xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>

      {/* Charts + Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taxpayer Table */}
        <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
          <h3 className="font-semibold mb-2">Taxpayer Summary</h3>
          <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-2 py-1 text-left">Type</th>
                <th className="border border-gray-200 px-2 py-1 text-right">State</th>
                <th className="border border-gray-200 px-2 py-1 text-right">Center</th>
                <th className="border border-gray-200 px-2 py-1 text-right">Total</th>
                <th className="border border-gray-200 px-2 py-1 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {taxpayerSummary.map((row) => (
                <tr key={row.type} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1">{row.type}</td>
                  <td className="border border-gray-200 px-2 py-1 text-right">{row.state.toLocaleString()}</td>
                  <td className="border border-gray-200 px-2 py-1 text-right">{row.center.toLocaleString()}</td>
                  <td className="border border-gray-200 px-2 py-1 text-right">{row.total.toLocaleString()}</td>
                  <td className="border border-gray-200 px-2 py-1 text-right">{row.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pie Charts */}
        <div className="bg-white shadow rounded-xl p-4 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-xl p-4 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <h3 className="font-semibold mb-2">Taxpayer by Division</h3>
    <ResponsiveContainer width="100%" height={290}>
      <PieChart>
        <Pie data={pieDivision} dataKey="value" nameKey="name" outerRadius={85}>
          {pieDivision.map((entry, i) => (
            <Cell 
              key={i} 
              fill={CIRCLE_COLOR_MAP[entry.name] || "#cccccc"} // fallback
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

          <div>
            <h3 className="font-semibold mb-2">Taxpayer by Business Constitution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieBusiness} dataKey="value" nameKey="name" outerRadius={85}>
                  {pieBusiness.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white shadow rounded-xl p-4 col-span-2">
          <DashboardMap data={mapData} title="Geographic Performance" center={[39.8283, -98.5795]} zoom={4} />
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded-xl p-4 col-span-2">
          <h3 className="font-semibold mb-2">Addition of Taxpayer Over the Years</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="taxpayers" stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
