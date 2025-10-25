import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface ModelPrediction {
  gstin: string;
  final_risk_score: number;
}

const RiskModelPredictions: React.FC = () => {
  const [data, setData] = useState<ModelPrediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:9090/api/python/risknew");
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const json = await res.json();

        if (json.model_predictions && Array.isArray(json.model_predictions)) {
          setData(json.model_predictions);
        } else {
          throw new Error("Response missing 'model_predictions'");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading model predictions...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center p-4">
        <p>Error: {error}</p>
      </div>
    );

  if (!data.length)
    return (
      <div className="text-gray-600 text-center p-4">
        <p>No prediction data available.</p>
      </div>
    );

  // ✅ Compute KPI counts
  const lowRiskCount = data.filter((row) => row.final_risk_score * 100 <= 30).length;
  const mediumRiskCount = data.filter((row) => row.final_risk_score * 100 > 30 && row.final_risk_score * 100 <= 60).length;
  const highRiskCount = data.filter((row) => row.final_risk_score * 100 > 60).length;

  return (
  <div className="overflow-x-auto p-6 flex flex-col items-center">
    <Card className="p-6 shadow-lg bg-white rounded-2xl w-full max-w-[1200px]">
      {/* KPI Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card className="p-4 bg-green-50 text-green-800 text-center font-semibold rounded-lg">
          Low Risk (0–30%): {lowRiskCount}
        </Card>
        <Card className="p-4 bg-yellow-50 text-yellow-800 text-center font-semibold rounded-lg">
          Medium Risk (30–60%): {mediumRiskCount}
        </Card>
        <Card className="p-4 bg-red-50 text-red-800 text-center font-semibold rounded-lg">
          High Risk (60%+): {highRiskCount}
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Model Predictions</h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[50vh] overflow-y-auto">
        <Table>
          <TableHeader className="bg-gray-100 sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-gray-700 font-semibold">#</TableHead>
              <TableHead className="text-gray-700 font-semibold">GSTIN</TableHead>
              <TableHead className="text-gray-700 font-semibold">Final Risk Score</TableHead>
              <TableHead className="text-gray-700 font-semibold">Percent</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => {
              const percent = row.final_risk_score * 100;
              let colorClass = "";
              if (percent <= 30) colorClass = "text-green-600 font-medium";
              else if (percent <= 60) colorClass = "text-yellow-600 font-medium";
              else colorClass = "text-red-600 font-medium";

              return (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{row.gstin}</TableCell>
                  <TableCell>{row.final_risk_score.toFixed(6)}</TableCell>
                  <TableCell className={colorClass}>{percent.toFixed(2)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
);

};

export default RiskModelPredictions;
