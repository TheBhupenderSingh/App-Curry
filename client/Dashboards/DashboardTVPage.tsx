import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from "recharts"; // Recharts components
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you're using these components

const DashboardTVPage = () => {
  // State for fit-to-screen functionality
  const [isFullScreen, setIsFullScreen] = useState(false);

  const dummyData = {
    totalRevenue: "9,881",
    totalRevenueGrowth: 2.1,
    mtdRevenue: "881",
    mtdGrowth: -0.1,

    revenueTrend: [
      { month: "Apr", y2025: 5, y2024: 3 },
      { month: "May", y2025: 3, y2024: 4 },
      { month: "Jun", y2025: 4, y2024: 4.2 },
      { month: "Jul", y2025: 6, y2024: 5 },
      { month: "Aug", y2025: 3.2, y2024: 3.1 },
      { month: "Sep", y2025: 4.8, y2024: 4 },
      { month: "Oct", y2025: 6.5, y2024: 5.1 },
      { month: "Nov", y2025: 5.3, y2024: 4.6 },
      { month: "Dec", y2025: 7.9, y2024: 5.9 },
      { month: "Jan", y2025: 9.1, y2024: 8.4 },
      { month: "Feb", y2025: 8.2, y2024: 7.2 },
      { month: "Mar", y2025: 2.1, y2024: 1.4 },
    ],

    topCircles: [
      { name: "Raigarh 1", pct: 4.4 },
      { name: "Raigarh 2", pct: 2.1 },
      { name: "Raipur 1", pct: 1.9 },
      { name: "Raipur 2", pct: 1.5 },
      { name: "Durg 1", pct: 1.1 },
    ],

    bottomCircles: [
      { name: "Korba 1", pct: 2.2 },
      { name: "Balod", pct: 1.6 },
      { name: "Ambikapur", pct: 1.4 },
      { name: "Raipur 3", pct: 0.9 },
      { name: "Bilaspur 1", pct: 0.7 },
    ],

    nonFilers: {
      gstr1: [
        "GPM – 2412",
        "Dhamtari – 2311",
        "Gariyaband – 2189",
        "Janjgir – 2017",
        "Kanker – 1993",
        "Kawardha – 1891",
        "Jashpur – 1882",
        "Kondagaon – 1784",
        "Mahasamund – 654",
        "Korba 2 – 457",
      ],
      gstr3: [
        "GPM – 2412",
        "Dhamtari – 2311",
        "Gariyaband – 2189",
        "Janjgir – 2017",
        "Kanker – 1993",
        "Kawardha – 1891",
        "Jashpur – 1882",
        "Kondagaon – 1784",
        "Mahasamund – 654",
        "Korba 2 – 457",
      ],
      gstr7: [
        "GPM – 2412",
        "Dhamtari – 2311",
        "Gariyaband – 2189",
        "Janjgir – 2017",
        "Kanker – 1993",
        "Kawardha – 1891",
        "Jashpur – 1882",
        "Kondagaon – 1784",
        "Mahasamund – 654",
        "Korba 2 – 457",
      ],
    },

    sectors: [
  { name: "Steel & Iron", nov25: 4.2, oct25: 3.8, nov24: 3.4 },
  { name: "Mining", nov25: 2.3, oct25: 2.1, nov24: 2.7 },
  { name: "Construction", nov25: 4.8, oct25: 4.1, nov24: 3.7 },
  { name: "Cement", nov25: 3.1, oct25: 2.9, nov24: 3.5 },
  { name: "Handicrafts", nov25: 1.9, oct25: 2.2, nov24: 1.7 },
  { name: "FMCG", nov25: 2.4, oct25: 2.0, nov24: 2.9 },
  { name: "Automobiles", nov25: 3.8, oct25: 3.4, nov24: 3.1 },
  { name: "Logistics", nov25: 2.6, oct25: 1.9, nov24: 2.3 },
  { name: "Dairy", nov25: 1.8, oct25: 1.7, nov24: 2.1 },
  { name: "Trade", nov25: 4.5, oct25: 4.1, nov24: 3.9 },
],
  };

  // Handle fit-to-screen functionality
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    document.body.style.overflow = isFullScreen ? "auto" : "hidden"; // Prevent scrolling when fullscreen
  };

  return (
    <div
  className={`w-full min-h-screen bg-[#0f2c45] text-white p-2 overflow-y-auto select-none font-[Inter] grid grid-rows-[80px_auto] gap-4`}
>

      {/* HEADER */}
      <div className="text-center text-3xl font-bold bg-[#b43f2c] py-3 rounded-xl shadow-lg">
        Total 5000 GSTR 3B filed | <span className="text-yellow-300">Raigarh 1</span> with the highest revenue this month | Steel & Iron highest revenue sector
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-4 gap-4">
        {/* LEFT SIDE STATS */}
        <div className="space-y-4">
          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[42%]">
            <CardHeader>
              <CardTitle>Total Revenue (1 Apr - 4 Nov)</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">₹ {dummyData.totalRevenue} Cr</CardContent>
            <div className="flex items-center gap-2 p-4">
              {dummyData.totalRevenueGrowth >= 0 ? <ArrowUp /> : <ArrowDown />}
              <span className="text-lg">{dummyData.totalRevenueGrowth}% compared to last year</span>
            </div>
          </Card>

          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[42%]">
            <CardHeader>
              <CardTitle>Revenue MTD (Nov'25)</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">₹ {dummyData.mtdRevenue} Cr</CardContent>
            <div className="flex items-center gap-2 p-4">
              {dummyData.mtdGrowth >= 0 ? <ArrowUp /> : <ArrowDown />}
              <span className="text-lg">{dummyData.mtdGrowth}% compared to last year</span>
            </div>
          </Card>
        </div>

        {/* CENTER: Revenue Trend */}
        <Card className="col-span-2 bg-[#12314f] border-none text-white shadow-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-3xl">M-o-M Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center text-gray-300">
            {/* Revenue Trend Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="y2025" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="y2024" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[42%]">
            <CardHeader>
              <CardTitle>Top 5 Circles Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {dummyData.topCircles.map((c, idx) => (
                <div key={idx} className="flex justify-between py-1 text-lg">
                  <span>{c.name}</span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-4" /> {c.pct}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[42%]">
            <CardHeader>
              <CardTitle>Bottom 5 Circles</CardTitle>
            </CardHeader>
            <CardContent>
              {dummyData.bottomCircles.map((c, idx) => (
                <div key={idx} className="flex justify-between py-1 text-lg">
                  <span>{c.name}</span>
                  <span className="flex items-center gap-1 text-red-400">
                    <ArrowDown className="w-4" /> {c.pct}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-3 gap-4 h-[35vh] mt-2">
        <Card className="bg-[#12314f] text-white border-none shadow-xl p-4 overflow-y-hidden">
          <CardHeader>
            <CardTitle className="text-center">Top Non-Filer Circles</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 text-sm gap-4">
            <div>
              <h2 className="font-bold text-lg mb-2">GSTR 1</h2>
              {dummyData.nonFilers.gstr1.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">GSTR 3</h2>
              {dummyData.nonFilers.gstr3.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">GSTR 7</h2>
              {dummyData.nonFilers.gstr7.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-[#12314f] text-white border-none shadow-xl flex flex-col">
  <CardHeader>
    <CardTitle className="text-center text-2xl">Top 10 Sectors this month</CardTitle>
  </CardHeader>

  <CardContent className="flex-1 flex items-center justify-center">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dummyData.sectors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Legend />

        {/* LAST YEAR LINE */}
        <Line type="monotone" dataKey="nov24" stroke="#ffc658" strokeWidth={2} />

        {/* OCT LINE */}
        <Line type="monotone" dataKey="oct25" stroke="#82ca9d" strokeWidth={2} />

        {/* CURRENT MONTH BAR */}
        <Bar dataKey="nov25" fill="#8884d8" barSize={25} />
      </LineChart>
      </ResponsiveContainer>
      </CardContent>
      </Card>

      </div>
    </div>
  );
};

export default DashboardTVPage;
