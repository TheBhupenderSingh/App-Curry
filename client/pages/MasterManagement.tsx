import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function PeopleFilterPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [subdivisions, setSubdivisions] = useState<Subdivision[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [people, setPeople] = useState<Assignment[]>([]);

  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [selectedSubdivision, setSelectedSubdivision] = useState<string>("");
  const [selectedDesignation, setSelectedDesignation] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Fetch data on mount
  useEffect(() => {
    fetch("http://localhost:9090/admin/divisions").then(res => res.json()).then(setDivisions);
    fetch("http://localhost:9090/admin/subdivisions").then(res => res.json()).then(setSubdivisions);
    fetch("http://localhost:9090/admin/designations").then(res => res.json()).then(setDesignations);
  }, []);

  const handleSearch = () => {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (selectedDivision) params.append("divisionId", selectedDivision);
  if (selectedSubdivision) params.append("subDivisionId", selectedSubdivision);
  if (selectedDesignation) params.append("designationId", selectedDesignation);

  fetch(`http://localhost:9090/admin/assignments?${params.toString()}`)
    .then(res => res.json())
    .then((data) => {
      console.log("Fetched assignments:", data);
      setPeople(data);
    });

    
};


  return (
    <div className="p-6 space-y-4">
      <Card className="p-4 space-y-4">
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select onValueChange={setSelectedDivision}>
            <SelectTrigger>
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              
              {divisions.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedSubdivision}>
            <SelectTrigger>
              <SelectValue placeholder="Select Subdivision" />
            </SelectTrigger>
            <SelectContent>
              {subdivisions
                .filter((s) => !selectedDivision || String(s.division.id) === selectedDivision)
                .map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedDesignation}>
            <SelectTrigger>
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              {designations.map((dg) => (
                <SelectItem key={dg.id} value={String(dg.id)}>
                  {dg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <Button onClick={handleSearch}>Search</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          {people.length === 0 && <p>No results found</p>}
          {people.map((a) => (
            <div key={a.id} className="p-2 border-b">
              <strong>{a.person.username}</strong> - {a.designation.name} ({a.subDivision.name}, {a.subDivision.division.name})
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
