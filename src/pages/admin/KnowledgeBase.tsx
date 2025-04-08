
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KnowledgeCard } from "@/components/dashboard/KnowledgeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockKnowledgeItems } from "@/data/mockData";
import { KnowledgeItem, KnowledgeType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  BookOpen,
  FileText,
  Filter,
  Info,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const KnowledgeBase = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({
    title: "",
    content: "",
    type: "guide",
    category: "",
  });

  // Filtered items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesType = !typeFilter || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Extract unique categories for filter
  const categories = Array.from(
    new Set(items.map((item) => item.category))
  );

  // Handle updating knowledge item
  const handleUpdateItem = (updatedItem: KnowledgeItem) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  // Handle adding new knowledge item
  const handleAddItem = () => {
    if (!newItem.title || !newItem.content || !newItem.category) {
      toast.error("Please fill out all required fields");
      return;
    }

    const newKnowledgeItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: newItem.title,
      content: newItem.content,
      type: newItem.type as KnowledgeType,
      category: newItem.category,
      department: newItem.department,
      createdBy: currentUser?.name || "Admin",
      createdAt: new Date().toISOString(),
    };

    setItems([newKnowledgeItem, ...items]);
    setIsAddingItem(false);
    setNewItem({
      title: "",
      content: "",
      type: "guide",
      category: "",
    });
    toast.success(`Added "${newItem.title}" to the knowledge base`);
  };

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage guides, instructions, and resources for your team
            </p>
          </div>
          
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Document</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogDescription>
                  Create a new resource for your team to reference
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    value={newItem.title || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, title: e.target.value })
                    }
                    placeholder="Document title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="type">Type*</Label>
                    <Select
                      value={newItem.type || "guide"}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, type: value as KnowledgeType })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="instruction">Instruction</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category">Category*</Label>
                    <Input
                      id="category"
                      value={newItem.category || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      placeholder="e.g. Products, Procedures"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select
                    value={newItem.department || ""}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, department: value })
                    }
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home Goods">Home Goods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="content">Content*</Label>
                  <Textarea
                    id="content"
                    value={newItem.content || ""}
                    onChange={(e) =>
                      setNewItem({ ...newItem, content: e.target.value })
                    }
                    placeholder="Enter the document content here..."
                    className="h-32"
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Add Document</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                isEditable={true}
                onUpdate={handleUpdateItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No documents found</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {searchQuery || categoryFilter || typeFilter
                ? "Try adjusting your search or filter criteria"
                : "Add a document to get started"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBase;
