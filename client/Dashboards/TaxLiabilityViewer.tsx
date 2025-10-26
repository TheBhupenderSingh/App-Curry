import React, { useState } from "react";
import * as XLSX from "xlsx";


interface TaxRow {
  value: number;
}



const TaxLiabilityViewer: React.FC = () => {
  const [rows, setRows] = useState<TaxRow[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
          raw: false,
          header: 1,
        });

        if (jsonData.length <= 1) {
          setError("No data found in Excel file.");
          return;
        }

        const headerRow = jsonData[0].map((h: any) => String(h).trim().toLowerCase());
        const targetIndex = headerRow.findIndex((h: string) => h.includes("total_tax_liability") || h.includes("total tax liability"));

        if (targetIndex === -1) {
          setError("Column 'total_tax_liability' not found.");
          return;
        }

        const extracted: TaxRow[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const rawValue = row[targetIndex];
          if (rawValue !== undefined && rawValue !== "") {
            let cleaned = String(rawValue).replace(/,/g, "").trim();
            let num = parseFloat(cleaned);
            if (!isNaN(num)) {
              extracted.push({ value: num });
            }
          }
        }

        if (extracted.length === 0) {
          setError("No numeric values found in 'total_tax_liability' column.");
          return;
        }

        // Sort by highest value and take top 10
        const top10 = extracted.sort((a, b) => b.value - a.value).slice(0, 10);
        setRows(top10);
        setError("");
      } catch (err) {
        setError("Failed to read Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Top 10 Tax Liabilities</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {rows.length > 0 && (
        <table className="mt-4 border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">Total Tax Liability</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-gray-400 px-2 py-1">{row.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaxLiabilityViewer;
