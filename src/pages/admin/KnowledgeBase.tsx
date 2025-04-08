
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KnowledgeCard } from "@/components/dashboard/KnowledgeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockKnowledgeItems } from "@/data/mockData";
import { KnowledgeItem, KnowledgeType, GuidePage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
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
import { CreateGuideDialog } from "@/components/dashboard/CreateGuideDialog";

const KnowledgeBase = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledgeItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<KnowledgeType | null>(null);
  const [isAddingGuide, setIsAddingGuide] = useState(false);
  const [guides, setGuides] = useState<GuidePage[]>([]);

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

  // Handle adding a new guide
  const handleAddGuide = (guide: GuidePage) => {
    setGuides([...guides, guide]);
    
    // Also add to knowledge items
    const newKnowledgeItem: KnowledgeItem = {
      id: guide.id,
      title: guide.title,
      content: guide.content,
      type: "guide",
      category: "Guide",
      createdBy: currentUser?.name || "Admin",
      createdAt: guide.createdAt,
      attachments: guide.images?.map((img, index) => ({
        id: `img-${guide.id}-${index}`,
        name: `Image ${index + 1}`,
        type: 'image',
        url: img
      }))
    };
    
    setItems([newKnowledgeItem, ...items]);
    toast.success(`Added "${guide.title}" to the knowledge base`);
  };

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("knowledge")}</h1>
            <p className="text-muted-foreground">
              {t("manageStaff")}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button className="gap-2" onClick={() => setIsAddingGuide(true)}>
              <Plus className="h-4 w-4" />
              <span>{t("addNewGuide")}</span>
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchOrders")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("all")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value as KnowledgeType || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("all")}</SelectItem>
                <SelectItem value="guide">{t("guide")}</SelectItem>
                <SelectItem value="instruction">{t("instruction")}</SelectItem>
                <SelectItem value="policy">{t("policy")}</SelectItem>
                <SelectItem value="faq">{t("faq")}</SelectItem>
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
            <h3 className="text-lg font-medium">{t("noOrdersFound")}</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {searchQuery || categoryFilter || typeFilter
                ? t("adjustSearch")
                : t("addNewGuide")}
            </p>
          </div>
        )}
      </div>

      {/* Guide creation dialog */}
      <CreateGuideDialog 
        open={isAddingGuide}
        onOpenChange={setIsAddingGuide}
        onSave={handleAddGuide}
      />
    </DashboardLayout>
  );
};

export default KnowledgeBase;
