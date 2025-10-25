import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const dummyData: Record<string, any> = {
  "22ABPCS9238K1DZ": {
    basic: {
      gstin: "22ABPCS9238K1DZ",
      trade_name: "JAI INDUSTRIES",
      legal_name: "JAI INDUSTRIES PRIVATE LTD",
      assigned_to: "STATE",
      division: "Raipur Division-1",
      circle: "Raipur-3",
      email: "jaiindustries@gmail.com",
      mobile: "98260****",
      business_start: "2022-02-15",
      hsn_code: "72031000,72044900",
      principal_place: "GE Road, Raipur, CG, 492001",
    },
    bank: {
      type: "C",
      account_number: "016105501774",
      bank_name: "BANK LIMITED",
      branch_address: "RAIPUR, 492010",
      validation_date: "18/04/2024",
      status: "S",
    },
    gstReturns: [
      { year: "2023-2024", turnover: "44,260,613.9", tax_liability: "7,633,102.5", paid_by_credit: "7,583,082", paid_by_cash: "50,000" },
      { year: "2024-2025", turnover: "51,034,054.8", tax_liability: "9,428,010.45", paid_by_credit: "9,118,408", paid_by_cash: "677,290" },
      { year: "2025-2026", turnover: "67,231,625", tax_liability: "12,101,692.5", paid_by_credit: "12,101,692", paid_by_cash: "0" },
    ],
    gstLiability: [
      { year: "2023-2024", gstr1: 7633082.5, gstr3b: 7633102.5, diff: -20, remarks: "NA" },
      { year: "2024-2025", gstr1: 91861298.72, gstr3b: 94280110.45, diff: -2418811.73, remarks: "NA" },
      { year: "2025-2026", gstr1: 12101692.5, gstr3b: 12101692.5, diff: 0, remarks: "NA" },
    ],
    gstITC: [
      { year: "2023-2024", gstr2a: 9652668.08, gstr3b: 9652668.08, diff: 0, remarks: "NA" },
      { year: "2024-2025", gstr2a: 85429513.78, gstr3b: 94004400.26, diff: 8574886.48, remarks: "Excess claimed in GSTR-3B" },
      { year: "2025-2026", gstr2a: 30079205.82, gstr3b: 30261483.36, diff: 182277.54, remarks: "Excess claimed in GSTR-3B" },
    ],
    network: [
      { supplier_gstin: "22AAAXXX1Z", trade_name: "BHARAT TRADERS", status: "active", itc: 1343.78 },
      { supplier_gstin: "22AAAXXX2Z", trade_name: "PATEL ENTERPRISES", status: "active", itc: 48595.9 },
      { supplier_gstin: "22AAAXXX3Z", trade_name: "YOG TRADERS", status: "cancelled", itc: 207815.4 },
    ],
  },
  // Add another GSTIN for testing
  "22ABWFM9039L1DR": {
    basic: {
      gstin: "22ABWFM9039L1DR",
      trade_name: "SHREE MOTORS",
      legal_name: "SHREE MOTORS LTD",
      assigned_to: "STATE",
      division: "Raipur Division-2",
      circle: "Raipur-5",
      email: "shreemotors@gmail.com",
      mobile: "98265****",
      business_start: "2023-01-01",
      hsn_code: "87089900",
      principal_place: "Tatibandh, Raipur, CG, 492001",
    },
    bank: {
      type: "S",
      account_number: "025604600022",
      bank_name: "HICF BANK",
      branch_address: "Mowa Branch, Raipur",
      validation_date: "12/03/2024",
      status: "Verified",
    },
    gstReturns: [
      { year: "2023-2024", turnover: "36,540,800.2", tax_liability: "5,312,890.5", paid_by_credit: "5,000,000", paid_by_cash: "312,890.5" },
      { year: "2024-2025", turnover: "49,245,680.8", tax_liability: "7,821,000.0", paid_by_credit: "7,600,000", paid_by_cash: "221,000" },
      { year: "2025-2026", turnover: "56,120,490.6", tax_liability: "8,732,410.2", paid_by_credit: "8,200,000", paid_by_cash: "532,410.2" },
    ],
    gstLiability: [
      { year: "2023-2024", gstr1: 5200000, gstr3b: 5312890.5, diff: -112890.5, remarks: "NA" },
      { year: "2024-2025", gstr1: 7800000, gstr3b: 7821000, diff: -21000, remarks: "NA" },
      { year: "2025-2026", gstr1: 8700000, gstr3b: 8732410.2, diff: -32410.2, remarks: "NA" },
    ],
    gstITC: [
      { year: "2023-2024", gstr2a: 6250000, gstr3b: 6300000, diff: 50000, remarks: "Excess claimed in GSTR-3B" },
      { year: "2024-2025", gstr2a: 8150000, gstr3b: 8210000, diff: 60000, remarks: "Excess claimed in GSTR-3B" },
      { year: "2025-2026", gstr2a: 9300000, gstr3b: 9400000, diff: 100000, remarks: "Excess claimed in GSTR-3B" },
    ],
    network: [
      { supplier_gstin: "22BBXXX1Z", trade_name: "OM PARTS", status: "active", itc: 22890.22 },
      { supplier_gstin: "22BBXXX2Z", trade_name: "DEV AUTO", status: "active", itc: 56410.0 },
    ],
  },
};

export default function TaxpayerReport() {
  const [gstin, setGstin] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [fet, setfet] = useState("");
  

  const handleFetch = () => {
    const result = dummyData[gstin.toUpperCase()];
    setData(result || null);
    setfet("A") ;
  };

  

  return (
    <div className="p-6 space-y-6">
      {/* Input Section */}
      
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>GSTIN Lookup</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Enter GSTIN (e.g., 22ABPCS9238K1DZ)"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
          />
          <Button onClick={handleFetch}>Fetch</Button>
        </CardContent>
      </Card>

      {/* Report Section */}
      {data ? (
        <div className="space-y-8">
          {/* Basic Details */}
          <Card>
            <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm border">
                <tbody>
                  {Object.entries(data.basic).map(([key, val]) => (
                    <tr key={key} className="border-b">
                      <td className="font-medium capitalize p-2 w-1/3 bg-gray-50">
                        {key.replace("_", " ")}
                      </td>
                      <td className="p-2">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm border">
                <tbody>
                  {Object.entries(data.bank).map(([key, val]) => (
                    <tr key={key} className="border-b">
                      <td className="font-medium capitalize p-2 w-1/3 bg-gray-50">
                        {key.replace("_", " ")}
                      </td>
                      <td className="p-2">{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* GST Returns */}
          <Card>
            <CardHeader><CardTitle>Details of GST Returns</CardTitle></CardHeader>
            <CardContent className="space-y-8">

              {/* Table 1 */}
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Financial Year</th>
                    <th className="p-2 border">Taxable Turnover</th>
                    <th className="p-2 border">Total Tax Liability</th>
                    <th className="p-2 border">Paid by Credit</th>
                    <th className="p-2 border">Paid by Cash</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gstReturns.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">{row.year}</td>
                      <td className="p-2 border">{row.turnover}</td>
                      <td className="p-2 border">{row.tax_liability}</td>
                      <td className="p-2 border">{row.paid_by_credit}</td>
                      <td className="p-2 border">{row.paid_by_cash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table 2 - Liability Comparison */}
              <table className="w-full text-sm border">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">Financial Year</th>
                    <th className="p-2 border">Liability as per GSTR-1</th>
                    <th className="p-2 border">Liability as per GSTR-3B</th>
                    <th className="p-2 border">Differences (GSTR-1 - GSTR-3B)</th>
                    <th className="p-2 border">Remarks if any</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gstLiability.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">{row.year}</td>
                      <td className="p-2 border">{row.gstr1}</td>
                      <td className="p-2 border">{row.gstr3b}</td>
                      <td className="p-2 border">{row.diff}</td>
                      <td className="p-2 border">{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table 3 - ITC Comparison */}
              <table className="w-full text-sm border">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">Financial Year</th>
                    <th className="p-2 border">ITC available in GSTR-2A</th>
                    <th className="p-2 border">ITC availed in GSTR-3B</th>
                    <th className="p-2 border">Differences (GSTR-3B - GSTR-2A)</th>
                    <th className="p-2 border">Remarks if any</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gstITC.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">{row.year}</td>
                      <td className="p-2 border">{row.gstr2a}</td>
                      <td className="p-2 border">{row.gstr3b}</td>
                      <td className="p-2 border">{row.diff}</td>
                      <td className="p-2 border">{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </CardContent>
          </Card>

          {/* Network Analysis */}
          <Card>
            <CardHeader><CardTitle>Network Analysis - Inward Supplies</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Supplier GSTIN</th>
                    <th className="p-2 border">Trade Name</th>
                    <th className="p-2 border">ITC in GSTR2A</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.network.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 border">{item.supplier_gstin}</td>
                      <td className="p-2 border">{item.trade_name}</td>
                      <td className="p-2 border">{item.itc}</td>
                      <td className="p-2 border">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        fet && (
          <Card className="max-w-md mx-auto text-center text-gray-600 p-4 shadow">
            <p>No data found for GSTIN: <b>{gstin}</b></p>
          </Card>
        )
      )}
    </div>
  );
}
