
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { StaffMember } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  PlusCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionManagerProps {
  staffMember: StaffMember;
  onUpdate: (updatedSections: string[]) => void;
}

export const SectionManager = ({ staffMember, onUpdate }: SectionManagerProps) => {
  const { t, direction } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(staffMember.sections || []);

  const availableSections = [
    "canva",
    "youtube",
    "discord",
    "linkedin",
    "fortnite"
  ];

  const handleToggleSection = (section: string) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter(s => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  const handleSave = () => {
    onUpdate(selectedSections);
    setIsOpen(false);
  };

  // Get section badge style based on section name
  const getSectionBadge = (section: string) => {
    switch (section.toLowerCase()) {
      case "canva":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "youtube":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "discord":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case "linkedin":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "fortnite":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className={cn(
          "flex justify-between items-center",
          direction === "rtl" && "flex-row-reverse"
        )}>
          <span className="text-sm font-medium">{t("sections")}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        {staffMember.sections && staffMember.sections.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {staffMember.sections.map((section) => (
              <Badge
                key={section}
                variant="outline"
                className={getSectionBadge(section)}
              >
                {t(section.toLowerCase())}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("noSectionsAssigned")}
          </p>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("manageSections")}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-2">
              {availableSections.map((section) => (
                <Button
                  key={section}
                  variant="outline"
                  className={cn(
                    "justify-start text-left h-auto py-3 px-4 relative",
                    selectedSections.includes(section) && "border-primary",
                    getSectionBadge(section)
                  )}
                  onClick={() => handleToggleSection(section)}
                >
                  <span>{t(section.toLowerCase())}</span>
                  {selectedSections.includes(section) && (
                    <CheckIcon className="h-4 w-4 absolute right-2" />
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SectionManager;
