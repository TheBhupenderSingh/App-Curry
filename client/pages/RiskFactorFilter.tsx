// src/components/RiskFactorFilter.tsx
import React, { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskFactor {
  gstin: string;
  tradeNameLegalName: string;
  date:string ;
  division: string;
  circle: string;
  riskCategory: string;
  riskProbabilityScore: number;
  grossTo: number;
  emailId: string;
  mobileNum: string;
  assignedTo: string;
  effectiveDtReg: string;
  status: string;
  suspensionDate: string;
  taxpayerType: string;
  constitutionOfBusiness: string;
  isMigrated: string;
  lowestJurisdiction: string;
  hsnCode: string;
  addressOfPrincipalPlaceOfBusiness: string;
  noOfAdditionalPlaceOfBusiness: number;
  lowestJuris: string;
  cancelEffectDt: string;
  typeCancellation: string;
  reasonCancel: string;
  sector: string;

}

interface FilterRange {
  min: number | null;
  max: number | null;
}

const paramDetails: Record<string, { label: string; description: string }> = {
  gcfpaFlag: {
    label: "GCFPA Combination Flag",
    description:
      "Combinations where target GSTIN performed multiple transactions of same amount with same receiver GSTIN in a single filing period.",
  },
  gvfpaFlag: {
    label: "GVFPA Combination Flag",
    description:
      "Combinations where target GSTIN performed multiple transactions of same amount with same supplier GSTIN in a single filing period.",
  },
  itcPaidMoreThanAccumulated: {
    label: "ITC Paid More Than Accumulated",
    description:
      "Total ITC accumulated from GSTR2A is less than ITC paid in 3B for a fiscal year.",
  },
  itcClaimedMoreThanAccumulated: {
    label: "ITC Claimed More Than Accumulated",
    description:
      "Total ITC accumulated from GSTR2A is less than ITC claimed in 3B for a fiscal year.",
  },
  r1Gtr3b: {
    label: "R1 and 3B Outward Mismatch",
    description:
      "Mismatch in outward supplies between R1 and 3B for a fiscal year.",
  },
  highFluctuationsQoq: {
    label: "High Fluctuations QoQ",
    description:
      "Taxable turnover fluctuates >100% or <-100% quarter over quarter.",
  },
  sameTtoForThreeConsecutiveQuarters: {
    label: "Same TTO for Three Consecutive Quarters",
    description:
      "No change in TTO for 3 consecutive quarters — possible revenue suppression.",
  },
  moreThan80pctItcPassedOn: {
    label: "More Than 80% ITC Passed On",
    description:
      "More than 80% ITC passed on to a single supplier across multiple transactions.",
  },
  involvedInItcAccumulationChain: {
    label: "Involved in ITC Accumulation Chain",
    description:
      "GSTIN involved in chain passing >80% ITC to connected GSTINs.",
  },
  purchasesFromSuspendedGstins: {
    label: "Purchases from Suspended GSTINs",
    description: "GSTIN has made purchases from suspended suppliers.",
  },
  purchaseWhileSuspended: {
    label: "Purchase While Suspended",
    description: "Purchases made during suspension period.",
  },
  saleWhileSuspended: {
    label: "Sales During Suspension",
    description: "Sales made while suspended.",
  },
  saleToSuspendedGstins: {
    label: "Sale Made to Suspended GSTINs",
    description: "Sales made to suspended receivers.",
  },
  itc90Consecutive: {
    label: "90% ITC Consecutively for >2 Quarters",
    description:
      "ITC contributes ≥90% of total tax liability for 2+ consecutive quarters.",
  },
};



const RiskFactorFilter: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, FilterRange>>(
    Object.fromEntries(
      Object.keys(paramDetails).map((p) => [p, { min: null, max: null }])
    )
  );
const navigate = useNavigate();
  const [data, setData] = useState<RiskFactor[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (param: string, field: "min" | "max", value: string) => {
    let num = value === "" ? null : parseFloat(value);
    if (num !== null) {
      if (num < 0) num = 0;
      if (num > 10) num = 10;
    }
    setFilters((prev) => ({
      ...prev,
      [param]: { ...prev[param], [field]: num },
    }));
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const payload: any = {};
      Object.entries(filters).forEach(([param, range]) => {
        if (range.min !== null) payload[`${param}Min`] = range.min;
        if (range.max !== null) payload[`${param}Max`] = range.max;
      });

      const res = await axios.post("http://localhost:9090/fraud/filter", payload);
      setData(res.data);
      setDisplayData(res.data); // <- initialize displayData
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    } finally {
      setLoading(false);
    }
  };

  const [tableFilters, setTableFilters] = useState({
  division: "",
  circle: "",
  riskCategory: "",
  minScore: "",
  maxScore: "",
   fy: "",
});

const uniqueValues = (key: keyof RiskFactor) =>
  Array.from(new Set(data.map((item) => item[key]).filter(Boolean)));

 const [displayData, setDisplayData] = useState<RiskFactor[]>([]);

const handleTableFilter = () => {
  const filtered = data.filter((item) => {
    const divisionMatch = tableFilters.division
      ? item.division?.toLowerCase().trim() === tableFilters.division.toLowerCase().trim()
      : true;

    const circleMatch = tableFilters.circle
      ? item.circle?.toLowerCase().trim() === tableFilters.circle.toLowerCase().trim()
      : true;

    const categoryMatch = tableFilters.riskCategory
      ? item.riskCategory?.toLowerCase().trim() === tableFilters.riskCategory.toLowerCase().trim()
      : true;

      let fyMatch = true;
    if (tableFilters.fy) {
      const date = new Date(item.date); // "2025-07-26"
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1–12

      // FY logic: FY 2024 = Apr 2023 - Mar 2024
      const fyStart = parseInt(tableFilters.fy) - 1;
      const fyEnd = parseInt(tableFilters.fy);
      fyMatch = (year === fyStart && month >= 4) || (year === fyEnd && month <= 3);
    }

    

    return divisionMatch && circleMatch && categoryMatch && fyMatch;
  });

  setDisplayData(filtered);
};


  return (
    <div className="flex flex-col space-y-6">
      {/* Fixed width filter panel */}
      <Card className="p-6 shadow-lg bg-white max-w-[1100px]">
      <CardHeader className="flex items-center justify-between">
     <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-wide flex items-center">
            Risk Parameters
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-5 h-5 ml-2 text-gray-500 cursor-pointer hover:text-blue-600 transition" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="max-w-xs text-sm">
                    These parameters will be in the range from 0 to 10.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
        </div>
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        onClick={() => navigate("/RiskAA")}
      >
        AI Analytics
      </Button>

      <Button onClick={handleFilter} disabled={loading}>
        {loading ? "Filtering..." : "Filter Taxpayers"}
      </Button>
    </div>
  </CardHeader>

     <CardContent>
  <div className="max-h-[60vh] overflow-y-auto pr-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(paramDetails).map(([param, { label, description }]) => (
        <div
          key={param}
          className="flex flex-col border p-3 rounded-lg bg-gray-50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{label}</span>
              <div className="relative group">
                <Info size={14} className="text-gray-500 cursor-pointer" />
                <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg w-64 -left-1 top-5 z-10">
                  {description}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              min="0"
              max="10"
              step="0.1"
              value={filters[param].min ?? ""}
              onChange={(e) => handleChange(param, "min", e.target.value)}
              className="w-20"
            />
            <Input
              type="number"
              placeholder="Max"
              min="0"
              max="10"
              step="0.1"
              value={filters[param].max ?? ""}
              onChange={(e) => handleChange(param, "max", e.target.value)}
              className="w-20"
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="mt-6 flex justify-center">
    <Button onClick={handleFilter} disabled={loading} className="w-48">
      {loading ? "Filtering..." : "Filter Taxpayers"}
    </Button>
  </div>
</CardContent>

    </Card>

    {/* Table Filters Section */}
   <Card className="p-6 shadow-lg bg-white max-w-[900px]">
     <div className="flex flex-col lg:flex-row lg:items-end gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
      {/* Division Dropdown */}
      <select
        value={tableFilters.division}
        onChange={(e) =>
          setTableFilters({ ...tableFilters, division: e.target.value })
        }
        className="border border-gray-300 rounded-md p-2 text-sm"
      >
        <option value="">All Divisions</option>
        {uniqueValues("division").map((div) => (
          <option key={div} value={div}>{div}</option>
        ))}
      </select>

      {/* Circle Dropdown */}
      <select
        value={tableFilters.circle}
        onChange={(e) =>
          setTableFilters({ ...tableFilters, circle: e.target.value })
        }
        className="border border-gray-300 rounded-md p-2 text-sm"
      >
        <option value="">All Circles</option>
        {uniqueValues("circle").map((circ) => (
          <option key={circ} value={circ}>{circ}</option>
        ))}
      </select>

      {/* Risk Category Dropdown */}
      <select
        value={tableFilters.riskCategory}
        onChange={(e) =>
          setTableFilters({ ...tableFilters, riskCategory: e.target.value })
        }
        className="border border-gray-300 rounded-md p-2 text-sm"
      >
        <option value="">All Risk Categories</option>
        {uniqueValues("riskCategory").map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* FY */}
      <select
  value={tableFilters.fy}
  onChange={(e) =>
    setTableFilters({ ...tableFilters, fy: e.target.value })
  }
  className="border border-gray-300 rounded-md p-2 text-sm"
>
  <option value="">All FY</option>
  <option value="2023">2022-23</option>
  <option value="2024">2023-24</option>
  <option value="2025">2024-25</option>
</select>
      
    </div>

    {/* Filter Button */}
    <div>
      <Button onClick={handleTableFilter}>Filter Table</Button>
    </div>
  </div>
</Card>

      {/* Table Section (doesn't stretch filter panel) */}
      <div className="overflow-x-auto">
        <Card className="p-4 shadow-md bg-white w-full">
          {displayData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="border border-gray-300 text-sm w-fit min-w-[1000px]">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {[
                      "GSTIN",
                      "Trade Name",
                      "Division",
                      "Date" ,
                      "Circle",
                      "Risk Category",
                      "Risk Score",
                      "Email",
                      "Mobile",
                      "Assigned To",
                      "Effective Dt Reg",
                      "Status",
                      "Suspension Date",
                      "Taxpayer Type",
                      "Constitution",
                      "Is Migrated",
                      "Lowest Jurisdiction",
                      "HSN Code",
                      "Address",
                      "# Additional Places",
                      "Lowest Juris",
                      "Cancel Effect Dt",
                      "Type Cancellation",
                      "Reason Cancel",
                      "Sector",
                    ].map((header) => (
                      <th key={header} className="border px-2 py-1 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td className="border px-2 py-1">{item.gstin}</td>
                      <td className="border px-2 py-1">{item.tradeNameLegalName}</td>
                      <td className="border px-2 py-1">{item.division}</td>
                      <td className="border px-2 py-1">{item.date}</td>
                      <td className="border px-2 py-1">{item.circle}</td>
                      <td className="border px-2 py-1">{item.riskCategory}</td>
                      <td className="border px-2 py-1">{item.riskProbabilityScore}</td>
                      <td className="border px-2 py-1">{item.emailId}</td>
                      <td className="border px-2 py-1">{item.mobileNum}</td>
                      <td className="border px-2 py-1">{item.assignedTo}</td>
                      <td className="border px-2 py-1">{item.effectiveDtReg}</td>
                      <td className="border px-2 py-1">{item.status}</td>
                      <td className="border px-2 py-1">{item.suspensionDate}</td>
                      <td className="border px-2 py-1">{item.taxpayerType}</td>
                      <td className="border px-2 py-1">{item.constitutionOfBusiness}</td>
                      <td className="border px-2 py-1">{item.isMigrated}</td>
                      <td className="border px-2 py-1">{item.lowestJurisdiction}</td>
                      <td className="border px-2 py-1">{item.hsnCode}</td>
                      <td className="border px-2 py-1">
                        {item.addressOfPrincipalPlaceOfBusiness}
                      </td>
                      <td className="border px-2 py-1">{item.noOfAdditionalPlaceOfBusiness}</td>
                      <td className="border px-2 py-1">{item.lowestJuris}</td>
                      <td className="border px-2 py-1">{item.cancelEffectDt}</td>
                      <td className="border px-2 py-1">{item.typeCancellation}</td>
                      <td className="border px-2 py-1">{item.reasonCancel}</td>
                      <td className="border px-2 py-1">{item.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No data found. Try adjusting filter ranges.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RiskFactorFilter;
