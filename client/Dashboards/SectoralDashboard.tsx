import { BASE_URL } from "@/config";
import axios from "axios";
import React, { useState, useMemo ,useEffect, useRef } from "react";
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

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A569BD", "#E74C3C", "#10B981", "#6366F1"
];

const SectoralDashboard: React.FC = () => {
  // === Filter States ===
  const [filters, setFilters] = useState({
    gstType: "All",
    division: "All",
    circle: "All",
    filingDate: "All",
    sector: "All",
    tradeName: "All",
  });

interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}

  const [sector, setSector] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const [circle, setCircle] = useState<string | null>(null);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);

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


  const filter = useMemo(
    () => ({
      sector,
      division,
      circle,
      designation: null,
    }),
    [sector, division, circle]
  );

 //Taking User Details from queries in URL
  const [user, setUser] = useState<{ division: string | null; name: string | null ;role: string | null ; designation: string | null }>({
    division: null,
    name: null,
    role :null ,
    designation :null ,
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setUser({
    division: query.get("division"),
    name: query.get("name"),
    role :query.get("role"),
    designation :query.get("designation"),
    });

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
    

  Promise.all([
    axios.post(BASE_URL + "/sectoralRevenue/kpis", filter),
    axios.post(BASE_URL + "/sectoralRevenue/sgstbysector", filter),
    axios.post(BASE_URL + "/sectoralRevenue/contributiondivision", filter),
    axios.post(BASE_URL + "/sectoralRevenue/yoyChange", filter),
    axios.post(BASE_URL + "/sectoralRevenue/gstPaidOverMonths", filter),
    axios.post(BASE_URL + "/sectoralRevenue/topContributors", filter) ,
    axios.post(BASE_URL + "/sectoralRevenue/sectorRanking", filter),
    axios.post(BASE_URL + "/sectoralRevenue/dealerRanking", filter),
  ])
    .then(([
      kpisRes,
      sgstRes,
      divisionRes,
      yoyRes,
      gstPaidRes,
      topContribRes,
      sectorRankRes,
      dealerRankRes
    ]) => {
      setKpis(kpisRes.data);
      setSgstBySector(sgstRes.data);
      setContributionDivision(divisionRes.data);
      setYoyChange(yoyRes.data);
      setGstPaidOverMonths(gstPaidRes.data);
      setTopContributors(topContribRes.data);
      setSectorRanking(sectorRankRes.data);
      setDealerRanking(dealerRankRes.data);
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
    });
  }, [filter]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // === Dummy KPI Data ===
const [kpis, setKpis] = useState<any>({  });
  // === Original Chart Data ===
const [sgstBySector, setSgstBySector] = useState<any[]>([]);
const [contributionDivision, setContributionDivision] = useState<any[]>([  ]);
const [yoyChange, setYoyChange] = useState<any[]>([  ]);
const [gstPaidOverMonths, setGstPaidOverMonths] = useState<any[]>( [ ]);
const [topContributors, setTopContributors] = useState<any[]>([]);
const [sectorRanking, setSectorRanking] = useState<any[]>([]);
const [dealerRanking, setDealerRanking] = useState<any[]>([]);



  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Sectoral Revenue Overview </h1>

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Target(Cr.)</p>
          <h2 className="text-xl font-bold">{kpis.target}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Received(Cr.)</p>
          <h2 className="text-xl font-bold">{kpis.received}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Difference</p>
          <h2 className="text-xl font-bold">{kpis.difference}</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500">Achieved</p>
          <h2 className="text-xl font-bold">{kpis.achieved}%</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
  <p className="text-gray-500">YOY Growth</p>
  <h2 className="text-xl font-bold">{kpis.yoyGrowth?.toFixed(2)}%</h2>
</div>
        
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SGST by Sector Pie */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold mb-2">SGST + IGST Paid by Sector</h3>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie data={sgstBySector} dataKey="value" nameKey="name" outerRadius={85}>
                {sgstBySector.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend  layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{marginTop: "20px", paddingTop: '10px', fontSize: '12px' }}
                            formatter={(value) => value.length > 20 ? `${value.slice(0, 17)}...` : value} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Contribution Pie */}
        <div className="bg-white shadow rounded-xl p-4">
  <h3 className="font-semibold mb-2">% Contribution - SGST + IGST Paid</h3>
  <ResponsiveContainer width="100%" height={290}>
    <PieChart>
      <Pie data={contributionDivision} dataKey="value" nameKey="name" outerRadius={90}>
        {contributionDivision.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={CIRCLE_COLOR_MAP[entry.name] || "#cccccc"} // Fallback if not found
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

        {/* YOY Change */}
        <div className="bg-white shadow rounded-xl p-4 col-span-2">
          <h3 className="font-semibold mb-2">YOY Change for SGST + IGST & Total Tax Liability</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yoyChange}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="liability" stroke="#6366F1" name="Total Tax Liability" />
              <Line type="monotone" dataKey="sgst" stroke="#10B981" name="SGST + IGST Paid" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GST Paid by Year & Month */}
        
      </div>

      {/* Top Contributors Table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <h3 className="font-semibold mb-2">Top 30 Contributors by SGST + IGST</h3>
        <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-2 py-1">Name</th>
              <th className="border border-gray-200 px-2 py-1">Total Tax Liability</th>
              <th className="border border-gray-200 px-2 py-1">SGST Paid</th>
              <th className="border border-gray-200 px-2 py-1">Revenue</th>
              <th className="border border-gray-200 px-2 py-1">YoY Growth</th>
            </tr>
          </thead>
          <tbody>
            {topContributors.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-1">{row.name}</td>
                <td className="border border-gray-200 px-2 py-1">{row.liability}</td>
                <td className="border border-gray-200 px-2 py-1">{row.sgst}</td>
                <td className="border border-gray-200 px-2 py-1">{row.revenue}</td>
                <td className="border border-gray-200 px-2 py-1">{row.momGrowth}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ranking Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
          <h3 className="font-semibold mb-2">Sector Ranking Over Years</h3>
          <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-2 py-1">Sector</th>
                <th className="border border-gray-200 px-2 py-1">Rank 2022-23</th>
                <th className="border border-gray-200 px-2 py-1">Rank 2023-24</th>
              </tr>
            </thead>
            <tbody>
              {sectorRanking.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1">{row.sector}</td>
                  <td className="border border-gray-200 px-2 py-1">{row.rank2022}</td>
                  <td className="border border-gray-200 px-2 py-1">{row.rank2023}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
          <h3 className="font-semibold mb-2">Dealer Ranking Over Years</h3>
          <table className="table-auto border-collapse border border-gray-200 w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-2 py-1">Dealer</th>
                <th className="border border-gray-200 px-2 py-1">Rank 2022-23</th>
                <th className="border border-gray-200 px-2 py-1">Rank 2023-24</th>
              </tr>
            </thead>
            <tbody>
              {dealerRanking.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-2 py-1">{row.dealer}</td>
                  <td className="border border-gray-200 px-2 py-1">{row.rank2022}</td>
                  <td className="border border-gray-200 px-2 py-1">{row.rank2023}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectoralDashboard;
