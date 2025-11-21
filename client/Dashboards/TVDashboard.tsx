import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

/**
 * Props for TVDashboard
 * - All data passed from parent to keep component reusable
 */
interface TVDashboardProps {
  totalRevenue: string;
  totalRevenueGrowth: number;
  mtdRevenue: string;
  mtdGrowth: number;
  revenueTrend: { month: string; y2025: number; y2024: number }[];
  topCircles: { name: string; pct: number }[];
  bottomCircles: { name: string; pct: number }[];
  nonFilers: {
    gstr1: string[];
    gstr3: string[];
    gstr7: string[];
  };
  sectors: {
    name: string;
    nov25: number;
    oct25: number;
    nov24: number;
  }[];
}

export default function TVDashboard({
  totalRevenue,
  totalRevenueGrowth,
  mtdRevenue,
  mtdGrowth,
  revenueTrend,
  topCircles,
  bottomCircles,
  nonFilers,
  sectors,
}: TVDashboardProps) {
  return (
    <div className="w-full h-screen bg-[#0f2c45] text-white p-4 overflow-hidden select-none font-[Inter] grid grid-rows-[80px_1fr] gap-4">
      {/* HEADER */}
      <div className="text-center text-3xl font-bold bg-[#b43f2c] py-3 rounded-xl shadow-lg">
        Total 5000 GSTR 3B filed | <span className="text-yellow-300">Raigarh 1</span> with the highest revenue this month | Steel & Iron highest revenue sector
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-4 gap-4">
        {/* LEFT SIDE STATS */}
        <div className="space-y-4">
          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[48%]">
            <CardHeader>
              <CardTitle>Total Revenue (1 Apr - 4 Nov)</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">₹ {totalRevenue} Cr</CardContent>
            <div className="flex items-center gap-2 p-4">
              {totalRevenueGrowth >= 0 ? <ArrowUp /> : <ArrowDown />}
              <span className="text-lg">{totalRevenueGrowth}% compared to last year</span>
            </div>
          </Card>

          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[48%]">
            <CardHeader>
              <CardTitle>Revenue MTD (Nov'25)</CardTitle>
            </CardHeader>
            <CardContent className="text-4xl font-bold">₹ {mtdRevenue} Cr</CardContent>
            <div className="flex items-center gap-2 p-4">
              {mtdGrowth >= 0 ? <ArrowUp /> : <ArrowDown />}
              <span className="text-lg">{mtdGrowth}% compared to last year</span>
            </div>
          </Card>
        </div>

        {/* CENTER: Revenue Trend */}
        <Card className="col-span-2 bg-[#12314f] border-none text-white shadow-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-3xl">M-o-M Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center text-gray-300">
            {/* Placeholder – replace with chart */}
            <div className="text-xl opacity-70">[Revenue Trend Chart]</div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[48%]">
            <CardHeader>
              <CardTitle>Top 5 Circles Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {topCircles.map((c, idx) => (
                <div key={idx} className="flex justify-between py-1 text-lg">
                  <span>{c.name}</span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-4" /> {c.pct}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#12314f] text-white border-none shadow-xl h-[48%]">
            <CardHeader>
              <CardTitle>Bottom 5 Circles</CardTitle>
            </CardHeader>
            <CardContent>
              {bottomCircles.map((c, idx) => (
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
              {nonFilers.gstr1.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">GSTR 3</h2>
              {nonFilers.gstr3.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-2">GSTR 7</h2>
              {nonFilers.gstr7.map((x, i) => (
                <div key={i}>{i + 1}. {x}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-[#12314f] text-white border-none shadow-xl flex flex-col">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Top 10 Sectors this month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-gray-300">
            {/* Placeholder – replace with bar-line combo chart */}
            <div className="text-xl opacity-70">[Sector Chart]</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
