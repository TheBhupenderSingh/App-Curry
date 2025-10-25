import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import * as XLSX from "xlsx";
import axios from "axios";


import { saveAs } from "file-saver";


interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}

interface Taxpayer {
  gstin: string;
  division: string;
  circle: string;
  tradeLegalName: string;
  assignedTo: string;
  mobileNo: string;
  emailId: string;
  dateOfGrantOfRegistration: string | null;
  status: string;
  taxpayerType: string;
  constitutionOfBusiness: string;
  typeOfFilers: string;
  filingStatus: string | null;
  lastReturnFiled: string | null;
  dateOfFiling: string | null;
  noOfDefaultPeriod: number | null;
  updatedTime: string |null ;
}


export default function NonFilers() {
  const [fy, setFy] = useState<string>("");
  const [targetMonth, setTargetMonth] = useState<string>("");
  const [returnType, setReturnType] = useState<string>("");
  const [monthOptions, setMonthOptions] = useState<string[]>([]);
   const fyOptions = ["2024", "2025", "2026"];

  function exportToExcel() {
  if (taxpayers.length === 0) {
    alert("No data to export!");
    return;
  }

  // 1️⃣ Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(taxpayers);

  // 2️⃣ Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Taxpayers");

  // 3️⃣ Convert workbook to binary array
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // 4️⃣ Create a Blob and trigger download
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `Taxpayers_${new Date().toISOString().split("T")[0]}.xlsx`);
}

  useEffect(() => {
    if (fy) {
      const shortYear = fy.slice(-2);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ].map((m) => `${m}'${shortYear}`);

      setMonthOptions(months);
      setTargetMonth(""); // reset target month on FY change
    } else {
      setMonthOptions([]);
    }
  }, [fy]);

  const returnTypes = ["GSTR1", "GSTR3B", "GSTR7"];
 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Example hardcoded params (can be state-controlled inputs from your UI)
      
      const response = await fetch(
        `http://localhost:9090/api/python/run?fy=${fy}&returnType=${returnType}&targetMonth=${encodeURIComponent(targetMonth)}`,
        { method: "POST" }
      );

      const text = await response.text();
      setResult(text);
    } catch (error) {
      console.error(error);
      setResult("❌ Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

 
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);

  const dashboardStats = useMemo(() => {
  const total = taxpayers.length;
  const filed = taxpayers.filter(t => t.filingStatus === "Filed").length;
  const notFiled = taxpayers.filter(t => t.filingStatus === "Not Filed").length;

  // Group by division
  const byDivision: Record<string, number> = {};
  taxpayers.forEach(t => {
    const div = t.division || "Unknown";
    byDivision[div] = (byDivision[div] || 0) + 1;
  });

  return { total, filed, notFiled, byDivision };
}, [taxpayers]);



 

  // optional filters
  const [division, setDivision] = useState("");
  const [circle, setCircle] = useState("");
  const [filingStatus, setFilingStatus] = useState("");

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
 

   const filter = useMemo(
      () => ({
        division,
        circle,
        filingStatus,
      }),
      [division, circle , filingStatus]
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
         fetch("http://localhost:9090/admin/divisions")
    .then((res) => res.json())
    .then(setDivisions)
    .catch((err) => console.error("Error fetching divisions:", err));

    fetch("http://localhost:9090/admin/subdivisions")
    .then((res) => res.json())
    .then(setSubdivisions)
    .catch((err) => console.error("Error fetching subdivisions:", err));

      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, [filter]); 

  const fetchTaxpayers = async () => {
    setLoading(true);
    try {
      const response = await axios.post<Taxpayer[]>(
       "http://localhost:9090/api/python/taxpayer",
        {
          division: division || null,
          circle: circle || null,
          filingStatus: filingStatus || null,
        }
      );
      setTaxpayers(response.data);
    } catch (error) {
      console.error("Error fetching taxpayers", error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    
    <div className="p-6 space-y-6">
      {/* Dashboard Summary */}
{taxpayers.length > 0 && (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg">Total Taxpayers</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-blue-700">
        {dashboardStats.total}
      </CardContent>
    </Card>

    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 text-lg">Filed</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-green-700">
        {dashboardStats.filed}
      </CardContent>
    </Card>

    <Card className="bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800 text-lg">Not Filed</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-bold text-red-700">
        {dashboardStats.notFiled}
      </CardContent>
    </Card>
  </div>
)}
      {/* Frontend Input */}
       <Card>
      <CardHeader>
        <CardTitle>Inputs for Update</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* FY Dropdown */}
        <div>
          <label className="text-sm font-medium">FY</label>
          <Select onValueChange={setFy} value={fy}>
            <SelectTrigger>
              <SelectValue placeholder="Select FY" />
            </SelectTrigger>
            <SelectContent>
              {fyOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Month Dropdown */}
        <div>
          <label className="text-sm font-medium">Target Month</label>
          <Select onValueChange={setTargetMonth} value={targetMonth} disabled={!fy}>
            <SelectTrigger>
              <SelectValue placeholder={fy ? "Select Target Month" : "Select FY first"} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Return Type Dropdown */}
        <div>
          <label className="text-sm font-medium">Return Type</label>
          <Select onValueChange={setReturnType} value={returnType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Return Type" />
            </SelectTrigger>
            <SelectContent>
              {returnTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

      {/* Process */}
      <Card>
        <CardHeader>
          <CardTitle>Process</CardTitle>
        </CardHeader>
        <CardContent>
          
           <div className="flex gap-4">
      <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Update Report"}
        </Button>
      
      </div>
        </CardContent>
      </Card>

    
      {/* Output Section */}
      <Card>
        <div className="flex justify-between items-center p-4 border-b">
    <CardTitle className="text-lg font-semibold">Output</CardTitle>
    <Button
      onClick={exportToExcel}
      className="bg-green-600 text-white hover:bg-green-700"
    >
      Export to Excel
    </Button>
  </div>
        <CardContent>
          {/* Filters */}
          <div className="p-4">

    </div>
          <div className="flex items-center gap-4 mb-4">
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

            <Select onValueChange={(v) => setFilingStatus(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filed / Not Filed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Filed">Filed</SelectItem>
                <SelectItem value="Not Filed">Not Filed</SelectItem>
              </SelectContent>
            </Select>

            <button
          onClick={fetchTaxpayers}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Fetch Taxpayers"}
        </button>

    
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 mb-2">
            Timestamp: Data last ran on XXXX
          </p>

          <div className="p-4">
     

      {/* Table */}
      <div className="overflow-x-auto">
        {taxpayers.length > 0 ? (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">GSTIN</th>
                <th className="border px-2 py-1">Division</th>
                <th className="border px-2 py-1">Circle</th>
                <th className="border px-2 py-1">Trade Name</th>
                <th className="border px-2 py-1">Assigned To</th>
                <th className="border px-2 py-1">Mobile No</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Grant Date</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Taxpayer Type</th>
                <th className="border px-2 py-1">Constitution</th>
                <th className="border px-2 py-1">Type of Filers</th>
                <th className="border px-2 py-1">Filing Status</th>
                <th className="border px-2 py-1">Last Return Filed</th>
                <th className="border px-2 py-1">Date of Filing</th>
                <th className="border px-2 py-1">Default Periods</th>
                 <th className="border px-2 py-1">Updated Time</th>

              </tr>
            </thead>
            <tbody>
              {taxpayers.map((t) => (
                <tr key={t.gstin}>
                  <td className="border px-2 py-1">{t.gstin}</td>
                  <td className="border px-2 py-1">{t.division}</td>
                  <td className="border px-2 py-1">{t.circle}</td>
                  <td className="border px-2 py-1">{t.tradeLegalName}</td>
                  <td className="border px-2 py-1">{t.assignedTo ?? "-"}</td>
                  <td className="border px-2 py-1">{t.mobileNo ?? "-"}</td>
                  <td className="border px-2 py-1">{t.emailId ?? "-"}</td>
                  <td className="border px-2 py-1">{t.dateOfGrantOfRegistration ?? "-"}</td>
                  <td className="border px-2 py-1">{t.status ?? "-"}</td>
                  <td className="border px-2 py-1">{t.taxpayerType ?? "-"}</td>
                  <td className="border px-2 py-1">{t.constitutionOfBusiness ?? "-"}</td>
                  <td className="border px-2 py-1">{t.typeOfFilers ?? "-"}</td>
                  <td className="border px-2 py-1">{t.filingStatus ?? "-"}</td>
                  <td className="border px-2 py-1">{t.lastReturnFiled ?? "-"}</td>
                  <td className="border px-2 py-1">{t.dateOfFiling ?? "-"}</td>
                  <td className="border px-2 py-1">{t.noOfDefaultPeriod ?? "-"}</td>
                  <td className="border px-2 py-1">{t.updatedTime ?? "-"}</td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No taxpayers found.</p>
        )}
      </div>
    </div>
  

          {/* Table */}
    
        </CardContent>
      </Card>
    </div>
  );
}
