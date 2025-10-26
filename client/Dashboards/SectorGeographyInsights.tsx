import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// -----------------------------
// Types
// -----------------------------
interface ExcelRow {
  [key: string]: any;
}

interface Props {
  rawData: ExcelRow[]; // ✅ Comes from parent (ExcelUploader)
}

// -----------------------------
// Helpers
// -----------------------------
function normalizeKeys(row: ExcelRow): Record<string, any> {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    const normKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    normalized[normKey] = row[key];
  }
  return normalized;
}

function toNumber(v: any): number {
  if (v === undefined || v === null || v === "") return 0;
  const cleaned = String(v).replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

const TURNOVER_KEYS = [
  "gross_turnover",
  "gross_to",
  "turnover",
];

function resolveValue(row: Record<string, any>, keys: string[]): number {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && row[k] !== "") {
      return toNumber(row[k]);
    }
  }
  return 0;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

// -----------------------------
// Component
// -----------------------------
const SectorGeographyInsights: React.FC<Props> = ({ rawData }) => {
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);

  useEffect(() => {
    if (!rawData || rawData.length === 0) return;

    const sectorMap: Record<string, { count: number; turnover: number[]; tax: number[] }> = {};
    const geoMap: Record<string, number> = {};

    rawData.forEach((rawRow) => {
      const row = normalizeKeys(rawRow);

      const sector = row["sector"] ?? "Unknown";
      const turnover = resolveValue(row, TURNOVER_KEYS);
      const tax = toNumber(row["total_tax_liability"]);

      if (!sectorMap[sector]) {
        sectorMap[sector] = { count: 0, turnover: [], tax: [] };
      }
      sectorMap[sector].count += 1;
      sectorMap[sector].turnover.push(turnover);
      sectorMap[sector].tax.push(tax);

      let geoKey = row["division"] || row["circle"] || row["jurisdiction"] || "Unknown";
      geoMap[geoKey] = (geoMap[geoKey] || 0) + 1;
    });

    const pieFormatted = Object.entries(sectorMap).map(([sector, data]) => ({
      name: sector,
      value: data.count,
    }));

    const barFormatted = Object.entries(sectorMap).map(([sector, data]) => ({
      name: sector,
      avgTurnover:
        data.turnover.length > 0
          ? data.turnover.reduce((a, b) => a + b, 0) / data.turnover.length
          : 0,
      totalTax:
        data.tax.length > 0
          ? data.tax.reduce((a, b) => a + b, 0) / data.tax.length
          : 0,
    }));

    const geoFormatted = Object.entries(geoMap).map(([location, count]) => ({
      name: location,
      count,
    }));

    setPieData(pieFormatted);
    setBarData(barFormatted);
    setGeoData(geoFormatted);
  }, [rawData]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Sector & Geography Insights</h2>

      {/* Pie Chart */}
      <h3 className="text-lg font-semibold mt-6 mb-2">GSTIN Distribution by Sector</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bar Chart */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        Avg Gross Turnover & Total Tax Liability by Sector
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgTurnover" fill="#82ca9d" name="Avg Turnover" />
          <Bar dataKey="totalTax" fill="#8884d8" name="Total Tax Liability" />
        </BarChart>
      </ResponsiveContainer>

      {/* Table */}
      <h3 className="text-lg font-semibold mt-6 mb-2">
        GSTIN Count by Division / Circle / Jurisdiction
      </h3>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">Location</th>
              <th className="border border-gray-300 px-2 py-1">GSTIN Count</th>
            </tr>
          </thead>
          <tbody>
            {geoData.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-2 py-1">{row.name}</td>
                <td className="border border-gray-300 px-2 py-1">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorGeographyInsights;
