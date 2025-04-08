
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KnowledgeCard } from "@/components/dashboard/KnowledgeCard";
import { Input } from "@/components/ui/input";
import { mockKnowledgeItems } from "@/data/mockData";
import { KnowledgeItem, KnowledgeType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  BookOpen,
  FileText,
  Info,
  MessageSquare,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamKnowledgeBase = () => {
  const { currentUser } = useAuth();
  const [items] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | null>(null);

  // Filter items based on search, category, type and sections
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesType = !typeFilter || item.type === typeFilter;
    
    // Only show section-specific content if it matches current user's sections
    // or if it's not section specific
    const matchesSections = 
      !item.department || 
      !currentUser?.sections || 
      currentUser.sections.includes(item.department);

    return matchesSearch && matchesCategory && matchesType && matchesSections;
  });

  // Extract unique categories for filter
  const categories = Array.from(
    new Set(items.map((item) => item.category))
  );

  return (
    <DashboardLayout allowedRoles={["employee"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Access guides, instructions, and resources for your work
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value as KnowledgeType || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="instruction">Instruction</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 p-3 rounded-md flex flex-wrap gap-3 md:gap-6">
          <div className="text-sm">Document Types:</div>
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span>Guide</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Instruction</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Info className="h-4 w-4 text-purple-600" />
            <span>Policy</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MessageSquare className="h-4 w-4 text-amber-600" />
            <span>FAQ</span>
          </div>
        </div>

        {/* Knowledge items grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <KnowledgeCard
                key={item.id}
                item={item}
                isEditable={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No documents found</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamKnowledgeBase;
