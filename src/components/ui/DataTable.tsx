
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  searchKeys?: string[];
  filterable?: boolean;
  filterKey?: string;
  filterOptions?: { label: string; value: string }[];
}

export const DataTable = ({
  columns,
  data,
  searchable = false,
  searchKeys = [],
  filterable = false,
  filterKey = "",
  filterOptions = [],
}: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    // Apply search filter if search is enabled and query exists
    if (searchable && searchQuery) {
      return searchKeys.some((key) => {
        const value = item[key];
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    }
    return true;
  }).filter((item) => {
    // Apply additional filters if enabled and a filter is selected
    if (filterable && activeFilter && filterKey) {
      return item[filterKey] === activeFilter;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      {(searchable || filterable) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          
          {filterable && filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 min-w-[150px]">
                  {activeFilter
                    ? filterOptions.find((opt) => opt.value === activeFilter)?.label || "Filter"
                    : "Filter"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {activeFilter && (
                  <DropdownMenuItem onClick={() => setActiveFilter(null)}>
                    Clear Filter
                  </DropdownMenuItem>
                )}
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setActiveFilter(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
};
