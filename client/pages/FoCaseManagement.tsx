import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config";

interface User {
  id: number;
  username: string;
}

interface CaseEntity {
  caseId: string;
  gstin: string;
  division: string;
  circle: string;
  turnover: number;
  asmt10Arn: string;
  asmt10IssueDate: string;
  remark: string; // system remark
  drc01: string;
  drc07: string;
  recoveryDoneCash: string;
  recoveryDoneCredit: string;
  status?: string;
}

interface CaseAssignment {
  id: number;
  taskId: string;
  caseEntity: CaseEntity;
  assignedAt: string;
  assignedBy: User;
  assignedTo: User;
}

export default function FoCaseManagement() {
 const [assignments, setAssignments] = useState<CaseAssignment[]>([]);
  const [draftAssignments, setDraftAssignments] = useState<CaseAssignment[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); 
    if (!userId) return;

    fetch(`${BASE_URL}/api/cases/assignto?userId=${userId}`)
      .then((res) => res.json())
      .then((data: CaseAssignment[]) => {
        setAssignments(data);
        setDraftAssignments(JSON.parse(JSON.stringify(data))); // deep copy
      })
      .catch((err) => console.error("Error fetching FO cases:", err));
  }, []);

  const [message, setMessage] = useState<string | null>(null);


  // Handle changes in *draft only*
  const handleDraftChange = (id: number, field: keyof CaseEntity, value: string) => {
    setDraftAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, caseEntity: { ...a.caseEntity, [field]: value } } : a
      )
    );
  };

  // Save updates backend + sync to main assignments
  const handleSave = (id: number) => {
    const draft = draftAssignments.find((a) => a.id === id);
    if (!draft) return;

    const body = {
      arn: draft.caseEntity.asmt10Arn,
      issueDate: draft.caseEntity.asmt10IssueDate,
      drc01: draft.caseEntity.drc01,
      drc07: draft.caseEntity.drc07,
      recoveryDoneCash: draft.caseEntity.recoveryDoneCash,
      recoveryDoneCredit: draft.caseEntity.recoveryDoneCredit,
      remarks: draft.caseEntity.remark,
    };

    fetch(`${BASE_URL}/api/cases/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((updated) => {
        console.log("Updated case:", updated);
        // update main assignments → KPIs recalc only now
        setAssignments((prev) =>
  prev.map((a) =>
    a.id === id
      ? {
          ...a,
          caseEntity: {
            ...a.caseEntity,
            asmt10Arn: draft.caseEntity.asmt10Arn,
            asmt10IssueDate: draft.caseEntity.asmt10IssueDate,
            drc01: draft.caseEntity.drc01,
            drc07: draft.caseEntity.drc07,
            recoveryDoneCash: draft.caseEntity.recoveryDoneCash,
            recoveryDoneCredit: draft.caseEntity.recoveryDoneCredit,
            remark: draft.caseEntity.remark,
          },
        }
      : a
  )
);

 setMessage("✅ Case updated successfully!");
      })
      .catch((err) => console.error("Error saving case:", err));
  };

  const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "started":
      return "bg-blue-100 text-blue-800 border border-blue-300";
    case "pending":
      return "bg-pink-100 text-pink-800 border border-pink-300";
    case "submitted":
      return "bg-green-100 text-green-800 border border-green-300";
    case "closed":
      return "bg-gray-200 text-gray-800 border border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

  // --- KPI calculations use only *assignments*, not drafts ---
  const totalCases = assignments.length;
  const dueAsmt10 = assignments.filter((a) => !a.caseEntity.asmt10Arn?.trim()).length;
  const dueDrc1 = assignments.filter((a) => !a.caseEntity.drc01?.trim()).length;
  const dueDrc7 = assignments.filter((a) => !a.caseEntity.drc07?.trim()).length;
  const totalRecovery = assignments.reduce((sum, a) => {
    const cash = parseFloat(a.caseEntity.recoveryDoneCash || "0");
    const credit = parseFloat(a.caseEntity.recoveryDoneCredit || "0");
    return sum + cash + credit;
  }, 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">FO Case Management</h2>

      {/* KPI Section */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="p-4 border rounded shadow text-center">
          <h3 className="font-medium">Total Cases</h3>
          <p className="text-lg font-bold">{totalCases}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="font-medium">Due ASMT-10</h3>
          <p className="text-lg font-bold">{dueAsmt10}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="font-medium">Due DRC-01</h3>
          <p className="text-lg font-bold">{dueDrc1}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="font-medium">Due DRC-07</h3>
          <p className="text-lg font-bold">{dueDrc7}</p>
        </div>
        <div className="p-4 border rounded shadow text-center">
          <h3 className="font-medium">Total Recovery</h3>
          <p className="text-lg font-bold">₹{totalRecovery.toFixed(2)}</p>
        </div>
      </div>

      {/* Case Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-[1600px] border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Case ID</th>
              <th className="p-2 border">GSTIN</th>
              <th className="p-2 border">Division</th>
              <th className="p-2 border">Circle</th>
              <th className="p-2 border">Turnover</th>
              <th className="p-2 border">Date of Assignment</th>
              <th className="p-2 border">Assigned By</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border w-[200px]">ASMT-10 ARN</th>
              <th className="p-2 border">ASMT-10 Issue Date</th>
              <th className="p-2 border">DRC01</th>
              <th className="p-2 border">DRC07</th>
              <th className="p-2 border">RecoveryDoneCash</th>
              <th className="p-2 border">RecoveryDoneCredit</th>
              <th className="p-2 border">System Remark</th>
              <th className="p-2 border">Action</th>
              
              
            </tr>
          </thead>
          <tbody>
            {draftAssignments.map((a) => (
              <tr key={a.id} className="text-center">
                <td className="border p-2">{a.caseEntity.caseId}</td>
                <td className="border p-2">{a.caseEntity.gstin}</td>
                <td className="border p-2">{a.caseEntity.division}</td>
                <td className="border p-2">{a.caseEntity.circle}</td>
                <td className="border p-2">{a.caseEntity.turnover}</td>
                <td className="border p-2">
                  {new Date(a.assignedAt).toLocaleDateString()}
                </td>
                <td className="border p-2">{a.assignedBy?.username || "-"}</td>
                <td className="border p-2 w-[200px]">
  <select
    className={`w-full p-1 rounded text-center font-medium ${getStatusColor(a.caseEntity.status || "pending")}`}
    value={a.caseEntity.status || "pending"}
    onChange={(e) => handleDraftChange(a.id, "status", e.target.value)}
  >
    <option value="started">Started</option>
    <option value="pending">Pending</option>
    <option value="submitted">Submitted</option>
    <option value="closed">Closed</option>
  </select>
</td>
                <td className="border p-2 w-[300px]">
                  <Input
                    value={a.caseEntity.asmt10Arn || ""}
                    onChange={(e) => handleDraftChange(a.id, "asmt10Arn", e.target.value)}
                  />
                </td>
                 

                <td className="border p-2">
                  <Input
                    type="date"
                    value={a.caseEntity.asmt10IssueDate || ""}
                    onChange={(e) =>
                      handleDraftChange(a.id, "asmt10IssueDate", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={a.caseEntity.drc01 || ""}
                    onChange={(e) => handleDraftChange(a.id, "drc01", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={a.caseEntity.drc07 || ""}
                    onChange={(e) => handleDraftChange(a.id, "drc07", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={a.caseEntity.recoveryDoneCash || ""}
                    onChange={(e) =>
                      handleDraftChange(a.id, "recoveryDoneCash", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <Input
                    value={a.caseEntity.recoveryDoneCredit || ""}
                    onChange={(e) =>
                      handleDraftChange(a.id, "recoveryDoneCredit", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2 w-[300px]">
                  <textarea
                    className="w-full p-2 border rounded resize-none"
                    rows={3}
                    value={a.caseEntity.remark || ""}
                    onChange={(e) => handleDraftChange(a.id, "remark", e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <Button size="sm" onClick={() => handleSave(a.id)}>
                    Save
                  </Button>
                </td>
               
                {message && (
  <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">
    {message}
  </div>
)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
