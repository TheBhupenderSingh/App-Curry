import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { aggregateBySector, aggregateByDivision,getDivisionPieData , computeKPIs,getSectorPieData , getTopContributors, getSectorRanking, getDealerRanking, GstRevenue } from "./gstUtils";
import { BASE_URL } from "@/config";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E67E22", "#2ECC71", "#1275b7ff", "#E74C3C"];

const GstRevenueDashboard: React.FC = () => {
  const [data, setData] = useState<GstRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  //Taking User Details from queries in URL
    const [user, setUser] = useState<{ division: string | null; name: string | null ;role: string | null ; designation: string | null }>({
      division: null,
      name: null,
      role :null ,
      designation :null ,
    });



  

     useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userData = {
      division: query.get('division'),
      name: query.get('name'),
      role: query.get('role'),
      designation: query.get('designation'),
    };
    setUser(userData);

    const apiUrl = userData.role === 'ADMIN'
      ?  `${BASE_URL}/admin/gstrevenue`
      : `${BASE_URL}/admin/gstrevenue/${userData.division}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching GST data', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const kpis = computeKPIs(data);

 

  const sectorData = getSectorPieData(data);
  const divisionData = getDivisionPieData(data);
  const topContributors = getTopContributors(data);
  const sectorRanking = getSectorRanking(data);
  const dealerRanking = getDealerRanking(data);


  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
    <h1 className="text-2xl font-bold">📊 Sectoral Revenue  </h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:col-span-2">
        <Card><CardContent className="p-4"><h3 className="font-bold">Target</h3><p>{kpis.totalLast.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">Received</h3><p>{kpis.totalCurrent.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">Diff</h3><p>{kpis.diff.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">Achieved %</h3><p>{kpis.achieved.toFixed(2)}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">YoY Growth</h3><p>{kpis.yoyGrowth.toFixed(2)}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">SGST+IGST</h3><p>{kpis.sgstIgst.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><h3 className="font-bold">Total Tax Liability</h3><p>{kpis.taxLiability.toFixed(2)}</p></CardContent></Card>
      </div>

      {/* Pie Chart: SGST + IGST Paid by Sector */}
    <Card className="min-h-[500px]">
  <CardContent className="p-6 flex flex-col items-center">
    <h3 className="font-bold mb-4">SGST + IGST Paid by Sector</h3>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={getSectorPieData(data)}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={140}
          label
        >
          {getSectorPieData(data).map((entry, index) => (
            <Cell key={`sector-cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend  layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value) => value.length > 20 ? `${value.slice(0, 17)}...` : value} />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

      {/* Pie Chart: % Contribution by Division */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">% Contribution by Division</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={400} height={300}>
    <Pie
      data={getDivisionPieData(data)}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={120}
      fill="#82ca9d"
      label
    >
      {getDivisionPieData(data).map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend  layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value) => value.length > 20 ? `${value.slice(0, 17)}...` : value} />
      </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart: YoY Change */}
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">YoY Change (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.map(d => ({ name: d.tradeNameLegalName, pct: d.pctDiffLastYearMonth }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pct" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Top Contributors</h3>
          <ul>
            {topContributors.map((c, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{c.tradeNameLegalName}</span>
                <span>{c.totalRevenueCurrentYear.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Sector Ranking */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Sector Ranking</h3>
          <ul>
            {sectorRanking.map((s, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{s.sector}</span>
                <span>{s.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Dealer Ranking */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Dealer Ranking</h3>
          <ul>
            {dealerRanking.map((d, idx) => (
              <li key={idx} className="flex justify-between border-b py-1">
                <span>{d.tradeNameLegalName}</span>
                <span>{d.totalRevenueCurrentYear.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GstRevenueDashboard;
