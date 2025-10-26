import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";

interface FilterOption {
  field: string;
  operator: "equals" | "contains" | "greater" | "less" | "between";
  value: string | number;
  value2?: string | number; // For "between" operator
}

interface DataFilterProps {
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
  className?: string;
}

export function DataFilter({ data, onFilterChange, className }: DataFilterProps) {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFilter, setNewFilter] = useState<Partial<FilterOption>>({});

  // Get available fields from data
  const getAvailableFields = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key !== 'id');
  };

  const applyFilters = (filtersToApply: FilterOption[], search: string) => {
    let filtered = [...data];

    // Apply search term
    if (search) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply filters
    filtersToApply.forEach(filter => {
      filtered = filtered.filter(item => {
        const fieldValue = item[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case "equals":
            return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
          case "contains":
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case "greater":
            return Number(fieldValue) > Number(filterValue);
          case "less":
            return Number(fieldValue) < Number(filterValue);
          case "between":
            return Number(fieldValue) >= Number(filterValue) && Number(fieldValue) <= Number(filter.value2);
          default:
            return true;
        }
      });
    });

    onFilterChange(filtered);
  };

  const addFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== undefined) {
      const updatedFilters = [...filters, newFilter as FilterOption];
      setFilters(updatedFilters);
      applyFilters(updatedFilters, searchTerm);
      setNewFilter({});
    }
  };

  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    applyFilters(updatedFilters, searchTerm);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(filters, value);
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchTerm("");
    onFilterChange(data);
  };

  const availableFields = getAvailableFields();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Data Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search across all fields..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Add New Filter */}
        <div className="space-y-2">
          <Label>Add Filter</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select value={newFilter.field} onValueChange={(value) => setNewFilter({ ...newFilter, field: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map(field => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newFilter.operator} onValueChange={(value: any) => setNewFilter({ ...newFilter, operator: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
                <SelectItem value="between">Between</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Value"
              value={newFilter.value || ""}
              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
            />

            {newFilter.operator === "between" && (
              <Input
                placeholder="To"
                value={newFilter.value2 || ""}
                onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
              />
            )}
          </div>
          <Button onClick={addFilter} size="sm" className="w-full md:w-auto">
            Add Filter
          </Button>
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Active Filters</Label>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {filter.field} {filter.operator} {filter.value}
                  {filter.operator === "between" && ` - ${filter.value2}`}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeFilter(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
