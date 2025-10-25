import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";


type Option = { label: string; value: string };

type NGTPRow = {
  division: string;
  circle: string;
  jurisdiction: "centre" | "state";
  taxpayer: string;
  linkedTaxpayer: string;

  itc: number; // Total ITC involved (Cr)
  pvReport: "Non-Existent" | "PV pending" | "Existent";
  status: string;

  ngtpCase: 1 | 0;
  gstnTracked: 1 | 0;
  nonExistent: 1 | 0;
};

/* ---------------- Filter Options ---------------- */
const DIVISIONS: Option[] = [
  { label: "All", value: "all" },
  { label: "Raipur Division-1", value: "raipur1" },
  { label: "Durg Division", value: "durg" },
  { label: "Bilaspur Division-1", value: "bilaspur1" },
  { label: "Raipur Division-2", value: "raipur2" },
  { label: "Bilaspur Division-2", value: "bilaspur2" },
  { label: "Nava Raipur Division", value: "navaraipur" },
  { label: "Jagdalpur Division", value: "jagdalpur" },
];

const CIRCLES: Option[] = [
  { label: "All", value: "all" },
  { label: "Raipur-1", value: "raipur-1" },
  { label: "Raipur-2", value: "raipur-2" },
];

const JURIS: Option[] = [
  { label: "All", value: "all" },
  { label: "Centre", value: "centre" },
  { label: "State", value: "state" },
];

const NAME_TP: Option[] = [
  { label: "All", value: "all" },
  { label: "Shree Metals", value: "Shree Metals" },
  { label: "City Traders", value: "City Traders" },
  { label: "Sahu Furnishings", value: "Sahu Furnishings" },
  { label: "Navdeepak Retail", value: "Navdeepak Retail" },
];

const NAME_LINKED: Option[] = [
  { label: "All", value: "all" },
  { label: "Om Suppliers", value: "Om Suppliers" },
  { label: "Shivam Exim", value: "Shivam Exim" },
  { label: "Skyline Traders", value: "Skyline Traders" },
  { label: "Metro Sales", value: "Metro Sales" },
];

/* ---------------- Mock Data (swap with API) ---------------- */
const MOCK_ROWS: NGTPRow[] = [
  { division: "raipur1", circle: "raipur-1", jurisdiction: "centre", taxpayer: "Shree Metals",       linkedTaxpayer: "Om Suppliers",    itc: 12.31, pvReport: "Non-Existent", status: "Letter sent",    ngtpCase: 1, gstnTracked: 1, nonExistent: 1 },
  { division: "raipur1", circle: "raipur-1", jurisdiction: "centre", taxpayer: "City Traders",       linkedTaxpayer: "Shivam Exim",     itc: 29.80, pvReport: "PV pending",   status: "Letter second",  ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
  { division: "durg",    circle: "raipur-2", jurisdiction: "centre", taxpayer: "Shree Metals",       linkedTaxpayer: "Om Suppliers",    itc: 25.50, pvReport: "Existent",     status: "Alert notice 1", ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
  { division: "bilaspur1",circle:"raipur-1", jurisdiction: "state",  taxpayer: "City Traders",       linkedTaxpayer: "Shivam Exim",     itc: 26.36, pvReport: "Existent",     status: "Alert notice 2", ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
  { division: "raipur2", circle: "raipur-2", jurisdiction: "state",  taxpayer: "Sahu Furnishings",   linkedTaxpayer: "Skyline Traders", itc: 13.02, pvReport: "PV pending",   status: "Alert notice 3", ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
  { division: "bilaspur2",circle:"raipur-2", jurisdiction: "centre", taxpayer: "Sahu Furnishings",   linkedTaxpayer: "Skyline Traders", itc: 10.85, pvReport: "Non-Existent", status: "Letter sent",    ngtpCase: 1, gstnTracked: 1, nonExistent: 1 },
  { division: "navaraipur",circle:"raipur-1",jurisdiction:"centre",  taxpayer: "Navdeepak Retail",   linkedTaxpayer: "Metro Sales",     itc: 8.12,  pvReport: "Existent",     status: "Letter second",  ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
  { division: "jagdalpur",circle:"raipur-2", jurisdiction: "state",  taxpayer: "Navdeepak Retail",   linkedTaxpayer: "Metro Sales",     itc: 1.18,  pvReport: "PV pending",   status: "Alert notice 1", ngtpCase: 1, gstnTracked: 1, nonExistent: 0 },
];

const COLORS = ["#60a5fa","#a78bfa","#34d399","#fbbf24","#f472b6","#22d3ee","#c084fc","#fb923c","#93c5fd","#67e8f9"];

/* ---------------- Reusable UI ---------------- */
const CardShell: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`rounded-2xl bg-gradient-to-b from-slate-900 to-slate-850 border border-slate-700/60 shadow-xl ${className || ""}`}>
    {title && <div className="px-4 pt-3 pb-2 text-[13px] font-semibold text-amber-200 tracking-wide">{title}</div>}
    <div className="p-4">{children}</div>
  </div>
);

const KPI: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="rounded-2xl bg-sky-400/90 text-slate-900 shadow-xl border border-sky-200 p-4 text-center">
    <div className="text-sm font-semibold tracking-wide">{label}</div>
    <div className="text-4xl md:text-3xl font-extrabold mt-1 drop-shadow">{value}</div>
  </div>
);

const SelectBox: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: Option[] }> = ({ label, value, onChange, options }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-semibold text-slate-100">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-100 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-inner"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select> 
  </label>
);

const Header: React.FC = () => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-slate-100">NGTP CG Overview</h1>
    <div className="text-[11px] text-right text-slate-300">
    
      <div>All figures are in Crores</div>
    </div>
  </div>
);

/* ---------------- Component ---------------- */
const NGTPOverview: React.FC = () => {
  // Filters
  const [division, setDivision] = useState("all");
  const [circle, setCircle] = useState("all");
  const [jurisdiction, setJurisdiction] = useState("all");
  const [tp, setTp] = useState("all");
  const [linkedTp, setLinkedTp] = useState("all");

  const matches = (r: NGTPRow) =>
    (division === "all" || r.division === division) &&
    (circle === "all" || r.circle === circle) &&
    (jurisdiction === "all" || r.jurisdiction === jurisdiction) &&
    (tp === "all" || r.taxpayer === tp) &&
    (linkedTp === "all" || r.linkedTaxpayer === linkedTp);

  const filtered = useMemo(() => MOCK_ROWS.filter(matches), [division, circle, jurisdiction, tp, linkedTp]);

  // KPIs
  const kpis = useMemo(() => {
    const ngtpCases = filtered.reduce((a, r) => a + r.ngtpCase, 0);
    const gstnTracked = filtered.reduce((a, r) => a + r.gstnTracked, 0);
    const nonExistent = filtered.reduce((a, r) => a + r.nonExistent, 0);
    const totalITC = +filtered.reduce((a, r) => a + r.itc, 0).toFixed(2);
    const itcBlockAfterAction = +(totalITC * 0.012).toFixed(2); // placeholder
    return { ngtpCases, gstnTracked, nonExistent, totalITC, itcBlockAfterAction };
  }, [filtered]);

  // Bar: Total ITC by Division
  const byDivision = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => map.set(r.division, (map.get(r.division) || 0) + r.itc));
    const label = (v: string) => DIVISIONS.find(d => d.value === v)?.label || v;
    return Array.from(map.entries()).map(([division, amount]) => ({ division: label(division), amount: +amount.toFixed(2) }));
  }, [filtered]);

  // Pies
  const byJurisdiction = useMemo(() => {
    const centre = filtered.filter(r => r.jurisdiction === "centre").reduce((a, r) => a + r.itc, 0);
    const state  = filtered.filter(r => r.jurisdiction === "state").reduce((a, r) => a + r.itc, 0);
    return [
      { name: "Centre", value: +centre.toFixed(2) },
      { name: "State",  value: +state.toFixed(2)  },
    ];
  }, [filtered]);

  const byPV = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => map.set(r.pvReport, (map.get(r.pvReport) || 0) + r.itc));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  }, [filtered]);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => map.set(r.status, (map.get(r.status) || 0) + r.itc));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  }, [filtered]);

  return (
     <div className="min-h-screen w-full bg-gradient-to-b from-blue-800 to-blue-900 text-gray-100 px-4 md:px-6 lg:px-10 py-5">
      <Header />

      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <SelectBox label="Division" value={division} onChange={setDivision} options={DIVISIONS} />
        <SelectBox label="Circle" value={circle} onChange={setCircle} options={CIRCLES} />
        <SelectBox label="Jurisdiction" value={jurisdiction} onChange={setJurisdiction} options={JURIS} />
        <SelectBox label="Name Of Taxpayer" value={tp} onChange={setTp} options={NAME_TP} />
        <SelectBox label="Linked Taxpayer" value={linkedTp} onChange={setLinkedTp} options={NAME_LINKED} />
      </div>

      {/* KPI ROW — small, horizontal, scrollable on mobile */}
      <div className="mt-4 overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <div className="flex gap-3 min-w-max lg:grid lg:grid-cols-5 lg:gap-3">
          <KPI label="NGTP Cases" value={kpis.ngtpCases} />
          <KPI label="GSTN Tracked" value={kpis.gstnTracked} />
          <KPI label="Non-Existent" value={kpis.nonExistent} />
          <KPI label="Total ITC (Cr)" value={kpis.totalITC.toLocaleString("en-IN", { maximumFractionDigits: 2 })} />
          <KPI label="ITC Block After Action (Cr)" value={kpis.itcBlockAfterAction.toLocaleString("en-IN", { maximumFractionDigits: 2 })} />
        </div>
      </div>

      {/* PIES ROW — three compact pies side-by-side */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <CardShell title="ITC by Jurisdiction">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byJurisdiction}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  cx="50%" cy="48%"
                >
                  {byJurisdiction.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "#0f172a" }} />
                <Tooltip formatter={(val: number, n: any) => [`${val} Cr`, n as string]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="ITC by PV Report">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPV}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  cx="50%" cy="48%"
                >
                  {byPV.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "#0f172a" }} />
                <Tooltip formatter={(val: number, n: any) => [`${val} Cr`, n as string]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="ITC by Status">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                  cx="50%" cy="48%"
                >
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: "#0f172a" }} />
                <Tooltip formatter={(val: number, n: any) => [`${val} Cr`, n as string]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>

      {/* BAR GRAPH */}
      <div className="mt-4">
        <CardShell title="Total ITC by Division">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDivision} margin={{ top: 10, right: 20, bottom: 40, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="division" tick={{ fill: "#0891B2", fontSize: 12 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fill: "#0891B2", fontSize: 12 }} />
                <Tooltip formatter={(val: number) => [`${val} Cr`, "ITC"]} />
                <Legend wrapperStyle={{ color: "#0891B2" }} />
                <Bar dataKey="amount" name="ITC" fill="#0891B2" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="amount" position="top" formatter={(v: number) => (v as number).toFixed(2)} className="text-[10px]" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>
    </div>
  );
};

export default NGTPOverview;
