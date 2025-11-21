import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { BASE_URL } from "@/config";


interface CaseEntity {
  caseId: string;
  gstin: string;
  tradeNameLegalName: string;
  division: string;
  circle: string;
  taxPeriodFrom: string | null;
  taxPeriodTo: string | null;
  dateOfAssignment: string | null;
  turnover: number;
  parameters: number | null;
}

interface Division {
  id: number;
  name: string;
}
interface Subdivision {
  id: number;
  name: string;
  division: Division;
}
interface Designation {
  id: number;
  name: string;
}
interface Person {
  id: number;
  username: string;
  email: string;
  role: string;
}
interface Assignment {
  id: number;
  person: Person;
  subDivision: Subdivision;
  designation: Designation;
}

const DealerMonitoringAssign: React.FC = () => {
  const [filters, setFilters] = useState({ division: "All", circle: "All", minTurnover: "", maxTurnover: "" ,  year: "All" });
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

   const [casesData, setcasesData] = useState<CaseEntity[]>([]);
   const [loading, setLoading] = useState(true);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [users, setUsers] = useState<Assignment[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Assignment[]>([]);


  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const availableYears = useMemo(() => {
  const years = casesData
    .map(c => c.dateOfAssignment ? new Date(c.dateOfAssignment).getFullYear() : null)
    .filter((y): y is number => y !== null);
  return Array.from(new Set(years)).sort((a, b) => b - a); // latest first
}, [casesData]);

 

   useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get<CaseEntity[]>(BASE_URL + "/api/cases");
        setcasesData(res.data);
      } catch (err) {
        console.error("Error fetching cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + "/admin/divisions").then((res) => setDivisions(res.data));
    axios.get(BASE_URL + "/admin/subdivisions").then((res) => setSubdivisions(res.data));
    axios.get(BASE_URL + "/admin/designations").then((res) => setDesignations(res.data));
  }, []);

   const [userFilters, setUserFilters] = useState({
  division: "",
  circle: "",
  designation: "",
  search: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams();
        if (userFilters.division) params.append("divisionId", userFilters.division);
        if (userFilters.circle) params.append("subDivisionId", userFilters.circle);
        if (userFilters.designation) params.append("designationId", userFilters.designation);

        const res = await axios.get<Assignment[]>(`${BASE_URL}/admin/assignments?${params.toString()}`);
        let data = res.data;

        // Search by username
        if (userFilters.search) {
          data = data.filter((u) =>
            u.person.username.toLowerCase().includes(userFilters.search.toLowerCase())
          );
        }

        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [userFilters.division, userFilters.circle, userFilters.designation, userFilters.search]);

  // Filtered Cases
  const filteredCases = useMemo(() => {
  return casesData.filter((c) => {
    const divMatch = filters.division === "All" || c.division === filters.division;
    const circleMatch = filters.circle === "All" || c.circle === filters.circle;
    const turnoverMatch =
      (!filters.minTurnover || c.turnover >= parseInt(filters.minTurnover)) &&
      (!filters.maxTurnover || c.turnover <= parseInt(filters.maxTurnover));

       const yearMatch =
      filters.year === "All" ||
      (c.dateOfAssignment && new Date(c.dateOfAssignment).getFullYear().toString() === filters.year);

    return divMatch && circleMatch && turnoverMatch && yearMatch;
  });
}, [casesData, filters]); 

  // Filtered Users
 

  // Handle Select All
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCases([]);
      setSelectAll(false);
    } else {
      setSelectedCases(filteredCases.map((c) => c.caseId));
      setSelectAll(true);
    }
  };

  // Toggle individual case
  const toggleCaseSelection = (caseId: string) => {
    setSelectedCases((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };


  // Toggle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Assign
 const assignCases = async () => {
  if (selectedUsers.length === 0 || selectedCases.length === 0) {
    alert("Select cases and users first.");
    return;
  }

  const currentUserId = localStorage.getItem("userId"); // depends on your auth system

  try {
    await axios.post(BASE_URL + "/api/cases/assign", {
      caseIds: selectedCases,
      userIds: selectedUsers,
      assignedByUserId: currentUserId,
    });

    alert("Cases assigned successfully!");
    setSelectedCases([]);
    setSelectAll(false);
  } catch (err) {
    console.error("Assignment failed", err);
    alert("Failed to assign cases.");
  }
};


  const randomAllocate = () => {
    if (selectedUsers.length === 0 || selectedCases.length === 0) return;
    const assignments: { caseId: string; userId: number }[] = [];

    selectedCases.forEach((caseId) => {
      const randomUserId = selectedUsers[Math.floor(Math.random() * selectedUsers.length)];
      assignments.push({ caseId, userId: randomUserId });
    });

    console.log("Random Allocation:", assignments);
    alert("Cases randomly allocated!");
  };

  

  return (
    <div className="space-y-6 p-4">
         
      {/* Case Filters */}
      <Card>
        <CardHeader><CardTitle>Filter Cases</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Division</Label>
            <Select value={filters.division} onValueChange={(val) => setFilters({ ...filters, division: val })}>
              <SelectTrigger><SelectValue placeholder="Division" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {[...new Set(casesData.map((c) => c.division))].map((div) => (
                  <SelectItem key={div} value={div}>{div}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Circle</Label>
            <Select value={filters.circle} onValueChange={(val) => setFilters({ ...filters, circle: val })}>
              <SelectTrigger><SelectValue placeholder="Circle" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {[...new Set(casesData.map((c) => c.circle))].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Min Turnover (Cr.)</Label>
            <Input type="number" value={filters.minTurnover} onChange={(e) => setFilters({ ...filters, minTurnover: e.target.value })} />
          </div>
          <div>
            <Label>Max Turnover (Cr.)</Label>
            <Input type="number" value={filters.maxTurnover} onChange={(e) => setFilters({ ...filters, maxTurnover: e.target.value })} />
          </div>
          <div>
  <Label>Year</Label>
  <Select 
    value={filters.year} 
    onValueChange={(val) => setFilters({ ...filters, year: val })}
  >
    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="All">All</SelectItem>
      {availableYears.map((y) => (
        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  </div>

        </CardContent>
        
      </Card>
      

      {/* Case List */}
      <Card>
  <CardHeader>
    <div className="flex justify-between items-center w-full">
      <CardTitle>Cases</CardTitle>
      <Button variant="outline" size="sm" onClick={handleSelectAll}>
        {selectAll ? "Deselect All" : "Select All Filtered"}
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    <table className="w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
            <th className="px-3 py-2 border">Select</th>
          <th className="px-3 py-2 border">Case ID</th>
              <th className="px-3 py-2 border">GSTIN</th>
              <th className="px-3 py-2 border">Trade Name</th>
              <th className="px-3 py-2 border">Division</th>
              <th className="px-3 py-2 border">Circle</th>
              <th className="px-3 py-2 border">Date of Assignment</th>
              <th className="px-3 py-2 border">Turnover (Cr.)</th>
        </tr>
      </thead>
      <tbody>
        {filteredCases.map((c) => (
          <tr key={c.caseId} className="border-t">
            <td className="p-2">
              <Checkbox
                checked={selectedCases.includes(c.caseId)}
                onCheckedChange={() => toggleCaseSelection(c.caseId)}
              />
            </td>
               <td className="px-3 py-2 border">{c.caseId}</td>
                <td className="px-3 py-2 border">{c.gstin}</td>
                <td className="px-3 py-2 border">{c.tradeNameLegalName}</td>
                <td className="px-3 py-2 border">{c.division}</td>
                <td className="px-3 py-2 border">{c.circle}</td>
                <td className="px-3 py-2 border">{c.dateOfAssignment}</td>
                <td className="px-3 py-2 border">{c.turnover}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </CardContent>
</Card>

      {/* User Selection */}
      <Card>
      <CardHeader>
        <CardTitle>Assign to Users</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
           <Select
        value={userFilters.division}
        onValueChange={(val) => setUserFilters({ ...userFilters, division: val === "All" ? "" : val })} // ✨ CHANGE HERE
      >
        <SelectTrigger>
          <SelectValue placeholder="Division" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Divisions</SelectItem>
          {divisions.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

           <Select
        value={userFilters.circle}
        onValueChange={(val) => setUserFilters({ ...userFilters, circle: val === "All" ? "" : val })} // ✨ CHANGE HERE
      >
        <SelectTrigger>
          <SelectValue placeholder="Circle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Circles</SelectItem>
          {subdivisions
            .filter((s) => !userFilters.division || String(s.division.id) === userFilters.division)
            .map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {/* Designation */}
      <Select
        value={userFilters.designation}
        onValueChange={(val) => setUserFilters({ ...userFilters, designation: val === "All" ? "" : val })} // ✨ CHANGE HERE
      >
        <SelectTrigger>
          <SelectValue placeholder="Designation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Designations</SelectItem>
          {designations.map((dg) => (
            <SelectItem key={dg.id} value={String(dg.id)}>
              {dg.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  
        </div>
        <div className="mb-4">
      <Input
        placeholder="🔍 Search by Name"
        value={userFilters.search}
        onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value })}
      />
      </div>

        {/* User List */}
        <div className="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
          {filteredUsers.length === 0 && <p>No users found</p>}
          {filteredUsers.map((u) => (
            <div key={u.id} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUsers.includes(u.id)}
                onCheckedChange={() => toggleUserSelection(u.id)}
              />
              <span>
                {u.person.username} ({u.designation.name}) - {u.subDivision.name}/
                {u.subDivision.division.name}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button onClick={assignCases} disabled={selectedCases.length === 0}>
            Assign Selected Cases
          </Button>
          <Button variant="secondary" onClick={randomAllocate} disabled={selectedCases.length === 0}>
            Randomly Allocate
          </Button>
        </div>
      </CardContent>
    </Card>

    </div>
  );
};

export default DealerMonitoringAssign;
