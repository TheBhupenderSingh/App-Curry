import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LabelList,
  ComposedChart,
  Area,
} from "recharts";

// If you're using shadcn/ui, uncomment the imports below and replace native selects with <Select/> etc.
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Enforcement Overview Dashboard (React + TypeScript)
 * --------------------------------------------------
 * Drop-in .tsx component that recreates the look/feel of your Power BI dashboard.
 * - Tailwind-first layout (soft shadows, rounded cards, clean grid)
 * - Recharts for the 3 charts (line, bars, and bar+line)
 * - Native <select> elements used to avoid framework coupling. Swap with shadcn/ui if you prefer.
 * - All numbers assume "Crores". Update formatters as needed.
 * - Replace MOCK_* with your live data from API/DB. Wire up filter logic where indicated.
 */

// ---------- Types ----------
type Option = { label: string; value: string };

type OfficerRow = {
  officer: string;
  totalEnforcement: number;
  division?: string;
  circle?: string;
};

type DepositPoint = { month: string; value: number };

// Status-wise totals (bar chart)
type StatusRow = { status: string; amount: number };

// Division-wise bars + line (composed chart)
type DivisionRow = { division: string; amount: number; enforcements: number };

// ---------- Helpers ----------
const formatCrore = (n: number) =>
  n.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

// ---------- MOCK DATA (replace with real) ----------
const DIVISIONS: Option[] = [
  { label: "All", value: "all" },
  { label: "Raipur 1", value: "raipur1" },
  { label: "Raipur 2", value: "raipur2" },
  { label: "Durg", value: "durg" },
  { label: "Bilaspur 1", value: "bilaspur1" },
  { label: "Bilaspur 2", value: "bilaspur2" },
  { label: "Nava Raipur Div.", value: "navaraipur" },
  { label: "Ambikapur", value: "ambikapur" },
];

const CIRCLES: Option[] = [
  { label: "All", value: "all" },
  { label: "Raipur-1", value: "raipur-1" },
  { label: "Raipur-2", value: "raipur-2" },
];

const TRADE_OF_NAME: Option[] = [
  { label: "All", value: "all" },
  { label: "Electronics", value: "electronics" },
  { label: "Furniture", value: "furniture" },
];

const FORM_TYPES: Option[] = [
  { label: "All", value: "all" },
  { label: "Challan", value: "challan" },
  { label: "DRC-03", value: "drc-03" },
  { label: "DRC 03", value: "drc 03" },
];

const DATE_OF_ORDER: Option[] = [
  { label: "All", value: "all" },
  { label: "Mar 2024", value: "2024-03" },
  { label: "Apr 2024", value: "2024-04" },
  { label: "May 2024", value: "2024-05" },
  { label: "Jun 2024", value: "2024-06" },
];

const MOCK_OFFICERS: OfficerRow[] = [
  { officer: "Shri Nitin Garg", totalEnforcement: 10, division: "raipur1" },
  { officer: "Shri Durgesh Pandey", totalEnforcement: 4, division: "raipur1" },
  { officer: "Shri Sandeep Yadu", totalEnforcement: 4, division: "durg" },
  { officer: "Dr. Shushma Bada", totalEnforcement: 3, division: "bilaspur1" },
  {
    officer: "Shri Navdeepak Sahu",
    totalEnforcement: 3,
    division: "bilaspur2",
  },
  { officer: "Dr. Kamal Naik", totalEnforcement: 2, division: "raipur2" },
  {
    officer: "Mrs. Pratistha Thakur",
    totalEnforcement: 2,
    division: "raipur2",
  },
  { officer: "Shri Alok Jaiswal", totalEnforcement: 2, division: "navaraipur" },
  {
    officer: "Shri Nitin Garg, Dc, Raipur Div.-1",
    totalEnforcement: 2,
    division: "raipur1",
  },
];

const MOCK_DEPOSIT_TREND: DepositPoint[] = [
  { month: "Jan 2024", value: 1.02 },
  { month: "Feb 2024", value: 0.8 },
  { month: "Mar 2024", value: 15.85 },
  { month: "Apr 2024", value: 11.42 },
  { month: "May 2024", value: 1.54 },
  { month: "Jun 2024", value: 1.4 },
];

const MOCK_STATUS: StatusRow[] = [
  { status: "(Blank)", amount: 21.77 },
  { status: "Summons Issued", amount: 16.36 },
  { status: "Pending", amount: 10.38 },
  { status: "Summons Issued D…", amount: 7.49 },
  { status: "Summons Issued Do…", amount: 7.44 },
  { status: "Closed", amount: 4.75 },
  { status: "30 Lakh Deposited Do…", amount: 2.5 },
  { status: "Amount Deposited…", amount: 1.21 },
  { status: "Set Off", amount: 0.2 },
  { status: "Summons Issued Do…2", amount: 0.18 },
  { status: "0.00", amount: 0.0 },
];

const MOCK_DIVISIONS: DivisionRow[] = [
  { division: "Raipur 1", amount: 32.18, enforcements: 34 },
  { division: "Raipur 2", amount: 21.28, enforcements: 22 },
  { division: "Durg", amount: 10.03, enforcements: 12 },
  { division: "Bilaspur1", amount: 9.51, enforcements: 9 },
  { division: "Bilaspur2", amount: 5.96, enforcements: 7 },
  { division: "Nava Raipur Div.", amount: 1.54, enforcements: 4 },
  { division: "(Blank)", amount: 0.2, enforcements: 2 },
  { division: "Ambikapur", amount: 0.08, enforcements: 1 },
];

// ---------- Component ----------.
const SelectBox: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}> = ({ label, value, onChange, options }) => {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold text-slate-100">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-inner"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
};

const CardShell: React.FC<{
  className?: string;
  title?: string;
  children: React.ReactNode;
}> = ({ className, title, children }) => {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-slate-900 to-slate-850 border border-slate-700/60 shadow-xl ${
        className || ""
      }`}
    >
      {title && (
        <div className="px-4 pt-3 pb-2 text-[15px] font-semibold text-amber-200 tracking-wide">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

const Header: React.FC = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-amber-200 drop-shadow-[0_2px_0_rgba(0,0,0,0.4)]">
      Enforcement Overview
    </h1>
    <div className="text-xs text-right text-slate-300">
      <div>
        <span className="font-semibold"></span> 
      </div>
      <div>All figures are in Crores</div>
    </div>
  </div>
);

const EnforcementOverview: React.FC = () => {
  // ----- Filters -----
  const [division, setDivision] = useState("all");
  const [circle, setCircle] = useState("all");
  const [trade, setTrade] = useState("all");
  const [formType, setFormType] = useState("all");
  const [orderDate, setOrderDate] = useState("all");

  // ----- Derived (replace with real filter logic over your data) -----
  const totalCases = useMemo(
    () => MOCK_OFFICERS.reduce((acc, r) => acc + r.totalEnforcement, 0),
    []
  );

  const totalDeposited = useMemo(
    () => MOCK_DEPOSIT_TREND.reduce((acc, p) => acc + p.value, 0),
    []
  );

  const filteredOfficers = useMemo(() => {
    // Example filter: by division only for demo
    if (division === "all") return MOCK_OFFICERS;
    return MOCK_OFFICERS.filter((o) => o.division === division);
  }, [division]);

  return (
   <div className="min-h-screen w-full bg-blue-800 text-gray-100 px-4 md:px-6 lg:px-10 py-5">
      <Header />

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SelectBox
          label="Division"
          value={division}
          onChange={setDivision}
          options={DIVISIONS}
        />
        <SelectBox
          label="Circle"
          value={circle}
          onChange={setCircle}
          options={CIRCLES}
        />
        <SelectBox
          label="Trade of Name"
          value={trade}
          onChange={setTrade}
          options={TRADE_OF_NAME}
        />
        <SelectBox
          label="Form Type"
          value={formType}
          onChange={setFormType}
          options={FORM_TYPES}
        />
        <SelectBox
          label="Date of Order"
          value={orderDate}
          onChange={setOrderDate}
          options={DATE_OF_ORDER}
        />
      </div>

      {/* KPIs + Officer Table + Line */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CardShell>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-700 shadow-inner p-5 text-center">
              <div className="text-sm font-semibold tracking-wide text-amber-200">
                Total Enforcement Cases
              </div>
              <div className="text-5xl font-extrabold mt-3 text-emerald-300 drop-shadow">
                {formatCrore(totalCases)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-700 shadow-inner p-5 text-center">
              <div className="text-sm font-semibold tracking-wide text-amber-200">
                Amount Deposited
              </div>
              <div className="text-5xl font-extrabold mt-3 text-emerald-300 drop-shadow">
                {formatCrore(totalDeposited)}
              </div>
            </div>
          </div>

          {/* Officer table */}
          <div className="mt-5">
            <div className="rounded-xl overflow-hidden border border-slate-700/70">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/70 text-amber-200">
                  <tr>
                    <th className="text-left px-3 py-2">Officer Name</th>
                    <th className="text-right px-3 py-2">Total Enforcement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOfficers.map((r, idx) => (
                    <tr
                      key={idx}
                      className={`even:bg-slate-900/40 odd:bg-slate-900/20 border-t border-slate-800/60`}
                    >
                      <td className="px-3 py-2">{r.officer}</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {r.totalEnforcement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardShell>

        <CardShell
          title="Total Amount Deposited Over Time"
          className="lg:col-span-2"
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={MOCK_DEPOSIT_TREND}
                margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <Tooltip
                  formatter={(val: number) => [`${val} Cr`, "Amount"]}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>

      {/* Bottom Row: Status Bars + Division Composed */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardShell title="Total Amount Deposited by Status">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_STATUS}
                margin={{ top: 10, right: 20, bottom: 40, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <Tooltip
                  formatter={(val: number) => [`${val} Cr`, "Amount"]}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar dataKey="amount" fill="#a78bfa" radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(v: number) => v.toFixed(2)}
                    className="text-[10px]"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="Total Amount Deposited & Total Enforcement by Division">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={MOCK_DIVISIONS}
                margin={{ top: 10, right: 20, bottom: 40, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="division"
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#cbd5e1", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(val: number, n) => [
                    n === "amount" ? `${val} Cr` : val,
                    n === "amount" ? "Amount Deposited" : "No. of Enforcement",
                  ]}
                />
                <Legend wrapperStyle={{ color: "#e2e8f0" }} />
                <Bar
                  yAxisId="left"
                  dataKey="amount"
                  name="Amount Deposited"
                  fill="#60a5fa"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(v: number) => v.toFixed(2)}
                    className="text-[10px]"
                  />
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="enforcements"
                  name="No of Enforcement"
                  stroke="#f472b6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>
    </div>
  );
};

export default EnforcementOverview;
