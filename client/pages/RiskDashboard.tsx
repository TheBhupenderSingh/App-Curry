import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import RiskModelPredictions from "./RiskModelPredictions";
import { BASE_URL } from "@/config";

// --- INTERFACES ---
interface RocCurve {
  fpr: number[];
  tpr: number[];
}

interface ClassificationReportItem {
  precision: number;
  recall: number;
  "f1-score": number;
  support: number;
}

interface ClassificationReport {
  0: ClassificationReportItem;
  1: ClassificationReportItem;
  accuracy: number;
  "macro avg": ClassificationReportItem;
  "weighted avg": ClassificationReportItem;
}

interface FeatureWeight {
  feature: string;
  weight: number;
}

interface FactorLoadings {
  feature_names: string[];
  loadings: number[][];
}

interface PythonRiskData {
  roc_auc: number;
  
  roc_curve: RocCurve;
  classification_report: ClassificationReport;
  confusion_matrix: number[][];
  feature_weights: FeatureWeight[];
  factor_loadings: FactorLoadings;
  execution_time_sec: number;
}

// --- COMPONENT ---
const RiskDashboard: React.FC = () => {
  const [data, setData] = useState<PythonRiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<PythonRiskData>(BASE_URL + "/api/python/risk")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Running ML Algorithm for Prediction ... Please wait (~10 sec)</p>;
  if (error) return <p>Error fetching data: {error}</p>;
  if (!data) return <p>No data available</p>;

  const rocData = data.roc_curve.fpr.map((fpr, i) => ({
    fpr,
    tpr: data.roc_curve.tpr[i],
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Risk Analysis Dashboard</h2>
      <RiskModelPredictions />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="text-center p-4">
            <p className="text-sm text-gray-500">ROC AUC</p>
            <h3 className="text-xl font-bold">{data.roc_auc.toFixed(3)}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-4">
            <p className="text-sm text-gray-500">Accuracy</p>
            <h3 className="text-xl font-bold">
              {(data.classification_report.accuracy * 100).toFixed(2)}%
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center p-4">
            <p className="text-sm text-gray-500">Execution Time</p>
            <h3 className="text-xl font-bold">{data.execution_time_sec}s</h3>
          </CardContent>
        </Card>
      </div>

      {/* --- MODIFIED LAYOUT: Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ROC Curve */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">ROC Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fpr" label={{ value: "FPR", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "TPR", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line type="monotone" dataKey="tpr" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confusion Matrix */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <h3 className="text-lg font-semibold mb-4">Confusion Matrix</h3>
            <div className="grid grid-cols-2 w-40 text-center mx-auto">
              {data.confusion_matrix.flat().map((val, idx) => (
                <div
                  key={idx}
                  className={`p-4 border font-medium ${
                    idx === 0 || idx === 3 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Weights */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Feature Weights</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.feature_weights}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" angle={-45} textAnchor="end" interval={0} height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="weight">
                  {data.feature_weights.map((fw, i) => (
                    <Cell key={i} fill={fw.weight > 0 ? "#16a34a" : "#dc2626"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Classification Report */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Classification Report</h3>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Class</th>
                    <th className="border px-2 py-1">Precision</th>
                    <th className="border px-2 py-1">Recall</th>
                    <th className="border px-2 py-1">F1-Score</th>
                  </tr>
                </thead>
                <tbody>
                  {["0", "1"].map((cls) => (
                    <tr key={cls}>
                      <td className="border px-2 py-1 text-center font-semibold">{cls}</td>
                      <td className="border px-2 py-1 text-center">
                        {data.classification_report[cls as "0" | "1"].precision.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {data.classification_report[cls as "0" | "1"].recall.toFixed(2)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {data.classification_report[cls as "0" | "1"]["f1-score"].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Factor Loadings (Spans both columns) */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Factor Loadings (Heatmap)</h3>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Factor</th>
                    {data.factor_loadings.feature_names.map((name, i) => (
                      <th key={i} className="border px-2 py-1 text-center">{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.factor_loadings.loadings.map((row, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1 font-semibold text-center">F{i + 1}</td>
                      {row.map((cell, j) => {
                        const intensity = Math.min(Math.max(cell, -1), 1);
                        const red = intensity < 0 ? 255 : 255 - intensity * 155;
                        const green = intensity > 0 ? 255 : 255 - Math.abs(intensity) * 155;
                        const color = `rgb(${red}, ${green}, 200)`;

                        return (
                          <td
                            key={j}
                            className="border text-center px-2 py-1"
                            style={{ backgroundColor: color }}
                          >
                            {cell.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default RiskDashboard;