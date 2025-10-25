import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_URL } from "@/config";

// Types
interface CaseEntity {
  caseId: string;
  gstin: string;
  tradeNameLegalName: string;
  dateOfAssignment :string;
  division: string;
  circle: string;
  asmt10Arn: string;
  asmt10IssueDate: string;
  drc01: string;
  drc07: string;
  recoveryDoneCash: number | null;
  remark: string;
  turnover: number;
}

interface User {
  id: number;
  username: string;
}

interface CaseAssignment {
  id: number;
  caseEntity: CaseEntity;
  assignedTo: User;
  assignedBy: User;
  assignedAt: string;
}

export default function DealerMonitoringReview() {
  const [assignments, setAssignments] = useState<CaseAssignment[]>([]);
  const [division, setDivision] = useState("All");
  const [circle, setCircle] = useState("All");
  const [turnover, setTurnover] = useState("All");

  useEffect(() => {
    const assignedByUserId = localStorage.getItem("userId");
    if (!assignedByUserId) {
      console.warn("No userId found in localStorage");
      return;
    }

    fetch(`${BASE_URL}/api/cases/assignments?assignedByUserId=${assignedByUserId}`)
      .then((res) => res.json())
      .then((data: CaseAssignment[]) => {
        setAssignments(data);
      })
      .catch((err) => console.error("Error fetching assignments:", err));
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    const c = a.caseEntity;
    return (
      (division === "All" || c.division === division) &&
      (circle === "All" || c.circle === circle) &&
      (turnover === "All" || c.turnover.toString() === turnover)
    );
  });

  // --- KPI Calculations ---
    // --- KPI Calculations ---
  const totalCases = filteredAssignments.length;

  const totalRecovery = filteredAssignments.reduce(
    (sum, a) => sum + (a.caseEntity.recoveryDoneCash ?? 0),
    0
  );

  // Due means the value is missing or empty
  const dueAsmt10 = filteredAssignments.filter(
    (a) => !a.caseEntity.asmt10Arn || a.caseEntity.asmt10Arn.trim() === ""
  ).length;

  const dueDrc1 = filteredAssignments.filter(
    (a) => !a.caseEntity.drc01 || a.caseEntity.drc01.trim() === ""
  ).length;

  const dueDrc7 = filteredAssignments.filter(
    (a) => !a.caseEntity.drc07 || a.caseEntity.drc07.trim() === ""
  ).length;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Review Cases</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Divisions</SelectItem>
              {[...new Set(assignments.map((a) => a.caseEntity.division))].map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={circle} onValueChange={setCircle}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Circle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Circles</SelectItem>
              {[...new Set(assignments.map((a) => a.caseEntity.circle))].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={turnover} onValueChange={setTurnover}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Turnover" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {[...new Set(assignments.map((a) => a.caseEntity.turnover.toString()))].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Total Cases</p>
              <p className="text-2xl font-bold">{totalCases}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Recovery Done (Cr.)</p>
              <p className="text-2xl font-bold">{totalRecovery}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Cases Due ASMT-10</p>
              <p className="text-2xl font-bold">{dueAsmt10}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Cases Due DRC-1</p>
              <p className="text-2xl font-bold">{dueDrc1}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Cases Due DRC-7</p>
              <p className="text-2xl font-bold">{dueDrc7}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1800px] border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Case ID</th>
                <th className="p-2 border">GSTIN</th>
                <th className="p-2 border">Trade Name</th>
                <th className="p-2 border">Date of Assignment</th>
                <th className="p-2 border">Division</th>
                <th className="p-2 border">Circle</th>
               
                <th className="p-2 border">Turnover (Cr.)</th>
                <th className="p-2 border">Assigned To</th>
                <th className="p-2 border">Assigned By</th>
                <th className="p-2 border">Assigned At</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((a, i) => (
                <tr key={i}>
                  <td className="p-2 border">{a.caseEntity.caseId}</td>
                  <td className="p-2 border">{a.caseEntity.gstin}</td>
                  <td className="p-2 border">{a.caseEntity.tradeNameLegalName}</td>
                  <td className="p-2 border">{a.caseEntity.dateOfAssignment}</td>
                  <td className="p-2 border">{a.caseEntity.division}</td>
                  <td className="p-2 border">{a.caseEntity.circle}</td>
                 
                  <td className="p-2 border">{a.caseEntity.turnover}</td>
                  <td className="p-2 border">{a.assignedTo?.username ?? "-"}</td>
                  <td className="p-2 border">{a.assignedBy?.username ?? "-"}</td>
                  <td className="p-2 border">
                    {a.assignedAt ? new Date(a.assignedAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
