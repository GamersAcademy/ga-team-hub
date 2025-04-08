
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={toggleLanguage}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </Button>
  );
};

export default LanguageToggle;
