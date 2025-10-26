import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
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
interface RiskDataRow {
  gstin?: string;
  risk_category?: string;
  risk_probability_score?: number | string;
  sector?: string;
  itc_claimed_more_than_accumulated?: number;
  itc_paid_more_than_accumulated?: number;
  [key: string]: any;
}

interface DashboardProps {
  rawData: any[]; // ✅ comes from FileUpload
}

// -----------------------------
// Component
// -----------------------------
const RiskComplianceDashboard: React.FC<DashboardProps> = ({ rawData }) => {
  const [data, setData] = useState<RiskDataRow[]>([]);
  const [riskCategoryDist, setRiskCategoryDist] = useState<any[]>([]);
  const [avgRiskBySector, setAvgRiskBySector] = useState<any[]>([]);
  const [topTaxpayers, setTopTaxpayers] = useState<RiskDataRow[]>([]);
  const [kpis, setKpis] = useState({
    totalGSTINs: 0,
    highRiskPercent: 0,
    avgRiskScore: 0,
  });

  // -----------------------------
  // Normalize + Process incoming data
  // -----------------------------
  useEffect(() => {
    if (!rawData || rawData.length === 0) {
      setData([]);
      return;
    }

    // ✅ Normalize keys (similar to old handleFileUpload)
    const normalizedData: RiskDataRow[] = rawData.map((row: any) => {
      const newRow: any = {};
      Object.keys(row).forEach((key) => {
        const newKey = key
          .toString()
          .trim()
          .replace(/\s+/g, "_") // spaces → underscores
          .replace(/[^\w]/g, "") // remove non-word chars
          .toLowerCase(); // lowercase
        newRow[newKey] = row[key];
      });
      return newRow;
    });

    setData(normalizedData);
    processData(normalizedData);
  }, [rawData]);

  // -----------------------------
  // Data Processing
  // -----------------------------
  const processData = (rows: RiskDataRow[]) => {
    if (!rows.length) return;

    // Pie Chart - Risk Category Distribution
    const categoryCounts: Record<string, number> = {};
    rows.forEach((row) => {
      const category = row.risk_category?.toString().trim() || "Unknown";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    setRiskCategoryDist(
      Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
      }))
    );

    // Bar Chart - Avg Risk Probability Score by Sector
    const sectorScores: Record<string, { total: number; count: number }> = {};
    rows.forEach((row) => {
      const sector = row.sector || "Unknown";
      let score = 0;

      if (typeof row.risk_probability_score === "string") {
        score = parseFloat(String(row.risk_probability_score).replace("%", "").trim());
      } else {
        score = Number(row.risk_probability_score || 0);
      }

      if (!isNaN(score)) {
        if (!sectorScores[sector]) sectorScores[sector] = { total: 0, count: 0 };
        sectorScores[sector].total += score;
        sectorScores[sector].count += 1;
      }
    });
    setAvgRiskBySector(
      Object.entries(sectorScores).map(([sector, { total, count }]) => ({
        sector,
        avgScore: total / count,
      }))
    );

    // Top 10 Taxpayers by ITC mismatch
    const sorted = [...rows].sort(
      (a, b) =>
        (b.itc_claimed_more_than_accumulated || 0) -
        (a.itc_claimed_more_than_accumulated || 0)
    );
    setTopTaxpayers(sorted.slice(0, 10));

    // ✅ KPIs
    const total = rows.length;
    const highRisk = rows.filter(
      (r) => r.risk_category?.toString().trim().toLowerCase() === "high risk"
    ).length;

    const avgScore =
      rows.reduce((sum, r) => {
        let score = 0;
        if (typeof r.risk_probability_score === "string") {
          score = parseFloat(String(r.risk_probability_score).replace("%", "").trim());
        } else {
          score = Number(r.risk_probability_score || 0);
        }
        return sum + (isNaN(score) ? 0 : score);
      }, 0) / total;

    setKpis({
      totalGSTINs: total,
      highRiskPercent: (highRisk / total) * 100,
      avgRiskScore: avgScore,
    });
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Risk & Compliance Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-lg shadow">
          <h2 className="text-lg">Total GSTINs</h2>
          <p className="text-2xl font-bold">{kpis.totalGSTINs}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow">
          <h2 className="text-lg">% High Risk</h2>
          <p className="text-2xl font-bold">{kpis.highRiskPercent.toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <h2 className="text-lg">Avg Risk Score</h2>
          <p className="text-2xl font-bold">{kpis.avgRiskScore.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg mb-2">Taxpayers by Risk Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskCategoryDist}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {riskCategoryDist.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#ff6b6b", "#feca57", "#1dd1a1"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-lg mb-2">Avg Risk Score by Sector</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgRiskBySector}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-lg mb-2">Top 10 Taxpayers by ITC Claimed</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">GSTIN</th>
              <th className="border p-2">Sector</th>
              <th className="border p-2">Risk Category</th>
              <th className="border p-2">Risk Score</th>
              <th className="border p-2">ITC Claimed</th>
            </tr>
          </thead>
          <tbody>
            {topTaxpayers.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-2">{row.gstin}</td>
                <td className="border p-2">{row.sector}</td>
                <td className="border p-2">{row.risk_category}</td>
                <td className="border p-2">{row.risk_probability_score}</td>
                <td className="border p-2">
                  {row.itc_claimed_more_than_accumulated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskComplianceDashboard;
