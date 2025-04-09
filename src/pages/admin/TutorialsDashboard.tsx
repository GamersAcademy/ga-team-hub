
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, Upload, Link, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { KnowledgeItem } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for tutorials
const initialTutorials: KnowledgeItem[] = [
  {
    id: "1",
    title: "How to process an order",
    content: "This guide covers the steps to process an order from start to finish.",
    type: "guide",
    category: "Orders",
    createdBy: "Admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Customer support best practices",
    content: "Learn how to provide exceptional customer support.",
    type: "instruction",
    category: "Support",
    createdBy: "Admin",
    createdAt: new Date().toISOString()
  }
];

const TutorialsDashboard = () => {
  const { t } = useLanguage();
  const [tutorials, setTutorials] = useState<KnowledgeItem[]>(initialTutorials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<KnowledgeItem | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Handle new tutorial button click
  const handleNewTutorial = () => {
    setIsEditMode(false);
    setCurrentTutorial(null);
    setTitle("");
    setContent("");
    setCategory("");
    setExternalLink("");
    setFiles([]);
    setIsDialogOpen(true);
  };

  // Handle edit tutorial button click
  const handleEditTutorial = (tutorial: KnowledgeItem) => {
    setIsEditMode(true);
    setCurrentTutorial(tutorial);
    setTitle(tutorial.title);
    setContent(tutorial.content);
    setCategory(tutorial.category);
    setExternalLink("");
    setFiles([]);
    setIsDialogOpen(true);
  };

  // Handle delete tutorial button click
  const handleDeleteTutorial = (id: string) => {
    setTutorials(tutorials.filter(t => t.id !== id));
    toast.success(t("tutorials.deleteSuccess"));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Handle save tutorial
  const handleSaveTutorial = () => {
    if (!title.trim() || !content.trim()) {
      toast.error(t("tutorials.errorEmptyFields"));
      return;
    }

    const newTutorial: KnowledgeItem = {
      id: currentTutorial?.id || `tutorial-${Date.now()}`,
      title,
      content,
      type: "guide",
      category,
      createdBy: "Admin",
      createdAt: currentTutorial?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: files.length > 0 ? files.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}`,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file)
      })) : undefined
    };

    if (isEditMode) {
      setTutorials(tutorials.map(t => t.id === currentTutorial?.id ? newTutorial : t));
      toast.success(t("tutorials.updateSuccess"));
    } else {
      setTutorials([...tutorials, newTutorial]);
      toast.success(t("tutorials.createSuccess"));
    }

    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("tutorials.title")}</h1>
            <p className="text-muted-foreground">
              {t("tutorials.description")}
            </p>
          </div>

          <Button onClick={handleNewTutorial} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("tutorials.newTutorial")}
          </Button>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {tutorial.category} • {new Date(tutorial.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="line-clamp-3 text-sm">{tutorial.content}</p>
                {tutorial.attachments && tutorial.attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      {tutorial.attachments.length} attachment(s)
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tutorial.attachments.map(attachment => (
                        <div 
                          key={attachment.id}
                          className="bg-gray-100 rounded p-1 text-xs flex items-center gap-1"
                        >
                          {attachment.type === "image" ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="w-4 h-4 object-cover rounded"
                            />
                          ) : (
                            <ExternalLink className="w-3 h-3" />
                          )}
                          <span className="truncate max-w-[80px]">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDeleteTutorial(tutorial.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleEditTutorial(tutorial)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  {t("tutorials.view")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Tutorial Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? t("tutorials.editTutorial") : t("tutorials.create")}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? t("tutorials.editDescription")
                  : t("tutorials.createDescription")
                }
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("tutorials.titleField")}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("tutorials.titlePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t("tutorials.category")}</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={t("tutorials.categoryPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">{t("tutorials.content")}</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("tutorials.contentPlaceholder")}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="external-link">{t("tutorials.externalLink")}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="external-link"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      disabled={!externalLink}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      {t("tutorials.addLink")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">{t("tutorials.addMedia")}</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-center text-muted-foreground mb-2">
                      {t("tutorials.dragDrop")}
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {t("tutorials.browse")}
                    </Button>
                    
                    {files.length > 0 && (
                      <div className="mt-4 w-full">
                        <p className="text-sm mb-2">
                          {files.length} file(s) selected
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {files.map((file, index) => (
                            <div 
                              key={index}
                              className="text-xs flex items-center gap-2 bg-gray-50 p-2 rounded"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                {file.type.startsWith("image/") ? (
                                  <img 
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <ExternalLink className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                              <span className="truncate flex-1">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("tutorials.cancel")}
              </Button>
              <Button onClick={handleSaveTutorial}>
                {isEditMode ? t("tutorials.update") : t("tutorials.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TutorialsDashboard;
